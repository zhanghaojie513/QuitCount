import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const docsRoot = path.join(root, 'docs');
const errors = [];

async function listMarkdown(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listMarkdown(absolute)));
    if (entry.isFile() && entry.name.endsWith('.md')) files.push(absolute);
  }
  return files;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

const files = await listMarkdown(docsRoot);
for (const file of files) {
  const content = await readFile(file, 'utf8');
  const relative = path.relative(root, file);
  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, '');
    if (/^(https?:|mailto:)/.test(target)) continue;
    const [targetPath, anchor] = target.split('#', 2);
    const resolved =
      targetPath.length === 0
        ? file
        : path.resolve(path.dirname(file), decodeURIComponent(targetPath));
    if (!(await exists(resolved))) {
      errors.push(`${relative}: missing link target ${target}`);
      continue;
    }
    if (anchor) {
      const targetContent = await readFile(resolved, 'utf8');
      const slugs = [...targetContent.matchAll(/^#{1,6}\s+(.+)$/gm)].map(
        (heading) => slugify(heading[1]),
      );
      if (!slugs.includes(decodeURIComponent(anchor).toLowerCase()))
        errors.push(`${relative}: missing heading anchor ${target}`);
    }
  }
}

const adrCount = 12;
for (let index = 1; index <= adrCount; index += 1) {
  const id = String(index).padStart(3, '0');
  const matches = files.filter((file) =>
    path.basename(file).startsWith(`ADR-${id}-`),
  );
  if (matches.length !== 1) {
    errors.push(
      `ADR-${id}: expected exactly one file, found ${matches.length}`,
    );
    continue;
  }
  const content = await readFile(matches[0], 'utf8');
  if (!/^- 状态：(accepted|proposed|superseded)$/m.test(content))
    errors.push(`ADR-${id}: missing valid status`);
  if (!/^- 责任角色：.+$/m.test(content))
    errors.push(`ADR-${id}: missing owner role`);
}

const stalePhrases = [
  '当前后端目录为空',
  '本轮不初始化 NestJS',
  '本轮不执行该阶段',
];
for (const phrase of stalePhrases) {
  for (const file of files) {
    if ((await readFile(file, 'utf8')).includes(phrase))
      errors.push(`${path.relative(root, file)}: stale phrase "${phrase}"`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`docs:lint ok (${files.length} markdown files, ${adrCount} ADRs)`);
