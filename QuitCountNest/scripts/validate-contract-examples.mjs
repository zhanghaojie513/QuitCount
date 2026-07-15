import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const directory = path.join(process.cwd(), 'openapi', 'examples');
const names = (await readdir(directory))
  .filter((name) => name.endsWith('.json'))
  .sort();
const errors = [];
const examples = new Map();

for (const name of names) {
  try {
    examples.set(
      name,
      JSON.parse(await readFile(path.join(directory, name), 'utf8')),
    );
  } catch (error) {
    errors.push(`${name}: invalid JSON: ${error.message}`);
  }
}

function check(name, predicate, message) {
  const value = examples.get(name);
  if (!value) errors.push(`${name}: missing fixture`);
  else if (!predicate(value)) errors.push(`${name}: ${message}`);
}

const commonLedger = (value) =>
  typeof value.clientMutationId === 'string' &&
  typeof value.deviceId === 'string' &&
  typeof value.assetId === 'string' &&
  Number.isInteger(value.cigarettes) &&
  value.cigarettes > 0 &&
  /^\d{4}-\d{2}-\d{2}$/.test(value.localDate) &&
  Number.isInteger(value.timezoneOffsetMinutes) &&
  typeof value.modelVersion === 'string';

check(
  'ledger-take.request.json',
  (v) => commonLedger(v) && v.action === 'take' && !v.reversesEventId,
  'must be a valid take request',
);
check(
  'ledger-return.request.json',
  (v) =>
    commonLedger(v) &&
    v.action === 'return' &&
    typeof v.reversesEventId === 'string',
  'return must reference original take',
);
check(
  'ledger-retire.request.json',
  (v) =>
    commonLedger(v) && v.action === 'retire' && typeof v.batchId === 'string',
  'retire must carry batchId fixture',
);
check(
  'sync-duplicate.response.json',
  (v) => v.results?.[0]?.status === 'duplicate' && v.results[0].canonicalId,
  'must return original canonical result',
);
check(
  'sync-pending-dependency.response.json',
  (v) =>
    v.results?.[0]?.status === 'pending_dependency' &&
    v.results[0].code === 'LEDGER_DEPENDENCY_PENDING',
  'must preserve pending dependency',
);
check(
  'asset-default-conflict.response.json',
  (v) =>
    v.code === 'ASSET_DEFAULT_CONFLICT' && v.details?.canonicalDefaultAssetId,
  'must expose safe canonical default',
);
check(
  'sync-tombstone.response.json',
  (v) =>
    v.tombstones?.[0]?.resourceType === 'asset' &&
    Number.isInteger(v.tombstones[0].changeSeq),
  'must contain ordered tombstone',
);
check(
  'sync-cursor-expired.response.json',
  (v) =>
    v.code === 'SYNC_CURSOR_EXPIRED' &&
    v.details?.requiredAction === 'bootstrap',
  'must explicitly require bootstrap',
);

const errorCatalog = await readFile(
  path.join(process.cwd(), 'docs', 'error_catalog.md'),
  'utf8',
);
for (const [name, value] of examples) {
  const codes = [
    value.code,
    ...(value.results ?? []).map((result) => result.code),
  ].filter(Boolean);
  for (const code of codes)
    if (!errorCatalog.includes(`\`${code}\``))
      errors.push(`${name}: error code ${code} absent from error catalog`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`contract:examples ok (${names.length} JSON fixtures)`);
