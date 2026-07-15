import { readFile } from 'node:fs/promises';
import process from 'node:process';
import YAML from 'yaml';

const [dockerfile, dockerignore, composeText] = await Promise.all([
  readFile('Dockerfile', 'utf8'),
  readFile('.dockerignore', 'utf8'),
  readFile('compose.yaml', 'utf8'),
]);
const compose = YAML.parse(composeText);
const errors = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

assert(
  (dockerfile.match(/^FROM /gm) ?? []).length >= 2,
  'Dockerfile must use multiple stages',
);
assert(
  dockerfile.includes('USER node'),
  'runtime must use the non-root node user',
);
assert(dockerfile.includes('npm ci'), 'dependencies must use npm ci');
assert(
  dockerfile.includes('npm prune --omit=dev'),
  'runtime dependencies must be pruned',
);
assert(
  dockerfile.includes('CMD ["node", "dist/main.js"]'),
  'runtime command must start compiled NestJS entry',
);
assert(
  dockerignore.includes('node_modules') && dockerignore.includes('.env'),
  '.dockerignore must exclude dependencies and secrets',
);

const api = compose.services?.api;
assert(
  api?.build?.target === 'runtime',
  'compose api must build runtime target',
);
assert(api?.user === 'node', 'compose api must explicitly run as node');
assert(api?.read_only === true, 'compose api filesystem must be read-only');
assert(
  api?.security_opt?.includes('no-new-privileges:true'),
  'compose api must disable privilege escalation',
);
assert(
  api?.cap_drop?.includes('ALL'),
  'compose api must drop Linux capabilities',
);
assert(api?.healthcheck?.test, 'compose api must define a healthcheck');

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  'container:lint ok (multi-stage, non-root, read-only compose baseline)',
);
