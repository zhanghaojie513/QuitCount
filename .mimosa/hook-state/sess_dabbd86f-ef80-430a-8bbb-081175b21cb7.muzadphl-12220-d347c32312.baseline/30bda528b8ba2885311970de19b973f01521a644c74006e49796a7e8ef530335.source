import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BadgePlus,
  BellRing,
  BookOpen,
  Calculator,
  Check,
  ChevronRight,
  CircleHelp,
  Cloud,
  Database,
  Download,
  ExternalLink,
  Home,
  LockKeyhole,
  LogIn,
  MessageSquare,
  PackagePlus,
  RotateCcw,
  Send,
  Settings,
  ShieldAlert,
  Smartphone,
  Target,
  Trash2,
  UserRound,
  Vibrate,
  WalletCards,
  X,
} from "lucide-react";
import lungImage from "./assets/human-lungs-nih.png";

const initialInventory = [
  {
    id: "yunyan",
    brand: "云烟 细支",
    tar: 8,
    nicotine: 0.8,
    qty: 12,
    packPrice: 35,
    purchaseDate: "2026-06-03",
  },
  {
    id: "zhongnanhai",
    brand: "中南海 低焦",
    tar: 5,
    nicotine: 0.5,
    qty: 5,
    packPrice: 20,
    purchaseDate: "2026-06-05",
  },
];

const initialLedger = [
  { id: "seed-1", action: "take", brand: "南京 雨花石", tar: 9, cost: 2.65, time: "08:42" },
  { id: "seed-2", action: "take", brand: "云烟 细支", tar: 8, cost: 1.75, time: "10:23" },
  { id: "seed-3", action: "take", brand: "利群 西子", tar: 11, cost: 1.9, time: "14:15" },
  { id: "seed-4", action: "take", brand: "南京 炫赫门", tar: 10, cost: 2.1, time: "17:36" },
];

const emptyForm = {
  brand: "南京 低焦",
  tar: 6,
  nicotine: 0.6,
  qty: 10,
  packPrice: 24,
};

const DAILY_REVIEW_TIME = "21:30";
const DAILY_REMINDER_STORAGE_KEY = "quitSmoking.dailyReviewReminder";

const navItems = [
  { id: "home", label: "首页", icon: Home },
  { id: "assets", label: "资产", icon: WalletCards },
  { id: "ledger", label: "账本", icon: BookOpen },
  { id: "mine", label: "我的", icon: UserRound },
];

const routeIds = [...navItems.map((item) => item.id), "model", "settings", "login"];

function readDailyReminderDefault() {
  try {
    const stored = JSON.parse(localStorage.getItem(DAILY_REMINDER_STORAGE_KEY) || "null");
    return typeof stored?.enabled === "boolean" ? stored.enabled : true;
  } catch {
    return true;
  }
}

function notificationPermission() {
  if (!("Notification" in window)) return "unavailable";
  return Notification.permission;
}

function nextDailyReviewAt() {
  const [hour, minute] = DAILY_REVIEW_TIME.split(":").map(Number);
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= Date.now()) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

function dailyReviewStatus(enabled, permission) {
  if (!enabled) return "已关闭";
  if (permission === "granted") return `${DAILY_REVIEW_TIME} · 系统通知 + 应用内`;
  if (permission === "denied") return `${DAILY_REVIEW_TIME} · 应用内提醒`;
  return `${DAILY_REVIEW_TIME} · 应用内提醒`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function money(value) {
  const prefix = value < 0 ? "-¥" : "¥";
  return `${prefix}${Math.abs(value).toFixed(1)}`;
}

function todayLabel() {
  return new Date().toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });
}

function packAgeLabel(dateString) {
  const start = new Date(dateString);
  const today = new Date("2026-06-09T12:00:00");
  const days = Math.max(1, Math.round((today - start) / 86400000));
  return `${days} 天`;
}

function calculateDailyHarm(cigarettes, labelledTar) {
  if (cigarettes <= 0) {
    return {
      score: 0,
      rank: 0,
      label: "今日未暴露",
      tone: "clear",
      message: "今天尚未记录取出香烟。",
    };
  }

  let score;
  let rank;
  let label;
  let tone;
  let message;

  if (cigarettes === 1) {
    score = 42;
    rank = 1;
    label = "不可忽视";
    tone = "notice";
    message = "不存在安全支数。每天 1 支仍会带来显著心血管风险。";
  } else if (cigarettes <= 4) {
    score = 48 + (cigarettes - 2) * 6;
    rank = 2;
    label = "高危";
    tone = "high";
    message = "少量吸烟也不安全，不要把“少抽”误认为低风险。";
  } else if (cigarettes <= 9) {
    score = 70 + (cigarettes - 5) * 3;
    rank = 3;
    label = "强烈警示";
    tone = "severe";
    message = "已超过 1–4 支/日的低强度吸烟区间，请停止继续取烟。";
  } else if (cigarettes <= 19) {
    score = 86 + (cigarettes - 10) * 1.2;
    rank = 4;
    label = "极高危";
    tone = "critical";
    message = "当天暴露正在接近一包烟，立即停止并寻求戒烟支持。";
  } else {
    score = 100;
    rank = 5;
    label = "极端暴露";
    tone = "critical";
    message = "当天已达到或超过一包烟，请立即停止继续吸烟。";
  }

  const tarAdjustment = clamp((labelledTar - cigarettes * 6) * 0.3, -2, 5);
  return {
    score: Math.round(clamp(score + tarAdjustment, 0, 100)),
    rank,
    label,
    tone,
    message,
  };
}

