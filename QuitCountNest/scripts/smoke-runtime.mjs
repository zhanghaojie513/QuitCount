import { spawn } from 'node:child_process';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';

const port = 3191;
const child = spawn(process.execPath, ['dist/main.js'], {
  env: { ...process.env, NODE_ENV: 'test', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
child.stdout.on('data', (chunk) => {
  output += chunk;
});
child.stderr.on('data', (chunk) => {
  output += chunk;
});

async function waitUntilReady() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.status === 200 && (await response.text()) === 'Hello World!')
        return;
    } catch {
      // Startup is still in progress.
    }
    await delay(200);
  }
  throw new Error(`runtime did not become ready\n${output}`);
}

try {
  await waitUntilReady();
  const signal = process.platform === 'win32' ? 'SIGINT' : 'SIGTERM';
  child.kill(signal);
  const exited = await Promise.race([
    new Promise((resolve) => child.once('exit', () => resolve(true))),
    delay(5000, false),
  ]);
  if (!exited) throw new Error(`runtime did not exit after ${signal}`);
  console.log(`runtime:smoke ok (GET / = 200, exited after ${signal})`);
} finally {
  if (child.exitCode === null && child.signalCode === null) child.kill();
}
