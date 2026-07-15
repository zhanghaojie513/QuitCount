import { readFile } from 'node:fs/promises';
import process from 'node:process';
import YAML from 'yaml';

const text = await readFile('openapi/backend-v1.yaml', 'utf8');
const parsed = YAML.parseDocument(text, { strict: true, uniqueKeys: true });
const errors = parsed.errors.map((error) => `YAML: ${error.message}`);
const api = parsed.toJS();

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function resolvePointer(pointer) {
  if (!pointer.startsWith('#/')) return undefined;
  return pointer
    .slice(2)
    .split('/')
    .reduce(
      (value, segment) =>
        value?.[segment.replace(/~1/g, '/').replace(/~0/g, '~')],
      api,
    );
}

function walk(value, visitor, location = '#') {
  if (!value || typeof value !== 'object') return;
  visitor(value, location);
  for (const [key, child] of Object.entries(value))
    walk(child, visitor, `${location}/${key}`);
}

assert(api.openapi === '3.0.3', 'openapi must be exactly 3.0.3');
assert(api.info?.version, 'info.version is required');
assert(
  api.servers?.[0]?.url?.includes('localhost'),
  'Stage 0 must not invent a deployed server domain',
);

const requiredPaths = [
  '/health/live',
  '/auth/sessions',
  '/users/me',
  '/devices',
  '/assets',
  '/ledger-events',
  '/goals/current',
  '/settings',
  '/sync/bootstrap',
  '/sync/push',
  '/sync/pull',
  '/privacy/exports',
  '/privacy/account-deletion',
];
for (const requiredPath of requiredPaths)
  assert(api.paths?.[requiredPath], `missing required path ${requiredPath}`);

const operationIds = new Set();
for (const [route, pathItem] of Object.entries(api.paths ?? {})) {
  for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
    const operation = pathItem[method];
    if (!operation) continue;
    assert(
      operation.operationId,
      `${method.toUpperCase()} ${route}: operationId required`,
    );
    if (operation.operationId) {
      assert(
        !operationIds.has(operation.operationId),
        `duplicate operationId ${operation.operationId}`,
      );
      operationIds.add(operation.operationId);
    }
  }
}

walk(api, (value, location) => {
  if (typeof value.$ref === 'string')
    assert(
      resolvePointer(value.$ref),
      `${location}: unresolved $ref ${value.$ref}`,
    );
});

const schemas = api.components?.schemas ?? {};
assert(
  !schemas.UpdateAssetProfileRequest?.properties?.stockCount,
  'asset profile update must not write stockCount',
);
assert(
  schemas.CreateAssetRequest?.properties?.packPriceFen?.type === 'integer',
  'packPriceFen must be integer',
);
assert(
  schemas.LedgerEvent?.properties?.costFen?.type === 'integer',
  'costFen must be integer',
);
assert(schemas.ReturnEventRequest, 'return event schema required');
assert(
  schemas.RiskSnapshot?.required?.includes('modelVersion'),
  'RiskSnapshot.modelVersion required',
);
assert(
  schemas.RiskSnapshot?.properties?.netHealth?.description?.includes(
    '100 - lungScore',
  ),
  'netHealth formula must use lungScore',
);
assert(
  schemas.SyncMutationResult?.properties?.status?.enum?.includes(
    'pending_dependency',
  ),
  'sync pending_dependency status required',
);
assert(schemas.Tombstone, 'tombstone schema required');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `openapi:validate ok (${Object.keys(api.paths).length} paths, ${operationIds.size} operations, ${Object.keys(schemas).length} schemas)`,
);
