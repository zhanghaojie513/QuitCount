import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = 9300 + Math.floor(Math.random() * 300);
const profile = join(tmpdir(), `quit-smoking-settings-${Date.now()}`);
const targetUrl = "http://127.0.0.1:4180/#settings";

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
  await sleep(80);
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

async function takeDefaultCigarette() {
  await clickButton("取出一支");
  await clickButton("云烟 细支");
}

await send("Runtime.enable");
for (let attempt = 0; attempt < 40; attempt += 1) {
  const ready = await evaluate(
    `document.body.innerText.includes("严厉危害警示")`,
  );
  if (ready) break;
  await sleep(100);
}

const initialSwitches = await evaluate(`(() =>
  [...document.querySelectorAll(".switch")].map((item) => ({
    label: item.getAttribute("aria-label"),
    pressed: item.getAttribute("aria-pressed"),
  }))
)()`);

await clickButton("返回我的");
await clickButton("首页");
const beforeStrictTakeStats = await readHomeTakeStats();
await takeDefaultCigarette();
const warningWhenOn = await evaluate(
  `document.querySelector(".health-warning") !== null`,
);
const beforeStrictConfirmStats = await readHomeTakeStats();
assert(warningWhenOn, "Strict warning should appear while strict warnings are enabled.");
assert(
  beforeStrictConfirmStats.todayTaken === beforeStrictTakeStats.todayTaken,
  "Strict warning flow changed today's count before confirmation.",
);
assert(
  beforeStrictConfirmStats.stockCount === beforeStrictTakeStats.stockCount,
  "Strict warning flow changed inventory before confirmation.",
);

await clickButton("我已知晓风险");
const warningAfterDismiss = await evaluate(
  `document.querySelector(".health-warning") !== null`,
);
const afterStrictConfirmStats = await readHomeTakeStats();
assert(
  afterStrictConfirmStats.todayTaken === beforeStrictTakeStats.todayTaken + 1,
  "Strict warning flow did not add today's count after confirmation.",
);
assert(
  afterStrictConfirmStats.stockCount === beforeStrictTakeStats.stockCount - 1,
  "Strict warning flow did not reduce inventory after confirmation.",
);
await clickButton("我的");
await clickButton("设置");
await clickButton("严厉危害警示已开启");
const strictAfterOff = await evaluate(
  `document.querySelector('[aria-label^="严厉危害警示"]')?.getAttribute("aria-pressed")`,
);
await clickButton("返回我的");
await clickButton("首页");
const warningBeforeOffTake = await evaluate(
  `document.querySelector(".health-warning") !== null`,
);
await takeDefaultCigarette();
const warningWhenOff = await evaluate(
  `document.querySelector(".health-warning") !== null`,
);

await evaluate(`(() => {
  window.__vibrateCalls = 0;
  Object.defineProperty(navigator, "vibrate", {
    configurable: true,
    value: () => {
      window.__vibrateCalls += 1;
      return true;
    },
  });
})()`);
await takeDefaultCigarette();
const vibrateCalls = await evaluate(`window.__vibrateCalls`);

await clickButton("我的");
await clickButton("设置");
const storageBefore = await evaluate(`JSON.stringify(localStorage)`);
await clickButton("每日复盘提醒已开启");
const reminderAfterOff = await evaluate(`({
  pressed: document.querySelector('[aria-label^="每日复盘提醒"]')?.getAttribute("aria-pressed"),
  storage: JSON.stringify(localStorage),
  notificationPermission: typeof Notification === "undefined" ? "unavailable" : Notification.permission,
})`);
await clickButton("每日复盘提醒已关闭");
await sleep(300);
const reminderAfterOn = await evaluate(`({
  pressed: document.querySelector('[aria-label^="每日复盘提醒"]')?.getAttribute("aria-pressed"),
  storage: JSON.stringify(localStorage),
  notificationPermission: typeof Notification === "undefined" ? "unavailable" : Notification.permission,
})`);
await evaluate(`window.__triggerDailyReviewForQa?.()`);
await sleep(120);
const reviewModal = await evaluate(`({
  open: document.querySelector(".daily-review-modal") !== null,
  text: document.querySelector(".daily-review-modal")?.innerText || ""
})`);

console.log(
  JSON.stringify(
    {
      initialSwitches,
      strictWarning: {
        warningWhenOn,
        warningAfterDismiss,
        beforeStrictTakeStats,
        beforeStrictConfirmStats,
        afterStrictConfirmStats,
        strictAfterOff,
        warningBeforeOffTake,
        warningWhenOff,
      },
      takeFeedback: {
        vibrateCalls,
      },
      dailyReminder: {
        storageBefore,
        afterOff: reminderAfterOff,
        afterOn: reminderAfterOn,
        reviewModal,
      },
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
  // Chrome can keep dictionary files briefly locked on Windows.
}
