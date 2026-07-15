import { readFile } from 'node:fs/promises';
import process from 'node:process';
import YAML from 'yaml';

const argument = process.argv
  .slice(2)
  .find((value) => value.startsWith('--base='));
const separateIndex = process.argv.indexOf('--base');
const baseFile =
  argument?.slice('--base='.length) ??
  (separateIndex >= 0
    ? process.argv[separateIndex + 1]
    : 'openapi/baselines/backend-v1.stage0.yaml');
const currentFile = 'openapi/backend-v1.yaml';

async function load(file) {
  return YAML.parse(await readFile(file, 'utf8'));
}

const [base, current] = await Promise.all([load(baseFile), load(currentFile)]);
const errors = [];
const methods = ['get', 'post', 'put', 'patch', 'delete'];

for (const [route, basePath] of Object.entries(base.paths ?? {})) {
  const currentPath = current.paths?.[route];
  if (!currentPath) {
    errors.push(`removed path ${route}`);
    continue;
  }
  for (const method of methods) {
    const baseOperation = basePath[method];
    if (!baseOperation) continue;
    const currentOperation = currentPath[method];
    if (!currentOperation) {
      errors.push(`removed operation ${method.toUpperCase()} ${route}`);
      continue;
    }
    for (const status of Object.keys(baseOperation.responses ?? {})) {
      if (!currentOperation.responses?.[status])
        errors.push(
          `removed response ${status} from ${method.toUpperCase()} ${route}`,
        );
    }
    const baseParameters = [
      ...(basePath.parameters ?? []),
      ...(baseOperation.parameters ?? []),
    ].filter((item) => !item.$ref);
    const currentParameters = [
      ...(currentPath.parameters ?? []),
      ...(currentOperation.parameters ?? []),
    ].filter((item) => !item.$ref);
    for (const parameter of baseParameters) {
      const match = currentParameters.find(
        (item) => item.in === parameter.in && item.name === parameter.name,
      );
      if (!match)
        errors.push(
          `removed parameter ${parameter.in}:${parameter.name} from ${method.toUpperCase()} ${route}`,
        );
      else if (!parameter.required && match.required)
        errors.push(
          `parameter became required ${parameter.in}:${parameter.name} on ${method.toUpperCase()} ${route}`,
        );
    }
  }
}

function compareSchema(name, baseSchema, currentSchema, location = name) {
  if (!currentSchema) {
    errors.push(`removed schema ${location}`);
    return;
  }
  if (baseSchema.type && currentSchema.type !== baseSchema.type)
    errors.push(
      `changed type at ${location}: ${baseSchema.type} -> ${currentSchema.type}`,
    );
  if (baseSchema.format && currentSchema.format !== baseSchema.format)
    errors.push(
      `changed format at ${location}: ${baseSchema.format} -> ${currentSchema.format}`,
    );
  if (baseSchema.enum) {
    for (const value of baseSchema.enum)
      if (!currentSchema.enum?.includes(value))
        errors.push(
          `removed enum value ${JSON.stringify(value)} at ${location}`,
        );
  }
  const baseRequired = new Set(baseSchema.required ?? []);
  for (const value of currentSchema.required ?? [])
    if (!baseRequired.has(value))
      errors.push(`new required property ${location}.${value}`);
  for (const [property, schema] of Object.entries(
    baseSchema.properties ?? {},
  )) {
    compareSchema(
      name,
      schema,
      currentSchema.properties?.[property],
      `${location}.${property}`,
    );
  }
  if (baseSchema.items)
    compareSchema(name, baseSchema.items, currentSchema.items, `${location}[]`);
}

for (const [name, schema] of Object.entries(base.components?.schemas ?? {}))
  compareSchema(name, schema, current.components?.schemas?.[name]);

if (errors.length > 0) {
  console.error(
    `OpenAPI breaking changes against ${baseFile}:\n${errors.map((error) => `- ${error}`).join('\n')}`,
  );
  process.exit(1);
}
console.log(`openapi:breaking ok (base: ${baseFile})`);
