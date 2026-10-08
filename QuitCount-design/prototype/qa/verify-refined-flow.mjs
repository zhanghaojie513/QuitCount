import { spawn } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9400 + Math.floor(Math.random() * 300);
const profile = join(tmpdir(), `quit-smoking-refined-${Date.now()}`);
const targetUrl = "http://127.0.0.1:4180/refined.html#";
const screenshotDir = fileURLToPath(new URL("./", import.meta.url));
const viewportWidth = Number(process.env.REFINED_VIEWPORT ?? "390");
const screenshotSuffix = `${viewportWidth}`;

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    targetUrl,
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getPageTarget() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page" && target.url.includes("refined.html"));
      if (page) return page;
    } catch {
      await sleep(100);
    }
    await sleep(100);
  }
  throw new Error("Chrome page target did not become available.");
}

const page = await getPageTarget();
const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let messageId = 0;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

function send(method, params = {}) {
  messageId += 1;
  const id = messageId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Evaluation failed.");
  return result.result.value;
}

async function waitForText(text) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const found = await evaluate(`document.body.innerText.includes(${JSON.stringify(text)})`);
    if (found) return;
    await sleep(100);
  }
  throw new Error(`Text not found: ${text}`);
}

async function clickButton(label) {
  const clicked = await evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find((item) =>
      (item.getAttribute("aria-label") || item.innerText.trim()).includes(${JSON.stringify(label)})
    );
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Button not found: ${label}`);
  await sleep(120);
}

async function setField(selector, value) {
  const ok = await evaluate(`(() => {
    const field = document.querySelector(${JSON.stringify(selector)});
    if (!field) return false;
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(field), "value").set;
    setter.call(field, ${JSON.stringify(value)});
    field.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  })()`);
  if (!ok) throw new Error(`Field not found: ${selector}`);
  await sleep(100);
}

async function capture(name) {
  const result = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(join(screenshotDir, name), Buffer.from(result.data, "base64"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await send("Runtime.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: viewportWidth,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
await waitForText("戒烟有数");
await capture(`refined-home-${screenshotSuffix}.png`);

const bottomNav = await evaluate(`([...document.querySelectorAll(".bottom-nav button")]).map((button) => button.innerText.trim())`);
assert(bottomNav.length === 4, "Refined preview must keep four bottom navigation items.");
assert(!bottomNav.includes("模型"), "Model must remain a secondary page.");

await clickButton("资产");
await waitForText("库存总览");
await capture(`refined-assets-${screenshotSuffix}.png`);

await clickButton("账本");
await waitForText("今日流转");
await capture(`refined-ledger-${screenshotSuffix}.png`);

await clickButton("我的");
await waitForText("个人与数据");
await capture(`refined-mine-${screenshotSuffix}.png`);

await clickButton("首页");
const beforeTake = await evaluate(`(() => {
  const text = document.body.innerText;
  const taken = text.match(/今日取出\\s*(\\d+)\\s*支/);
  const stock = text.match(/库存\\s*(\\d+)\\s*支/);
  return { todayTaken: taken ? Number(taken[1]) : null, stockCount: stock ? Number(stock[1]) : null };
})()`);
await clickButton("取出一支");
assert(await evaluate(`document.body.innerText.includes("选择取出香烟")`), "Take sheet did not open.");
await clickButton("云烟 细支");
await waitForText("记录成功");
await waitForText("这次取烟已记录");
await capture(`refined-warning-${screenshotSuffix}.png`);
const afterTake = await evaluate(`(() => {
  const text = document.body.innerText;
  const taken = text.match(/今日取出\\s*(\\d+)\\s*支/);
  const stock = text.match(/库存\\s*(\\d+)\\s*支/);
  return { todayTaken: taken ? Number(taken[1]) : null, stockCount: stock ? Number(stock[1]) : null };
})()`);
assert(afterTake.todayTaken === beforeTake.todayTaken + 1, "Take did not update today's count before warning dismissal.");
assert(afterTake.stockCount === beforeTake.stockCount - 1, "Take did not update inventory before warning dismissal.");
await clickButton("我已知晓风险");

await clickButton("我的");
await clickButton("危害模型与证据");
assert(await evaluate(`document.body.innerText.includes("真实成本 A1")`), "Model page did not open.");
assert(!(await evaluate(`document.querySelector(".bottom-nav") !== null`)), "Secondary page must hide bottom navigation.");
await clickButton("返回我的");

await clickButton("戒烟目标");
await setField(".goal-sheet input[type='number']", "3");
await clickButton("保存目标");
assert(await evaluate(`document.body.innerText.includes("每日少于 3 支")`), "Goal was not saved.");

await clickButton("帮助与关于");
await waitForText("版本更新");
await setField(".feedback-box textarea", "希望支持更多戒烟阶段目标");
await clickButton("提交反馈");
assert(await evaluate(`document.body.innerText.includes("已记录到本次原型反馈")`), "Feedback was not submitted.");
await clickButton("关闭");

await clickButton("数据与同步");
await clickButton("使用 Apple 登录");
assert(await evaluate(`document.body.innerText.includes("已开启云端同步")`), "Local sync demo did not sign in.");
await clickButton("管理");
await clickButton("关闭云端同步");
assert(await evaluate(`document.body.innerText.includes("可选账户")`), "Local sync demo did not sign out.");

console.log(JSON.stringify({ viewportWidth, bottomNav, screenshots: 5, take: { beforeTake, afterTake }, secondaryNavigation: true, goal: true, feedback: true, sync: true }, null, 2));

socket.close();
chrome.kill();
await sleep(250);
try {
  await rm(profile, { force: true, recursive: true });
} catch {
}
