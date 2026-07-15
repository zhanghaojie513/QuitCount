import { readFile } from 'node:fs/promises';
import process from 'node:process';
import YAML from 'yaml';

const file = '.github/workflows/ci.yml';
const text = await readFile(file, 'utf8');
const workflow = YAML.parse(text);
const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

assert(workflow.name === 'quality', 'workflow name must be quality');
assert(
  workflow.permissions?.contents === 'read',
  'workflow permissions must default to contents: read',
);
assert(
  workflow.jobs?.verify?.['timeout-minutes'] <= 15,
  'verify job must have a bounded timeout',
);
assert(
  workflow.jobs?.container?.needs === 'verify',
  'container build must wait for verification',
);
assert(
  text.includes('actions/setup-node@v4'),
  'workflow must use official setup-node action',
);
assert(
  text.includes('node-version: 24.16.0'),
  'workflow must pin Node.js 24.16.0',
);
assert(
  text.includes('run: npm ci'),
  'workflow must install the lockfile with npm ci',
);
assert(
  text.includes('run: npm run ci:verify'),
  'workflow must call the local-equivalent gate',
);
assert(
  text.includes('docker build --target runtime'),
  'workflow must build the runtime image',
);
assert(
  text.includes('docker run --detach'),
  'workflow must run the built image',
);
assert(
  text.includes("docker image inspect --format '{{.Config.User}}'"),
  'workflow must verify the image user',
);
assert(
  text.includes('curl --silent --show-error --fail'),
  'workflow must verify the running HTTP endpoint',
);
assert(
  text.includes('docker kill --signal SIGTERM'),
  'workflow must verify Linux SIGTERM shutdown',
);
assert(
  text.includes("'{{.State.ExitCode}}'"),
  'workflow must require a clean container exit',
);

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  'ci:lint ok (Node 24, npm ci, local-equivalent gate, container build)',
);