export function App() {
  const [inventory, setInventory] = useState(initialInventory);
  const [ledger, setLedger] = useState(initialLedger);
  const [selectedId, setSelectedId] = useState("yunyan");
  const [activePage, setActivePage] = useState(() => {
    const requested = window.location.hash.replace("#", "");
    return routeIds.includes(requested) ? requested : "home";
  });
  const [showAdd, setShowAdd] = useState(false);
  const [showTake, setShowTake] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [goal, setGoal] = useState({
    dailyLimit: 5,
    targetDate: "2026-09-01",
    pledge: "晚饭后不再取烟",
  });
  const [tarWeight, setTarWeight] = useState(0.67);
  const [healthCostRate, setHealthCostRate] = useState(0.43);
  const [healthWarning, setHealthWarning] = useState(null);
  const [strictWarnings, setStrictWarnings] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(readDailyReminderDefault);
  const [reminderPermission, setReminderPermission] = useState(notificationPermission);
  const [reviewReminder, setReviewReminder] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [phone, setPhone] = useState("");

  const selectedAsset = inventory.find((item) => item.id === selectedId) ?? inventory[0];

  function navigate(page) {
    window.location.hash = page === "home" ? "" : page;
    setActivePage(page);
  }

  const totals = useMemo(() => {
    const stockCount = inventory.reduce((sum, item) => sum + item.qty, 0);
    const stockTar = inventory.reduce((sum, item) => sum + item.qty * item.tar, 0);
    const stockNicotine = inventory.reduce((sum, item) => sum + item.qty * item.nicotine, 0);
    const inventoryValue = inventory.reduce((sum, item) => sum + item.qty * (item.packPrice / 20), 0);
    const todayTar = ledger.reduce((sum, item) => {
      if (item.action === "take") return sum + item.tar;
      if (item.action === "return") return sum - item.tar;
      return sum;
    }, 0);
    const todayCost = ledger.reduce((sum, item) => {
      if (item.action === "take") return sum + item.cost;
      if (item.action === "return") return sum - item.cost;
      return sum;
    }, 0);
    const todayTaken = ledger.reduce((sum, item) => {
      if (item.action === "take") return sum + 1;
      if (item.action === "return") return sum - 1;
      return sum;
    }, 0);
    const lungScore = clamp(13 + todayTar * tarWeight + stockTar * 0.032, 0, 100);
    const trueCost = todayCost + todayTar * healthCostRate;
    const healthDebt = todayTar * healthCostRate + stockTar * 0.08;
    const netHealth = clamp(100 - lungScore, 0, 100);

    return {
      stockCount,
      stockTar,
      stockNicotine,
      inventoryValue,
      todayTar,
      todayCost,
      todayTaken,
      lungScore,
      trueCost,
      healthDebt,
      netHealth,
    };
  }, [healthCostRate, inventory, ledger, tarWeight]);
  const dailyHarm = useMemo(
    () => calculateDailyHarm(Math.max(0, totals.todayTaken), Math.max(0, totals.todayTar)),
    [totals.todayTaken, totals.todayTar],
  );
  const dailyReviewSnapshot = useMemo(
    () => ({
      cigarettes: Math.max(0, totals.todayTaken),
      trueCost: totals.trueCost,
      labelledTar: Math.max(0, totals.todayTar),
      harmLabel: dailyHarm.label,
      harmScore: dailyHarm.score,
      goalLimit: goal.dailyLimit,
    }),
    [dailyHarm.label, dailyHarm.score, goal.dailyLimit, totals.todayTaken, totals.todayTar, totals.trueCost],
  );
  const reminderStatus = dailyReviewStatus(dailyReminder, reminderPermission);

  function openDailyReviewReminder() {
    setReviewReminder({
      ...dailyReviewSnapshot,
      firedAt: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    });
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("戒烟有数每日复盘", {
        body: `今日取出 ${dailyReviewSnapshot.cigarettes} 支，真实日耗 ${money(
          dailyReviewSnapshot.trueCost,
        )}。`,
      });
    }
  }

  useEffect(() => {
    const nextAt = dailyReminder ? nextDailyReviewAt() : null;
    localStorage.setItem(
      DAILY_REMINDER_STORAGE_KEY,
      JSON.stringify({
        enabled: dailyReminder,
        time: DAILY_REVIEW_TIME,
        nextAt: nextAt?.toISOString() ?? null,
        permission: reminderPermission,
        updatedAt: new Date().toISOString(),
      }),
    );

    if (!dailyReminder || !nextAt) return undefined;

    const timeoutId = window.setTimeout(
      openDailyReviewReminder,
      Math.min(nextAt.getTime() - Date.now(), 2147483647),
    );
    return () => window.clearTimeout(timeoutId);
  }, [dailyReminder, dailyReviewSnapshot, reminderPermission]);

  useEffect(() => {
    window.__triggerDailyReviewForQa = openDailyReviewReminder;
    return () => {
      delete window.__triggerDailyReviewForQa;
    };
  }, [dailyReviewSnapshot, reminderPermission]);

  function addEvent(event) {
    setLedger((items) => [{ id: `${Date.now()}`, ...event }, ...items]);
  }

  async function handleDailyReminderChange(enabled) {
    setDailyReminder(enabled);
    if (!enabled || !("Notification" in window) || Notification.permission !== "default") {
      setReminderPermission(notificationPermission());
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setReminderPermission(permission);
    } catch {
      setReminderPermission(notificationPermission());
    }
  }

  function commitTake(asset) {
    if (!asset || asset.qty <= 0) return;
    if (haptics && "vibrate" in navigator) {
      navigator.vibrate(80);
    }
    setInventory((items) =>
      items.map((item) =>
        item.id === asset.id ? { ...item, qty: Math.max(0, item.qty - 1) } : item,
      ),
    );
    addEvent({
      action: "take",
      brand: asset.brand,
      tar: asset.tar,
      cost: asset.packPrice / 20,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    });
  }

  function handleTake(asset = selectedAsset) {
    if (!asset || asset.qty <= 0) return;
    const nextHarm = calculateDailyHarm(
      Math.max(0, totals.todayTaken) + 1,
      Math.max(0, totals.todayTar) + asset.tar,
    );
    const shouldWarn =
      strictWarnings &&
      (nextHarm.rank >= 3 || Math.max(0, totals.todayTar) + asset.tar >= 40);
    commitTake(asset);
    if (shouldWarn) {
      setHealthWarning({
        ...nextHarm,
        asset,
        assetId: asset.id,
        cigarettes: Math.max(0, totals.todayTaken) + 1,
        labelledTar: Math.max(0, totals.todayTar) + asset.tar,
      });
    }
  }

  function handleReturn(assetId = selectedAsset?.id) {
    const asset = inventory.find((item) => item.id === assetId) ?? selectedAsset;
    if (!asset) return;
    setInventory((items) =>
      items.map((item) => (item.id === asset.id ? { ...item, qty: item.qty + 1 } : item)),
    );
    addEvent({
      action: "return",
      brand: asset.brand,
      tar: asset.tar,
      cost: asset.packPrice / 20,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
    });
  }

  function handleClearInventory() {
    const removed = inventory.reduce((sum, item) => sum + item.qty, 0);
    setInventory((items) => items.map((item) => ({ ...item, qty: 0 })));
    addEvent({
      action: "clear",
      brand: "库存退役",
      tar: 0,
      cost: 0,
      time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      note: `清空 ${removed} 支`,
    });
  }

  function handleAddSubmit(event) {
    event.preventDefault();
    const nextAsset = {
      id: `${form.brand}-${Date.now()}`.replace(/\s+/g, "-"),
      brand: form.brand,
      tar: Number(form.tar),
      nicotine: Number(form.nicotine),
      qty: Number(form.qty),
      packPrice: Number(form.packPrice),
      purchaseDate: "2026-06-09",
    };
    setInventory((items) => [nextAsset, ...items]);
    setSelectedId(nextAsset.id);
    setShowAdd(false);
    setForm(emptyForm);
    navigate("assets");
  }

  return (
    <main className="app-shell">
      <section
        className={`phone ${
          ["model", "settings", "login"].includes(activePage) ? "sub-page-open" : ""
        }`}
        aria-label="戒烟有数原型"
      >
        <div className="phone-content">
          {activePage === "home" && (
            <HomePage
              totals={totals}
              dailyHarm={dailyHarm}
              selectedAsset={selectedAsset}
              goal={goal}
              onOpenTake={() => setShowTake(true)}
              onReturn={handleReturn}
              onOpenAssets={() => navigate("assets")}
            />
          )}

          {activePage === "assets" && (
            <AssetsPage
              inventory={inventory}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onAdd={() => setShowAdd(true)}
              onClear={handleClearInventory}
              totals={totals}
            />
          )}

          {activePage === "ledger" && (
            <LedgerPage ledger={ledger} totals={totals} dailyHarm={dailyHarm} />
          )}

          {activePage === "model" && (
            <ModelPage
              tarWeight={tarWeight}
              setTarWeight={setTarWeight}
              healthCostRate={healthCostRate}
              setHealthCostRate={setHealthCostRate}
              totals={totals}
              dailyHarm={dailyHarm}
              onBack={() => navigate("mine")}
            />
          )}

          {activePage === "mine" && (
            <MinePage
              signedIn={signedIn}
              totals={totals}
              goal={goal}
              onOpenLogin={() => navigate("login")}
              onOpenSettings={() => navigate("settings")}
              onOpenModel={() => navigate("model")}
              onOpenGoal={() => setShowGoal(true)}
              onOpenHelp={() => setShowHelp(true)}
            />
          )}

          {activePage === "settings" && (
            <SettingsPage
              strictWarnings={strictWarnings}
              setStrictWarnings={setStrictWarnings}
              haptics={haptics}
              setHaptics={setHaptics}
              dailyReminder={dailyReminder}
              setDailyReminder={handleDailyReminderChange}
              reminderStatus={reminderStatus}
              signedIn={signedIn}
              onBack={() => navigate("mine")}
              onOpenLogin={() => navigate("login")}
            />
          )}

          {activePage === "login" && (
            <LoginPage
              phone={phone}
              setPhone={setPhone}
              signedIn={signedIn}
              onBack={() => navigate("mine")}
              onContinueLocal={() => navigate("mine")}
              onSignIn={() => {
                setSignedIn(true);
                navigate("mine");
              }}
              onSignOut={() => setSignedIn(false)}
            />
          )}
        </div>

        {!["model", "settings", "login"].includes(activePage) && (
          <nav className="bottom-nav" aria-label="底部导航">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={activePage === item.id ? "active" : ""}
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                >
                  <Icon aria-hidden="true" size={19} strokeWidth={2.2} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </section>

      {showAdd && (
        <AddInventorySheet
          form={form}
          setForm={setForm}
          onClose={() => setShowAdd(false)}
          onSubmit={handleAddSubmit}
        />
      )}

      {showTake && (
        <TakeCigaretteSheet
          inventory={inventory}
          selectedId={selectedId}
          onClose={() => setShowTake(false)}
          onOpenAssets={() => {
            setShowTake(false);
            navigate("assets");
          }}
          onTake={(asset) => {
            handleTake(asset);
            setShowTake(false);
          }}
        />
      )}

      {showGoal && (
        <GoalSheet goal={goal} onClose={() => setShowGoal(false)} onSave={setGoal} />
      )}

      {showHelp && <HelpAboutModal onClose={() => setShowHelp(false)} />}

      {reviewReminder && (
        <DailyReviewModal
          reminder={reviewReminder}
          onClose={() => setReviewReminder(null)}
          onOpenLedger={() => {
            setReviewReminder(null);
            navigate("ledger");
          }}
        />
      )}

      {healthWarning && (
        <HealthWarning
          warning={healthWarning}
          onDismiss={() => setHealthWarning(null)}
        />
      )}
    </main>
  );
}

function HomePage({
  totals,
  dailyHarm,
  selectedAsset,
  goal,
  onOpenTake,
  onReturn,
  onOpenAssets,
}) {
  const lungStyle = {
    "--risk": `${clamp(totals.lungScore, 0, 100)}%`,
    "--risk-alpha": `${clamp(totals.lungScore / 125, 0.12, 0.72)}`,
    "--lung-saturate": `${clamp(1.45 - totals.lungScore / 150, 0.6, 1.3)}`,
    "--lung-brightness": `${clamp(1.08 - totals.lungScore / 250, 0.74, 1.04)}`,
  };

  return (
    <section className="page home-page">
      <header className="topbar">
        <div>
          <h1>戒烟有数</h1>
          <p>今日 · {todayLabel()}</p>
        </div>
        <span className="model-pill">模型 A1</span>
      </header>

      <section className="score-block">
        <div className="eyebrow">肺部负担指数</div>
        <div className="score-row">
          <strong>{totals.lungScore.toFixed(1)}</strong>
          <span>/ 100</span>
        </div>
        <p>
          库存 {totals.stockCount} 支 · 今日取出 {Math.max(0, totals.todayTaken)} 支 ·
          目标少于 {goal.dailyLimit} 支
        </p>
      </section>

      <DailyHarmBanner harm={dailyHarm} cigarettes={totals.todayTaken} />

      <section className="lung-stage" style={lungStyle}>
        <div className="stage-chip">实时渲染</div>
        <img className="lung-image" src={lungImage} alt="肺部状态渲染" />
        <div className="risk-wash" aria-hidden="true" />
        <div className="burden-note">
          每取出一支
          <br />
          肺色加深 {(selectedAsset?.tar * 0.24 || 1.5).toFixed(1)}%
        </div>
      </section>

      <section className="metric-strip" aria-label="真实成本概览">
        <Metric label="真实日耗" value={money(totals.trueCost)} />
        <Metric label="健康净值" value={`${totals.netHealth.toFixed(0)}%`} />
        <Metric label="库存焦油" value={`${totals.stockTar.toFixed(0)}mg`} />
      </section>

      <section className="home-actions">
        <button className="secondary" type="button" onClick={onOpenAssets}>
          <WalletCards aria-hidden="true" size={18} />
          查看资产
        </button>
        <button
          className="primary"
          disabled={totals.stockCount <= 0}
          type="button"
          onClick={onOpenTake}
        >
          <Activity aria-hidden="true" size={18} />
          取出一支
        </button>
      </section>

      <button className="ghost-action" type="button" onClick={onReturn}>
        <RotateCcw aria-hidden="true" size={16} />
        放回库存，撤销一次真实成本
      </button>
    </section>
  );
}

function AssetsPage({ inventory, selectedId, setSelectedId, onAdd, onClear, totals }) {
  return (
    <section className="page assets-page">
      <PageHeader
        kicker="香烟资产"
        title="库存总览"
        description="参考资产管理方式，把每包烟看成会带来健康负债的库存资产。"
      />

      <section className="balance-panel">
        <div>
          <span>香烟库存价值</span>
          <strong>{money(totals.inventoryValue)}</strong>
        </div>
        <div>
          <span>健康负债</span>
          <strong>-{money(totals.healthDebt)}</strong>
        </div>
      </section>

      <section className="ledger-summary">
        <Metric label="库存支数" value={`${totals.stockCount}支`} />
        <Metric label="焦油库存" value={`${totals.stockTar.toFixed(0)}mg`} />
        <Metric label="尼古丁" value={`${totals.stockNicotine.toFixed(1)}mg`} />
      </section>

      <div className="section-title">
        <div>
          <h2>持有资产</h2>
          <p>点击设为首页默认，取烟时仍可重新选择。</p>
        </div>
        <button className="icon-button" type="button" onClick={onAdd} aria-label="添加香烟资产">
          <BadgePlus aria-hidden="true" size={19} />
        </button>
      </div>

      <div className="asset-list">
        {inventory.map((item) => (
          (() => {
            const risk = item.qty <= 3 ? "low-stock" : item.tar >= 8 ? "high-tar" : "low-tar";
            const isSelected = selectedId === item.id;
            const label = isSelected ? "默认" : item.qty <= 3 ? "偏低" : item.tar >= 8 ? "偏高" : "较低";
            return (
          <button
            className={`asset-row ${isSelected ? "selected" : ""}`}
            key={item.id}
            type="button"
            onClick={() => setSelectedId(item.id)}
          >
            <span>
              <strong>{item.brand}</strong>
              <small>
                {item.tar}mg 焦油 · {item.qty} 支库存 · 持有 {packAgeLabel(item.purchaseDate)}
              </small>
            </span>
            <em className={risk}>{label}</em>
          </button>
            );
          })()
        ))}
      </div>

      <button className="danger" type="button" onClick={onClear}>
        <Trash2 aria-hidden="true" size={18} />
        清空库存并记录退役
      </button>
    </section>
  );
}

function LedgerPage({ ledger, totals, dailyHarm }) {
  return (
    <section className="page ledger-page">
      <PageHeader
        kicker="真实日耗"
        title={money(totals.trueCost)}
        description="把今天的每支烟换算成金钱支出、焦油摄入和健康成本。"
      />

      <section className={`hazard-summary ${dailyHarm.tone}`}>
        <div>
          <span>当日危害警示分</span>
          <strong>{dailyHarm.score}</strong>
        </div>
        <div>
          <b>{dailyHarm.label}</b>
          <p>{dailyHarm.message}</p>
        </div>
      </section>

      <section className="cost-breakdown">
        <div>
          <span>直接花费</span>
          <strong>{money(totals.todayCost)}</strong>
        </div>
        <div>
          <span>健康折算</span>
          <strong>{money(totals.todayTar * 0.43)}</strong>
        </div>
        <div>
          <span>焦油摄入</span>
          <strong>{Math.max(0, totals.todayTar).toFixed(0)}mg</strong>
        </div>
      </section>

      <div className="daily-bars" aria-hidden="true">
        {[26, 38, 22, 54, 31, 47, 42].map((height, index) => (
          <span key={index} style={{ height: `${height}px` }} />
        ))}
      </div>

      <div className="section-title compact">
        <div>
          <h2>今日流转</h2>
          <p>记录取出、放回和库存退役。</p>
        </div>
        <strong>{ledger.length}</strong>
      </div>

      <div className="activity-list">
        {ledger.map((event) => (
          <div className="activity-item" key={event.id}>
            <span className={`activity-dot ${event.action}`} />
            <div>
              <strong>{event.brand}</strong>
              <small>
                {event.action === "take"
                  ? "取出"
                  : event.action === "return"
                    ? "放回"
                    : event.note}
                {event.action !== "clear" ? ` · ${event.tar}mg 焦油` : ""}
              </small>
            </div>
            <time>{event.time}</time>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModelPage({
  tarWeight,
  setTarWeight,
  healthCostRate,
  setHealthCostRate,
  totals,
  dailyHarm,
  onBack,
}) {
  return (
    <section className="page model-page sub-page">
      <SubPageHeader title="危害模型与证据" onBack={onBack} />
      <PageHeader
        kicker="统计模型"
        title="真实成本 A1"
        description="用公开数据模型接入前，先用可调参数验证核心体验。"
      />

      <section className="formula-box">
        <span>肺部负担指数</span>
        <strong>13 + 今日焦油 × {tarWeight.toFixed(2)} + 库存焦油 × 0.032</strong>
      </section>

      <label className="slider-row">
        <span>
          焦油权重 <strong>{tarWeight.toFixed(2)}</strong>
        </span>
        <input
          max="1.2"
          min="0.3"
          step="0.01"
          type="range"
          value={tarWeight}
          onChange={(event) => setTarWeight(Number(event.target.value))}
        />
      </label>

      <label className="slider-row">
        <span>
          健康折算 <strong>{money(healthCostRate)}/mg</strong>
        </span>
        <input
          max="1.2"
          min="0.1"
          step="0.01"
          type="range"
          value={healthCostRate}
          onChange={(event) => setHealthCostRate(Number(event.target.value))}
        />
      </label>

      <section className="model-result">
        <Metric label="当前负担" value={`${totals.lungScore.toFixed(1)}`} />
        <Metric label="真实日耗" value={money(totals.trueCost)} />
      </section>

      <section className="evidence-box">
        <div className="evidence-head">
          <ShieldAlert aria-hidden="true" size={19} />
          <strong>公开证据锚点</strong>
        </div>
        <p>
          当前警示为 {dailyHarm.label}。CDC 指出少量或偶尔吸烟也会提高肺癌风险；BMJ
          荟萃分析显示，每天 1 支烟的额外心血管风险约为每天 20 支的三分之一到二分之一。
        </p>
        <div className="source-links">
          <a href="https://www.cdc.gov/lung-cancer/risk-factors/index.html">
            CDC <ExternalLink aria-hidden="true" size={13} />
          </a>
          <a href="https://www.bmj.com/content/360/bmj.j5855">
            BMJ <ExternalLink aria-hidden="true" size={13} />
          </a>
        </div>
      </section>

      <p className="model-note">
        警示分级用于行为干预，不是疾病概率或医学诊断。品牌标称焦油量不等同于个人实际吸入量。
      </p>
    </section>
  );
}

function MinePage({
  signedIn,
  totals,
  goal,
  onOpenLogin,
  onOpenSettings,
  onOpenModel,
  onOpenGoal,
  onOpenHelp,
}) {
  return (
    <section className="page mine-page">
      <PageHeader
        kicker="个人与数据"
        title="我的"
        description="管理戒烟目标、数据同步和产品偏好。"
      />

      <section className="profile-panel">
        <div className="profile-avatar">
          <UserRound aria-hidden="true" size={25} />
        </div>
        <div className="profile-copy">
          <strong>{signedIn ? "已开启云端同步" : "本地戒烟档案"}</strong>
          <span>{signedIn ? "手机号账户 · 数据已保护" : "数据仅保存在当前设备"}</span>
        </div>
        <button type="button" onClick={onOpenLogin}>
          {signedIn ? "管理" : "开启同步"}
        </button>
      </section>

      <section className="personal-summary">
        <Metric label="连续记录" value="7天" />
        <Metric label="本周少抽" value="9支" />
        <Metric label="健康净值" value={`${totals.netHealth.toFixed(0)}%`} />
      </section>

      <div className="menu-group">
        <MenuRow
          icon={Cloud}
          label="数据与同步"
          value={signedIn ? "已开启" : "仅本机"}
          onClick={onOpenLogin}
        />
        <MenuRow
          icon={Target}
          label="戒烟目标"
          value={`每日少于 ${goal.dailyLimit} 支`}
          onClick={onOpenGoal}
        />
        <MenuRow icon={Calculator} label="危害模型与证据" value="A1" onClick={onOpenModel} />
      </div>

      <div className="menu-group">
        <MenuRow icon={Settings} label="设置" onClick={onOpenSettings} />
        <MenuRow icon={CircleHelp} label="帮助与关于" value="原型版" onClick={onOpenHelp} />
      </div>

      <p className="privacy-note">
        不登录也可完整记录。开启同步只用于跨设备恢复库存、账本与设置。
      </p>
    </section>
  );
}

function SettingsPage({
  strictWarnings,
  setStrictWarnings,
  haptics,
  setHaptics,
  dailyReminder,
  setDailyReminder,
  reminderStatus,
  signedIn,
  onBack,
  onOpenLogin,
}) {
  return (
    <section className="page settings-page sub-page">
      <SubPageHeader title="设置" onBack={onBack} />

      <h2 className="settings-label">提醒与干预</h2>
      <div className="settings-group">
        <ToggleRow
          icon={BellRing}
          label="严厉危害警示"
           description="达到干预线时，记录成功后提醒风险"
          checked={strictWarnings}
          onChange={setStrictWarnings}
        />
        <ToggleRow
          icon={Vibrate}
          label="取烟反馈"
          description="记录取出时提供震动反馈"
          checked={haptics}
          onChange={setHaptics}
        />
        <ToggleRow
          icon={Target}
          label="每日复盘提醒"
          description={reminderStatus}
          checked={dailyReminder}
          onChange={setDailyReminder}
        />
      </div>

      <h2 className="settings-label">数据与隐私</h2>
      <div className="settings-group">
        <MenuRow
          icon={Cloud}
          label="跨设备同步"
          value={signedIn ? "已开启" : "未开启"}
          onClick={onOpenLogin}
        />
        <MenuRow icon={Download} label="导出戒烟账本" value="CSV" />
        <MenuRow icon={Database} label="本地数据" value="17 条记录" />
      </div>

      <section className="privacy-box">
        <LockKeyhole aria-hidden="true" size={19} />
        <div>
          <strong>隐私优先</strong>
          <p>默认本地使用；不登录也能使用全部记录功能。</p>
        </div>
      </section>
    </section>
  );
}

function LoginPage({ phone, setPhone, signedIn, onBack, onContinueLocal, onSignIn, onSignOut }) {
  const canSubmit = /^1\d{10}$/.test(phone);

  return (
    <section className="page login-page sub-page">
      <SubPageHeader title="账户与同步" onBack={onBack} />

      <div className="login-mark">
        {signedIn ? <Check aria-hidden="true" size={30} /> : <Cloud aria-hidden="true" size={30} />}
      </div>
      <span className="login-kicker">{signedIn ? "同步已开启" : "可选账户"}</span>
      <h1>{signedIn ? "戒烟数据已保护" : "让记录跟着你走"}</h1>
      <p className="login-lead">
        {signedIn
          ? "库存、账本、目标和警示偏好会在设备间同步。"
          : "登录只用于跨设备同步与恢复。你也可以继续仅在本机使用。"}
      </p>

      {!signedIn && (
        <>
          <label className="phone-field">
            手机号
            <span>
              <Smartphone aria-hidden="true" size={18} />
              <input
                inputMode="numeric"
                maxLength="11"
                placeholder="输入 11 位手机号"
                value={phone}
                onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
              />
            </span>
          </label>

          <button className="primary wide" disabled={!canSubmit} type="button" onClick={onSignIn}>
            <LogIn aria-hidden="true" size={18} />
            手机号快捷登录
          </button>
          <button className="secondary wide login-secondary" type="button" onClick={onSignIn}>
            使用 Apple 登录
          </button>
        </>
      )}

      {signedIn && (
        <section className="sync-status-card">
          <Check aria-hidden="true" size={20} />
          <div>
            <strong>库存、账本和目标已纳入同步</strong>
            <p>关闭后仍保留当前设备上的本地记录。</p>
          </div>
        </section>
      )}

      {signedIn && (
        <>
          <button className="primary wide" type="button" onClick={onBack}>
            <Check aria-hidden="true" size={18} />
            返回我的
          </button>
          <button className="sync-off-button" type="button" onClick={onSignOut}>
            <Cloud aria-hidden="true" size={18} />
            关闭云端同步
          </button>
        </>
      )}

      <button className="local-button" type="button" onClick={onContinueLocal}>
        {signedIn ? "继续使用" : "暂不登录，继续本地使用"}
      </button>

      <section className="login-benefits">
        <div>
          <Database aria-hidden="true" size={18} />
          <span>恢复库存与账本</span>
        </div>
        <div>
          <LockKeyhole aria-hidden="true" size={18} />
          <span>同步前加密保护</span>
        </div>
      </section>
    </section>
  );
}

function TakeCigaretteSheet({ inventory, selectedId, onClose, onOpenAssets, onTake }) {
  const sortedInventory = [...inventory].sort((left, right) => {
    if (left.id === selectedId) return -1;
    if (right.id === selectedId) return 1;
    return right.qty - left.qty;
  });
  const availableCount = sortedInventory.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="take-sheet" role="dialog" aria-modal="true" aria-label="选择取出香烟">
        <div className="sheet-head">
          <div>
            <h2>选择取出香烟</h2>
            <p>默认烟排在最上方，避免首页误取。</p>
          </div>
          <button type="button" className="close-icon-button" onClick={onClose} aria-label="关闭">
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="take-list">
          {sortedInventory.map((item) => {
            const isDefault = item.id === selectedId;
            return (
              <button
                className={`take-row ${isDefault ? "default" : ""}`}
                disabled={item.qty <= 0}
                key={item.id}
                type="button"
                onClick={() => onTake(item)}
              >
                <span>
                  <strong>{item.brand}</strong>
                  <small>
                    {item.tar}mg 焦油 · {item.qty} 支库存 · {money(item.packPrice / 20)}/支
                  </small>
                </span>
                <em>{isDefault ? "默认" : "取出"}</em>
              </button>
            );
          })}
        </div>

        <button className="secondary wide" type="button" onClick={onOpenAssets}>
          <WalletCards aria-hidden="true" size={18} />
          管理库存与默认烟
        </button>

        <p className="sheet-note">
           当前可取库存 {availableCount} 支。触发严厉警示时会先记录，再显示风险提醒。
        </p>
      </section>
    </div>
  );
}

function GoalSheet({ goal, onClose, onSave }) {
  const [draft, setDraft] = useState(goal);

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      dailyLimit: clamp(Number(draft.dailyLimit) || 1, 1, 99),
      targetDate: draft.targetDate,
      pledge: draft.pledge.trim() || "减少非必要取烟",
    });
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form className="goal-sheet" onSubmit={handleSubmit}>
        <div className="sheet-head">
          <div>
            <h2>编辑戒烟目标</h2>
            <p>目标会影响首页提示和个人页状态。</p>
          </div>
          <button type="button" className="close-icon-button" onClick={onClose} aria-label="关闭">
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="form-grid">
          <label>
            每日上限
            <input
              min="1"
              max="99"
              type="number"
              value={draft.dailyLimit}
              onChange={(event) =>
                setDraft((value) => ({ ...value, dailyLimit: event.target.value }))
              }
            />
          </label>
          <label>
            目标日期
            <input
              type="date"
              value={draft.targetDate}
              onChange={(event) =>
                setDraft((value) => ({ ...value, targetDate: event.target.value }))
              }
            />
          </label>
        </div>

        <label>
          戒烟承诺
          <input
            value={draft.pledge}
            onChange={(event) => setDraft((value) => ({ ...value, pledge: event.target.value }))}
          />
        </label>

        <button className="primary wide" type="submit">
          <Target aria-hidden="true" size={18} />
          保存目标
        </button>
      </form>
    </div>
  );
}

function HelpAboutModal({ onClose }) {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="modal-backdrop help-backdrop" role="presentation">
      <section className="help-modal" role="dialog" aria-modal="true" aria-label="帮助与关于">
        <div className="sheet-head">
          <div>
            <h2>帮助与关于</h2>
            <p>戒烟有数 · 原型版 0.2.0</p>
          </div>
          <button type="button" className="close-icon-button" onClick={onClose} aria-label="关闭">
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <section className="update-box">
          <strong>
            <MessageSquare aria-hidden="true" size={16} />
            版本更新
          </strong>
          <p>新增可选同步、目标编辑、取烟选择和模型证据入口调整。</p>
        </section>

        <label className="feedback-box">
          建议与反馈
          <textarea
            placeholder="写下你希望改进的地方"
            value={feedback}
            onChange={(event) => {
              setFeedback(event.target.value);
              setSubmitted(false);
            }}
          />
        </label>

        <button
          className="primary wide"
          disabled={!feedback.trim()}
          type="button"
          onClick={() => setSubmitted(true)}
        >
          <Send aria-hidden="true" size={18} />
          提交反馈
        </button>
        {submitted && <p className="feedback-done">已记录到本次原型反馈。</p>}
      </section>
    </div>
  );
}

function DailyReviewModal({ reminder, onClose, onOpenLedger }) {
  const overGoal = reminder.cigarettes >= reminder.goalLimit;

  return (
    <div className="modal-backdrop review-backdrop" role="presentation">
      <section className="daily-review-modal" role="dialog" aria-modal="true" aria-label="每日复盘提醒">
        <div className="review-icon">
          <BellRing aria-hidden="true" size={25} />
        </div>
        <span>每日复盘 · {reminder.firedAt}</span>
        <h2>今天的真实成本</h2>
        <p>
          今日取出 <strong>{reminder.cigarettes} 支</strong>，累计标称焦油{" "}
          <strong>{reminder.labelledTar.toFixed(0)}mg</strong>，真实日耗{" "}
          <strong>{money(reminder.trueCost)}</strong>。
        </p>

        <section className={`review-status ${overGoal ? "over" : "under"}`}>
          <strong>{overGoal ? "已达到戒烟目标线" : "仍低于目标线"}</strong>
          <small>
            目标少于 {reminder.goalLimit} 支 · 当前危害 {reminder.harmScore} 分 ·{" "}
            {reminder.harmLabel}
          </small>
        </section>

        <div className="review-actions">
          <button className="secondary" type="button" onClick={onClose}>
            稍后再看
          </button>
          <button className="primary" type="button" onClick={onOpenLedger}>
            <BookOpen aria-hidden="true" size={18} />
            查看账本
          </button>
        </div>
      </section>
    </div>
  );
}

function SubPageHeader({ title, onBack }) {
  return (
    <header className="sub-page-header">
      <button className="icon-button" type="button" onClick={onBack} aria-label="返回我的">
        <ArrowLeft aria-hidden="true" size={20} />
      </button>
      <strong>{title}</strong>
      <span aria-hidden="true" />
    </header>
  );
}

function MenuRow({ icon: Icon, label, value, onClick }) {
  return (
    <button className="menu-row" type="button" onClick={onClick}>
      <span className="menu-icon">
        <Icon aria-hidden="true" size={18} />
      </span>
      <strong>{label}</strong>
      {value && <em>{value}</em>}
      <ChevronRight aria-hidden="true" size={17} />
    </button>
  );
}

function ToggleRow({ icon: Icon, label, description, checked, onChange }) {
  return (
    <div className="toggle-row">
      <span className="menu-icon">
        <Icon aria-hidden="true" size={18} />
      </span>
      <div>
        <strong>{label}</strong>
        <small>{description}</small>
      </div>
      <button
        aria-label={`${label}${checked ? "已开启" : "已关闭"}`}
        aria-pressed={checked}
        className={`switch ${checked ? "on" : ""}`}
        type="button"
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

function DailyHarmBanner({ harm, cigarettes }) {
  return (
    <section className={`daily-harm-banner ${harm.tone}`}>
      <div className="harm-score">
        <span>当日危害</span>
        <strong>{harm.score}</strong>
      </div>
      <div>
        <b>{harm.label}</b>
        <p>
          {Math.max(0, cigarettes)} 支 · {harm.message}
        </p>
      </div>
    </section>
  );
}

function HealthWarning({ warning, onDismiss }) {
  return (
    <div className="modal-backdrop warning-backdrop" role="presentation">
      <section className="health-warning" role="status" aria-live="polite" aria-label="取烟后风险提示">
        <div className="warning-icon">
          <AlertTriangle aria-hidden="true" size={28} strokeWidth={2.5} />
        </div>
        <span>记录成功 · {warning.label}</span>
        <h2>这次取烟已记录</h2>
        <p className="warning-lead">
          本次取烟已记录。今天累计 <strong>{warning.cigarettes} 支</strong>，标称焦油{" "}
          <strong>{warning.labelledTar}mg</strong>。
        </p>
        <p>
          {warning.message}
          公开研究不存在“安全支数”，继续吸烟会进一步增加心血管、肺癌及其他疾病风险。
        </p>
        <div className="warning-actions">
          <button className="warning-confirm" type="button" onClick={onDismiss}>
            我已知晓风险
          </button>
        </div>
        <small>提示不会撤销已记录的取烟。该信息用于戒烟行为干预，不替代医生诊断或紧急医疗服务。</small>
      </section>
    </div>
  );
}

function AddInventorySheet({ form, setForm, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <form className="add-sheet" onSubmit={onSubmit}>
        <div className="sheet-head">
          <div>
            <h2>添加香烟资产</h2>
            <p>录入后会进入库存焦油和真实日耗模型。</p>
          </div>
          <button type="button" className="close-button" onClick={onClose}>
            关闭
          </button>
        </div>
        <label>
          品牌名称
          <input
            value={form.brand}
            onChange={(event) => setForm((value) => ({ ...value, brand: event.target.value }))}
          />
        </label>
        <div className="form-grid">
          <label>
            焦油 mg/支
            <input
              min="1"
              max="20"
              type="number"
              value={form.tar}
              onChange={(event) => setForm((value) => ({ ...value, tar: event.target.value }))}
            />
          </label>
          <label>
            尼古丁 mg
            <input
              min="0"
              max="3"
              step="0.1"
              type="number"
              value={form.nicotine}
              onChange={(event) =>
                setForm((value) => ({ ...value, nicotine: event.target.value }))
              }
            />
          </label>
        </div>
        <div className="form-grid">
          <label>
            库存支数
            <input
              min="1"
              max="100"
              type="number"
              value={form.qty}
              onChange={(event) => setForm((value) => ({ ...value, qty: event.target.value }))}
            />
          </label>
          <label>
            每包价格
            <input
              min="1"
              max="200"
              type="number"
              value={form.packPrice}
              onChange={(event) =>
                setForm((value) => ({ ...value, packPrice: event.target.value }))
              }
            />
          </label>
        </div>
        <button className="primary wide" type="submit">
          <PackagePlus aria-hidden="true" size={18} />
          加入库存
        </button>
      </form>
    </div>
  );
}

function PageHeader({ kicker, title, description }) {
  return (
    <header className="page-header">
      <span>{kicker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
