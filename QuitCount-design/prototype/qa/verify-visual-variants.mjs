import { spawn } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const screenshotDir = fileURLToPath(new URL("./", import.meta.url));
const viewportWidth = Number(process.env.VARIANTS_VIEWPORT ?? "390");
const serverOrigin = process.env.VARIANTS_ORIGIN ?? "http://127.0.0.1:4180";
const variants = ["balanced", "rich", "impact"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function runVariant(variant, variantIndex) {
  const port = 9780 + variantIndex;
  const profile = join(tmpdir(), `quit-smoking-${variant}-${Date.now()}`);
  const targetUrl = `${serverOrigin}/${variant}.html#`;
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--remote-debugging-address=127.0.0.1",
      "--remote-allow-origins=*",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      targetUrl,
    ],
    { stdio: "ignore" },
  );

  async function getPageTarget() {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/json/list`);
        const targets = await response.json();
        const page = targets.find((target) => target.type === "page" && target.url.includes(`${variant}.html`));
        if (page) return page;
      } catch {
        await sleep(100);
      }
      await sleep(100);
    }
    throw new Error(`${variant}: Chrome page target did not become available.`);
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
    const timeoutId = setTimeout(() => {
      reject(new Error(`${variant}: CDP socket did not open.`));
    }, 10000);
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
    socket.addEventListener("open", () => clearTimeout(timeoutId), { once: true });
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
      if (await evaluate(`document.body.innerText.includes(${JSON.stringify(text)})`)) return;
      await sleep(100);
    }
    throw new Error(`${variant}: text not found: ${text}`);
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
    assert(clicked, `${variant}: button not found: ${label}`);
    await sleep(140);
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
    assert(ok, `${variant}: field not found: ${selector}`);
    await sleep(100);
  }

  async function capture(name) {
    await sleep(1000);
    const result = await send("Page.captureScreenshot", { format: "png" });
    await writeFile(join(screenshotDir, name), Buffer.from(result.data, "base64"));
  }

  try {
    await send("Runtime.enable");
    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: viewportWidth,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await waitForText("戒烟有数");
    await capture(`${variant}-home-${viewportWidth}.png`);

    const bottomNav = await evaluate(`([...document.querySelectorAll(".bottom-nav button")]).map((button) => button.innerText.trim())`);
    assert(bottomNav.length === 4, `${variant}: expected four bottom navigation items.`);
    assert(JSON.stringify(bottomNav) === JSON.stringify(["首页", "资产", "账本", "我的"]), `${variant}: unexpected bottom navigation labels.`);

    await clickButton("资产");
    await waitForText("库存总览");
    await capture(`${variant}-assets-${viewportWidth}.png`);

    await clickButton("账本");
    await waitForText("今日流转");
    await capture(`${variant}-ledger-${viewportWidth}.png`);

    await clickButton("我的");
    await waitForText("个人与数据");
    await capture(`${variant}-mine-${viewportWidth}.png`);

    await clickButton("首页");
    const beforeTake = await evaluate(`(() => {
      const text = document.body.innerText;
      const taken = text.match(/今日取出\\s*(\\d+)\\s*支/);
      const stock = text.match(/库存\\s*(\\d+)\\s*支/);
      return { todayTaken: taken ? Number(taken[1]) : null, stockCount: stock ? Number(stock[1]) : null };
    })()`);
    await clickButton("取出一支");
    await waitForText("选择取出香烟");
    await clickButton("云烟 细支");
    await waitForText("这次取烟已记录");
    await capture(`${variant}-warning-${viewportWidth}.png`);
    const afterTake = await evaluate(`(() => {
      const text = document.body.innerText;
      const taken = text.match(/今日取出\\s*(\\d+)\\s*支/);
      const stock = text.match(/库存\\s*(\\d+)\\s*支/);
      return { todayTaken: taken ? Number(taken[1]) : null, stockCount: stock ? Number(stock[1]) : null };
    })()`);
    assert(afterTake.todayTaken === beforeTake.todayTaken + 1, `${variant}: take did not update today's count.`);
    assert(afterTake.stockCount === beforeTake.stockCount - 1, `${variant}: take did not update inventory.`);
    await clickButton("我已知晓风险");
    await clickButton("放回库存");

    const afterReturn = await evaluate(`(() => {
      const text = document.body.innerText;
      const taken = text.match(/今日取出\\s*(\\d+)\\s*支/);
      const stock = text.match(/库存\\s*(\\d+)\\s*支/);
      return { todayTaken: taken ? Number(taken[1]) : null, stockCount: stock ? Number(stock[1]) : null };
    })()`);
    assert(afterReturn.todayTaken === beforeTake.todayTaken, `${variant}: return did not restore today's count.`);
    assert(afterReturn.stockCount === beforeTake.stockCount, `${variant}: return did not restore inventory.`);

    await clickButton("我的");
    await clickButton("危害模型与证据");
    await waitForText("真实成本 A1");
    await capture(`${variant}-model-${viewportWidth}.png`);
    assert(!(await evaluate(`document.querySelector(".bottom-nav") !== null`)), `${variant}: secondary page shows bottom nav.`);
    await clickButton("返回我的");

    await clickButton("设置");
    await waitForText("提醒与干预");
    await capture(`${variant}-settings-${viewportWidth}.png`);
    await clickButton("严厉危害警示");
    await clickButton("返回我的");

    await clickButton("戒烟目标");
    await setField(".goal-sheet input[type='number']", "3");
    await clickButton("保存目标");
    assert(await evaluate(`document.body.innerText.includes("每日少于 3 支")`), `${variant}: goal was not saved.`);

    await clickButton("帮助与关于");
    await waitForText("版本更新");
    await setField(".feedback-box textarea", "希望支持更多戒烟阶段目标");
    await clickButton("提交反馈");
    assert(await evaluate(`document.body.innerText.includes("已记录到本次原型反馈")`), `${variant}: feedback was not submitted.`);
    await clickButton("关闭");

    await clickButton("数据与同步");
    await clickButton("使用 Apple 登录");
    await waitForText("已开启云端同步");
    await clickButton("管理");
    await clickButton("关闭云端同步");
    assert(await evaluate(`document.body.innerText.includes("可选账户")`), `${variant}: sync did not sign out.`);

    return { variant, bottomNav, screenshots: 6, take: { beforeTake, afterTake }, return: afterReturn };
  } finally {
    socket.close();
    chrome.kill();
    await sleep(250);
    try {
      await rm(profile, { force: true, recursive: true });
    } catch {
    }
  }
}

const results = [];
for (const [variantIndex, variant] of variants.entries()) {
    results.push(await runVariant(variant, variantIndex));
}

console.log(JSON.stringify({ viewportWidth, variants: results }, null, 2));
