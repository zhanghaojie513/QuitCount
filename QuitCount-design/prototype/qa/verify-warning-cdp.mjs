import fs from "node:fs";

const output = process.env.OUT_SCREEN;
const cdpPort = process.env.CDP_PORT || "9225";

async function readJsonList() {
  const url = `http://127.0.0.1:${cdpPort}/json/list`;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      return await (await fetch(url)).json();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`CDP endpoint did not become ready on port ${cdpPort}`);
}

async function main() {
  const list = await readJsonList();
  const page = list.find((entry) => entry.type === "page");
  if (!page) throw new Error("No CDP page found");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const messageId = id++;
      pending.set(messageId, resolve);
      ws.send(JSON.stringify({ id: messageId, method, params }));
    });

  await send("Page.enable");
  await send("Page.navigate", { url: "http://127.0.0.1:4173/" });
  await send("Runtime.evaluate", {
    expression: "new Promise(r => setTimeout(r, 900))",
    awaitPromise: true,
  });
  await send("Runtime.evaluate", {
    expression: "new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))",
    awaitPromise: true,
  });
  const clickResult = await send("Runtime.evaluate", {
    expression: `
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const labels = buttons.map((button) => button.textContent.replace(/\\s+/g, ' ').trim());
        const target = buttons.find((button) => button.textContent.replace(/\\s+/g, '').includes('取出一支'));
        if (!target) return { ok: false, labels };
        target.scrollIntoView({ block: 'center' });
        target.click();
        return { ok: true, labels };
      })()
    `,
    returnByValue: true,
  });
  if (!clickResult.result.result.value?.ok) {
    throw new Error(`Take button not found: ${JSON.stringify(clickResult.result.result.value)}`);
  }
  await send("Runtime.evaluate", {
    expression: "new Promise(r => setTimeout(r, 500))",
    awaitPromise: true,
  });

  const heading = await send("Runtime.evaluate", {
    expression: "document.querySelector('.health-warning h2')?.textContent || ''",
    returnByValue: true,
  });
  const screenshot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(output, Buffer.from(screenshot.result.data, "base64"));
  console.log(
    JSON.stringify({
      warningHeading: heading.result.result.value,
      screenshot: output,
    }),
  );
  ws.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
