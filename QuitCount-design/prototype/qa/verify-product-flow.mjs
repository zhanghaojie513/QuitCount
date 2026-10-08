import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9400 + Math.floor(Math.random() * 300);
const profile = join(tmpdir(), `quit-smoking-product-flow-${Date.now()}`);
const targetUrl = "http://127.0.0.1:4180/#";

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
      const page = targets.find((target) => target.type === "page" && target.url.includes("4180"));
      if (page) return page;
    } catch {
      // Chrome may still be starting.
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
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
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
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Evaluation failed.");
  }
  return result.result.value;
}

async function waitForText(text) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const found = await evaluate(`document.body.innerText.includes(${JSON.stringify(text)})`);
    if (found) return true;
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readHomeTakeStats() {
  return evaluate(`(() => {
    const text = document.body.innerText;
    const taken = text.match(/今日取出\\s*(\\d+)\\s*支/);
    const stock = text.match(/库存\\s*(\\d+)\\s*支/);
    return {
      todayTaken: taken ? Number(taken[1]) : null,
      stockCount: stock ? Number(stock[1]) : null,
    };
  })()`);
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
  await sleep(80);
}

await send("Runtime.enable");
await waitForText("戒烟有数");

const bottomNav = await evaluate(`(() =>
  [...document.querySelectorAll(".bottom-nav button")].map((button) => button.innerText.trim())
)()`);

await clickButton("取出一支");
const beforeTakeStats = await readHomeTakeStats();
const takeSheetOpen = await evaluate(`document.body.innerText.includes("选择取出香烟")`);
const takeRows = await evaluate(`document.querySelectorAll(".take-row").length`);
await clickButton("云烟 细支");
const warningShown = await evaluate(`document.querySelector(".health-warning") !== null`);
const beforeConfirmStats = await readHomeTakeStats();
assert(warningShown, "Strict warning should appear before a high-risk take is committed.");
assert(
  beforeConfirmStats.todayTaken === beforeTakeStats.todayTaken,
  "Today taken count changed before acknowledging the risk warning.",
);
assert(
  beforeConfirmStats.stockCount === beforeTakeStats.stockCount,
  "Inventory count changed before acknowledging the risk warning.",
);
await clickButton("我已知晓风险");
const afterConfirmStats = await readHomeTakeStats();
assert(
  afterConfirmStats.todayTaken === beforeTakeStats.todayTaken + 1,
  "Today taken count did not increment after acknowledging the risk warning.",
);
assert(
  afterConfirmStats.stockCount === beforeTakeStats.stockCount - 1,
  "Inventory count did not decrement after acknowledging the risk warning.",
);

await clickButton("我的");
await clickButton("危害模型与证据");
const modelOpened = await evaluate(`document.body.innerText.includes("真实成本 A1")`);
const modelHasBottomNav = await evaluate(`document.querySelector(".bottom-nav") !== null`);
await clickButton("返回我的");

await clickButton("戒烟目标");
await setField(".goal-sheet input[type='number']", "3");
await clickButton("保存目标");
const goalUpdated = await evaluate(`document.body.innerText.includes("每日少于 3 支")`);

await clickButton("帮助与关于");
const helpOpened = await evaluate(`document.body.innerText.includes("版本更新")`);
await setField(".feedback-box textarea", "希望支持更多戒烟阶段目标");
await clickButton("提交反馈");
const feedbackSubmitted = await evaluate(`document.body.innerText.includes("已记录到本次原型反馈")`);
await clickButton("关闭");

await clickButton("数据与同步");
await clickButton("使用 Apple 登录");
const signedIn = await evaluate(`document.body.innerText.includes("已开启云端同步")`);
await clickButton("管理");
await clickButton("关闭云端同步");
const syncClosed = await evaluate(`document.body.innerText.includes("可选账户")`);

console.log(
  JSON.stringify(
    {
      bottomNav,
      modelRemovedFromBottomNav: bottomNav.length === 4 && !bottomNav.includes("模型"),
      takeSheet: {
        takeSheetOpen,
        takeRows,
        warningShown,
        beforeTakeStats,
        beforeConfirmStats,
        afterConfirmStats,
      },
      modelEntry: { modelOpened, modelHasBottomNav },
      goalUpdated,
      help: { helpOpened, feedbackSubmitted },
      sync: { signedIn, syncClosed },
    },
    null,
    2,
  ),
);

socket.close();
chrome.kill();
await sleep(250);
try {
  await rm(profile, { force: true, recursive: true });
} catch {
  // Chrome can keep profile files briefly locked on Windows.
}
