/* ============================================================
   戒烟有数 · 28 屏原型内容
   数据口径唯一权威：design/design-spec.md 第 4 节（模型 A1）
   本文件只描述「长什么样」，规则看 design-full.html
   注意：任何界面上的数字若与 design-spec.md §4 冲突，以 §4 为准。
   ============================================================ */

/* ---------- 复用片段 ---------- */
const IC = {
  back:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#1A211E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  x:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#6B7570" stroke-width="2.2" stroke-linecap="round"/></svg>',
  chev:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="#B8BFBA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#38665F" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  checkW:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  warn:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 8v5M12 16.5v.5" stroke="#C26B32" stroke-width="2.4" stroke-linecap="round"/><path d="M12 3l9 16H3l9-16z" stroke="#C26B32" stroke-width="1.9" stroke-linejoin="round"/></svg>',
  shield:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z" stroke="#38665F" stroke-width="1.9" stroke-linejoin="round"/></svg>',
  plus:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#38665F" stroke-width="2.4" stroke-linecap="round"/></svg>',
  plusW:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
  target:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="#38665F" stroke-width="1.9"/><circle cx="12" cy="12" r="3.4" stroke="#38665F" stroke-width="1.9"/></svg>',
  doc:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M6 3h8l4 4v14H6V3z" stroke="#38665F" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12h6M9 16h4" stroke="#38665F" stroke-width="1.8" stroke-linecap="round"/></svg>',
  chart:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20V9M10 20V4M16 20v-7M22 20H2" stroke="#38665F" stroke-width="2" stroke-linecap="round"/></svg>',
  lock:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="4.5" y="10" width="15" height="10.5" rx="2.6" stroke="#38665F" stroke-width="1.8"/><path d="M8 10V7.5a4 4 0 018 0V10" stroke="#38665F" stroke-width="1.8"/></svg>',
  sync:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 01-13.6 5.7M4 12a8 8 0 0113.6-5.7" stroke="#38665F" stroke-width="1.9" stroke-linecap="round"/><path d="M17 3v3.4h-3.4M7 21v-3.4h3.4" stroke="#38665F" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  trash:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" stroke="#A5765C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bell:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M6 17V11a6 6 0 1112 0v6l1.5 2.5h-15L6 17z" stroke="#38665F" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20.5a2 2 0 004 0" stroke="#38665F" stroke-width="1.8" stroke-linecap="round"/></svg>',
  vib:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="8" y="3" width="8" height="18" rx="2.4" stroke="#38665F" stroke-width="1.8"/><path d="M3 9v6M21 9v6" stroke="#38665F" stroke-width="1.8" stroke-linecap="round"/></svg>',
  book:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5V5.5z" stroke="#38665F" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 8h8M8 12h5" stroke="#38665F" stroke-width="1.8" stroke-linecap="round"/></svg>',
  help:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#38665F" stroke-width="1.8"/><path d="M9.6 9.2a2.5 2.5 0 114.2 2.4c-.9.7-1.8 1.2-1.8 2.4M12 17v.4" stroke="#38665F" stroke-width="1.8" stroke-linecap="round"/></svg>',
  mailbox:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="5.5" width="18" height="13" rx="2.6" stroke="#38665F" stroke-width="1.8"/><path d="M4 7.5l8 5.5 8-5.5" stroke="#38665F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  up:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M6 11l6-6 6 6" stroke="#38665F" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  spark:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.2 5.4L20 9.5l-5.8 2.1L12 17l-2.2-5.4L4 9.5l5.8-2.1L12 2z" stroke="#C26B32" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  tool:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M14.5 6.5a4 4 0 105.2 5.2L21 13l-8 8-2-2 8-8-1.3-1.3z" stroke="#38665F" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  clock:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.6" stroke="#38665F" stroke-width="1.8"/><path d="M12 7.4V12l3.2 2" stroke="#38665F" stroke-width="1.8" stroke-linecap="round"/></svg>',
  pulse:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12h3.5l2-5.5 3.2 11L14.5 12H21" stroke="#38665F" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pump:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#38665F" stroke-width="1.9"/><path d="M12 7.5v9M9 10.5l3-3 3 3" stroke="#38665F" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gear:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.1" stroke="#1A211E" stroke-width="1.9"/><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1.03 1.56V21a2 2 0 11-4 0v-.09A1.7 1.7 0 008.98 19.3a1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.7 1.7 0 004.62 15a1.7 1.7 0 00-1.56-1.03H3a2 2 0 110-4h.09A1.7 1.7 0 004.62 8.94a1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06A1.7 1.7 0 009 4.58a1.7 1.7 0 001.03-1.56V3a2 2 0 114 0v.09a1.7 1.7 0 001.03 1.56 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.42 9v.02a1.7 1.7 0 001.56 1.03H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.51 1z" stroke="#1A211E" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  person:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.6" r="3.7" stroke="#F8F6F2" stroke-width="1.9"/><path d="M5.2 20c0-3.6 3-6 6.8-6s6.8 2.4 6.8 6" stroke="#F8F6F2" stroke-width="1.9" stroke-linecap="round"/></svg>'
};

/* 状态栏 */
const STATUS = (dark) => `
  <div class="statusbar" ${dark?'style="color:#fff"':''}>
    <span class="num">21:30</span>
    <div class="sb-icons">
      <div class="sb-bar"><i></i><i></i><i></i><i></i></div>
      <span style="font-size:11px;font-weight:600;margin:0 1px">5G</span>
      <div class="sb-batt"><i></i></div>
    </div>
  </div>`;

/* Tab Bar */
/* Tab Bar —— 规格见 design-full.html「版式」+「交互规则」
   ① 激活项 = 实心品牌绿胶囊 + 白内容（全栏唯一实色形）
   ② 特殊动作项「取出」= 透明底 + 品牌绿内容，图标是脉冲波形（不是加号）
   ③ 普通项 = 透明底 + 中性灰内容 */
const TABBAR = (active, takeDisabled) => `
  <div class="tabbar">
    <div class="tab ${active==='home'?'on':''}">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3.5l9 7V20a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 20v-9.5z" stroke="${active==='home'?'#FFFFFF':'#9AA39D'}" stroke-width="1.9" stroke-linejoin="round"/></svg>
      首页
    </div>
    <div class="tab ${active==='assets'?'on':''}">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="${active==='assets'?'#FFFFFF':'#9AA39D'}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.4" y="5.6" width="15.2" height="12.8" rx="2.6"/><path d="M3.4 9.4h15.2"/><circle cx="18.6" cy="13.4" r="2.1"/></svg>
      资产
    </div>
    <div class="tab take ${takeDisabled?'dis':''}">
      <div class="tb-ic">
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none"><path d="M3 12h3.4l2.1-6 3.3 12 2.2-6H21" stroke="${takeDisabled?'#C6CFC9':'#38665F'}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      取出
    </div>
    <div class="tab ${active==='ledger'?'on':''}">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path d="M12 6.5C10.5 5 8.8 4.3 6.8 4.3c-1 0-1.8.1-2.5.3v14c.7-.2 1.5-.3 2.5-.3 2 0 3.7.7 5.2 2.2M12 6.5c1.5-1.5 3.2-2.2 5.2-2.2 1 0 1.8.1 2.5.3v14c-.7-.2-1.5-.3-2.5-.3-2 0-3.7.7-5.2 2.2M12 6.5v14" stroke="${active==='ledger'?'#FFFFFF':'#9AA39D'}" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/></svg>
      账本
    </div>
    <div class="tab ${active==='mine'?'on':''}">
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.5" r="3.6" stroke="${active==='mine'?'#FFFFFF':'#9AA39D'}" stroke-width="1.9"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" stroke="${active==='mine'?'#FFFFFF':'#9AA39D'}" stroke-width="1.9" stroke-linecap="round"/></svg>
      我的
    </div>
  </div>`;

/* 品牌标识（刻度柱 + 琥珀燃点）—— 与 design/logo/mark.svg 同源
   用于登录页 84 / 关于页 48 两处品牌位 */
const LOGO = (size, radius) => `
  <svg width="${size}" height="${size}" viewBox="0 0 96 96" fill="none" style="flex:none;border-radius:${radius}px;background:#F2F7F5">
    <line x1="10" y1="74" x2="86" y2="74" stroke="#C6D5CF" stroke-width="4" stroke-linecap="round"/>
    <rect x="8" y="20" width="14" height="52" rx="7" fill="#38665F"/>
    <rect x="30" y="34" width="14" height="38" rx="7" fill="#38665F"/>
    <rect x="52" y="46" width="14" height="26" rx="7" fill="#38665F"/>
    <rect x="74" y="56" width="14" height="16" rx="7" fill="#38665F"/>
    <path d="M8 37 L8 27 A7 7 0 0 1 22 27 L22 37 Z" fill="#C26B32"/>
  </svg>`;

/* 肺插画
   与设计稿一致：两片透光叶体（鼠尾草描边 + 更浅填充）+ 中央气管与支气管 +
   两个珊瑚橙肺叶尖 + 背后极浅圆形光晕。
   「偏 3D」的做法：叶体用径向渐变做内侧体积、肺叶尖加一点高光，
   但不加投影/倒角/镜面 —— 守住全 App 的扁平语言（无拟物、无高光）。
   opacity 由负担决定（重负担 85% / 今日 0 支 35%）。 */
function lung(opacity){
  return `
  <svg class="lung-svg" viewBox="0 0 240 200" fill="none" style="opacity:${opacity}">
    <defs>
      <!-- 叶体：外缘深、内侧亮，做出体积 -->
      <radialGradient id="lgLobe" cx="38%" cy="34%" r="78%">
        <stop offset="0%"   stop-color="#DCEBE3"/>
        <stop offset="62%"  stop-color="#E7F2EC"/>
        <stop offset="100%" stop-color="#D3E5DB"/>
      </radialGradient>
      <!-- 肺叶尖：珊瑚橙，右下收暗做出球感 -->
      <radialGradient id="lgTip" cx="36%" cy="30%" r="82%">
        <stop offset="0%"   stop-color="#F2C9A6"/>
        <stop offset="55%"  stop-color="#E8AE83"/>
        <stop offset="100%" stop-color="#D99668"/>
      </radialGradient>
      <linearGradient id="lgTube" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stop-color="#8CBCAC"/>
        <stop offset="45%"  stop-color="#A8CFC1"/>
        <stop offset="100%" stop-color="#7FB1A0"/>
      </linearGradient>
      <linearGradient id="lgEdge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#A5CBBC"/>
        <stop offset="100%" stop-color="#8ABAAB"/>
      </linearGradient>
    </defs>

    <!-- 光晕 -->
    <circle cx="120" cy="106" r="86" fill="#F1F6F3"/>

    <!-- 气管 + 支气管（先画，被叶体压住下半段） -->
    <rect x="115.5" y="16" width="9" height="62" rx="4.5" fill="url(#lgTube)"/>
    <path d="M120 74 L96 100"  stroke="url(#lgTube)" stroke-width="8.5" stroke-linecap="round"/>
    <path d="M120 74 L144 100" stroke="url(#lgTube)" stroke-width="8.5" stroke-linecap="round"/>

    <!-- 左叶 -->
    <path d="M112 92 C96 88 78 96 68 112 C56 132 54 156 64 170 C74 184 96 186 108 176 C116 169 116 156 115 140 C114 120 114 102 112 92 Z"
          fill="url(#lgLobe)" stroke="url(#lgEdge)" stroke-width="2.6" stroke-linejoin="round"/>
    <!-- 右叶 -->
    <path d="M128 92 C144 88 162 96 172 112 C184 132 186 156 176 170 C166 184 144 186 132 176 C124 169 124 156 125 140 C126 120 126 102 128 92 Z"
          fill="url(#lgLobe)" stroke="url(#lgEdge)" stroke-width="2.6" stroke-linejoin="round"/>

    <!-- 左叶尖（珊瑚橙，球感） -->
    <ellipse cx="82" cy="146" rx="21" ry="18" fill="url(#lgTip)"/>
    <ellipse cx="76" cy="139" rx="7" ry="5.4" fill="#FADFC4" opacity=".62"/>
    <!-- 右叶尖 -->
    <ellipse cx="158" cy="146" rx="21" ry="18" fill="url(#lgTip)"/>
    <ellipse cx="152" cy="139" rx="7" ry="5.4" fill="#FADFC4" opacity=".62"/>

    <!-- 叶面内侧的呼吸纹理（细弧线，呼应「曲线」） -->
    <path d="M86 116 C80 126 80 138 84 148" stroke="#B7D6C9" stroke-width="2" stroke-linecap="round" fill="none" opacity=".8"/>
    <path d="M154 116 C160 126 160 138 156 148" stroke="#B7D6C9" stroke-width="2" stroke-linecap="round" fill="none" opacity=".8"/>
  </svg>`;
}

/* 档位胶囊：未越线鼠尾草 / 越线暖琥珀 */
const bandPill = (text, crossed) =>
  `<span class="pill ${crossed?'amber':'sage'}">${text}</span>`;

/* ------------------------------------------------------------
   验证码 6 格（原 01b 规格，现为 01 步骤 ②；规格见 design-spec.md §8.1）
   50 × 58 / 圆角 14 / 间距 10.6 / 数字 Inter SemiBold 22
   cells: [{v:'4'}, {v:'7'}, {}, {focus:true}, {err:true}, …]
   描边：空 #E4E0D8 ／ 已填 #38665F 1.5px ／ 错误 #B4553F 1.5px
   ------------------------------------------------------------ */
function OTP(cells){
  return `<div class="otp">${cells.map(c=>{
    if(c.v) return `<div class="cell filled${c.err?' err':''}">${c.v}</div>`;
    if(c.dot) return `<div class="cell filled"><span class="dot"></span></div>`;
    return `<div class="cell${c.focus?' focus':''}"></div>`;
  }).join('')}</div>`;
}

/* ------------------------------------------------------------
   屏状态变体机制
   有些屏在设计稿里是「多态」的（01b 三态、25 导出三态），
   单张静态图表达不了。这里让同一屏可以带多个 variant，
   外壳下方出现状态切换条，评审时可以真的挨个走一遍。
   variants: [{ name, html, note }]
   ------------------------------------------------------------ */
const VARIANTS = {};
function variants(id, list){ VARIANTS[id] = list; }
/* 屏幕包装 */
let SCREENS = [];
function screen(o){ SCREENS.push(o); }

/* ============================================================
   01 账户与同步  ——  一步屏，两个步骤：① 手机号 → ② 验证码
   2026-10-03 合并：原 `01b 验证码` 取消独立编号，降为本屏的第二步。
   依据：两次主张独立的四条理由（焦点争夺 / 规则放不下 / 错误态打架 /
   键盘留白）中三条建立在「两套输入同屏」这个不存在的场景上，第四条
   两步的键盘布局要求本就一致；且 01 是「不可返回的一级页」，给它挂一个
   带返回箭头的下游页自相矛盾。见 design-spec.md §8.1、audit-notes.md H 类续。
   ============================================================ */

/* 步骤 ① 手机号
   空号态（filled=false）：输入框只显占位符，主按钮真 disabled —— 点不动。
   已填态（filled=true） ：输入框显号码，主按钮转为可用的品牌绿。
   真机上的禁用不是「画成灰的」，是这个按钮此刻确实无动作可执行：
   手机号没填，登录请求无从发出。所以用真 disabled 属性，而不是 .dis 类。 */
function phoneStep(filled){
  const num = filled
    ? `<span class="num" style="font-size:15px;">138 0013 8000</span>`
    : `<span class="ph">手机号</span>`;
  const cta = filled
    ? `<button class="btn primary" data-step="3">手机号登录</button>`
    : `<button class="btn primary" disabled>手机号登录</button>`;
  /* data-step 统一语义：直接指向状态下标（1 基）。见下方「状态编号约定」。
     ① 空号=1 · ① 已填=2 · ② 验证码=3 · ② 已填满=4 · ② 错误态=5
     「手机号登录」（在① 已填，下标 2）推进到步骤 ② 主态 → data-step="3" */
  return `
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div style="height:40px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;">戒烟有数</div>
      <div style="padding:26px 24px 0;">
        <div style="display:flex;justify-content:center;">
          <div style="width:84px;height:84px;border-radius:24px;background:linear-gradient(145deg,#4E8479,#23443D);display:grid;place-items:center;">
            <svg width="56" height="56" viewBox="0 0 96 96" fill="none">
              <line x1="10" y1="74" x2="86" y2="74" stroke="#7FA79B" stroke-width="4" stroke-linecap="round"/>
              <rect x="8" y="20" width="14" height="52" rx="7" fill="#F7F4EC"/>
              <rect x="30" y="34" width="14" height="38" rx="7" fill="#F7F4EC"/>
              <rect x="52" y="46" width="14" height="26" rx="7" fill="#F7F4EC"/>
              <rect x="74" y="56" width="14" height="16" rx="7" fill="#F7F4EC"/>
              <path d="M8 37 L8 27 A7 7 0 0 1 22 27 L22 37 Z" fill="#F0B37A"/>
            </svg>
          </div>
        </div>
        <h2 style="font-size:22px;font-weight:600;text-align:center;margin-top:20px;letter-spacing:-.4px;">让记录跟着你走</h2>
        <p style="font-size:13px;color:var(--muted);text-align:center;line-height:1.6;margin-top:9px;">
          登录只用于在设备之间同步戒烟档案。<br>跳过也完全可用，数据只保存在本机。
        </p>
        <div style="margin-top:28px;">
          <div class="field"><span class="pre">+86</span><span style="width:1px;height:20px;background:var(--line)"></span>${num}</div>
        </div>
        <div style="margin-top:14px;">
          ${cta}
        </div>
        <div class="link" onclick="goTo('s02')">暂不登录，继续本地使用</div>
      </div>
      <div style="margin-top:auto;padding:0 24px 30px;">
        <p class="note" style="line-height:1.85;">
          · 换新机后，可凭账号接回库存与账本<br>
          · 同步前在本机加密，服务端只存密文
        </p>
      </div>
    </div>
  </div>`;
}

/* 步骤 ② 验证码 —— 两步共用骨架。
   差别只在：① 6 格内容与描边 ② 是否出现行内错误条
   刻意不用弹窗报错：验证码打错是高频小错，弹窗会打断输入节奏。 */
function otpStep(cells, err){
  return `
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <!-- 无返回箭头：01 是不可返回的一级页，它的下游不该有出口。
           回退改由副标题里的「更换号码」承担 —— 那也才是用户真正想做的事。 -->
      <div style="height:40px;"></div>
      <div style="padding:40px 20px 0;">
        <h2 style="font-size:22px;font-weight:600;letter-spacing:-.2px;">输入验证码</h2>
        <p style="font-size:13px;color:var(--muted);margin-top:8px;">
          已发送至 138****8888 · <span class="link-inline" data-step="2" style="color:var(--sage-900);font-weight:500;cursor:pointer;">更换号码</span>
        </p>
        <!-- 输入块上部对齐：真机键盘占下半屏，下方留白即键盘位（spec §8.1） -->
        <div style="margin-top:26px;">${OTP(cells)}</div>
        <div class="resend" style="margin-top:14px;">重新发送 <b>52s</b></div>
      </div>
      <!-- 错误条夹在「重发」与主按钮之间（规格见 design-spec.md §8.1 错误态 DOM 顺序：
           错误必须出现在 CTA 之前，用户才在按按钮前看到原因） -->
      ${err?`<div class="errbox" style="margin-top:16px;">验证码不正确，请重新输入。连续错误 3 次需重新获取。</div>`:''}
      <div style="padding:${err?18:26}px 20px 0;">
        <button class="btn primary" style="height:56px;" onclick="goTo('s02')">确认</button>
        <p class="note" style="text-align:center;margin-top:11px;">验证码 5 分钟内有效，仅用于确认身份</p>
      </div>
      <div style="margin-top:auto;padding:0 20px 26px;">
        <p class="note" style="text-align:center;">本机数据仅保存在当前设备</p>
      </div>
    </div>
  </div>`;
}

screen({
  id:'s01', no:'01', name:'账户与同步', tag:'已定稿',
  html: phoneStep(),
  alt:`【两步一屏】① 手机号（本屏主态）→ 点「手机号登录」在屏内推进 ② 验证码（6 格 50×58 / 60s 重发 / 错误态）。
      两步不换屏：01 是首次启动的一级页，流程在一个屏内走完。原「01b 验证码」的独立编号已取消。
      步骤 ① 的空号态主按钮为真 disabled（手机号未填则登录请求无从发出）。`
});

variants('s01', [
  { name:'① 空号', note:'一级页初始态：输入框仅占位符，主按钮置灰不可点 —— 手机号未填，登录无从发起',
    html: phoneStep(false) },
  { name:'① 已填', note:'填入手机号后主按钮转为品牌绿可用；点它屏内推进到步骤 ②',
    html: phoneStep(true) },
  { name:'② 验证码', note:'点「手机号登录」后屏内推进到本步：4 位已填 + 第 5 格聚焦，重发倒计时中。「更换号码」退回步骤 ①',
    html: otpStep([{v:'4'},{v:'7'},{v:'2'},{v:'9'},{focus:true},{}]) },
  { name:'② 已填满', note:'6 位全填，主按钮可用',
    html: otpStep([{v:'4'},{v:'7'},{v:'2'},{v:'9'},{v:'0'},{v:'1'}]) },
  { name:'② 错误态', note:'6 格描边转暖褐 + 输入清空 + 下方暖底提示条（不用弹窗）',
    html: otpStep([{v:'4',err:true},{v:'7',err:true},{v:'2',err:true},{v:'9',err:true},{v:'0',err:true},{v:'1',err:true}], true) }
]);

/* ============================================================
   02 首页
   ============================================================ */
/* ------------------------------------------------------------
   ★ 取出链路的单点口径（2026-10-03 · 修复「首页与取出成功没有联动」）

   问题：08 取出弹层里列了两支烟，但**两支都不可点** —— 选中态是写死在
   「云烟 细支」上的静态样式。于是用户选了哪支烟，系统根本不记录：
   选 5mg 的那支，弹层仍承诺 8mg 的数，落点 23 也永远显示 8mg 的结果。
   「用户点了一支烟，产品按另一支记账」—— 这才是「没联动」的真正含义。

   修法：把「取出一支烟」这件事的全部数值推导收敛到本区块。
   08 的承诺文案与 23 的落点数值**都由同一个函数产出**，选哪支烟，
   两端一起变。这与首页四态化的思路是同一个：凡有副本，引用同一产出。

   口径溯源（design-spec.md §4）：
     危害分 = 100×(1 − 0.5^(n/5.2)) + clamp((T − 9n)×0.5, −5, +10)
     负担   = 0.88 × 前值 + 0.12 × 当日危害分
     健康折算 = 0.43 × 焦油 mg
     今日成本 = 直接花费 + 健康折算
   ------------------------------------------------------------ */

/* 取出前的当日基准（首页主态 ①） */
const BASE = { n:4, T:38, direct:8.4, burden:42.3 };
BASE.harm   = Math.round(100*(1-Math.pow(0.5, BASE.n/5.2)) + (BASE.T - 9*BASE.n)*0.5);  // 42
BASE.cost   = BASE.direct + 0.43*BASE.T;                                                // 24.74

/* 库存里的烟。price = 每支直接花费，mg = 每支焦油。
   stock 是【单品库存】，与首页的「库存 16/17 支」【全部合计】不是一个层级 —— 
   两者并排出现容易误读，故弹层里给单品加了「本品牌」限定词。 */
const CIGARETTES = {
  yunyan:   { id:'yunyan',   name:'云烟 细支',   mg:8, price:1.75, stock:12 },
  zhongnan: { id:'zhongnan', name:'中南海 低焦', mg:5, price:1.00, stock:5  }
};
/* 弹层默认选中第一支 */
let PICKED = 'yunyan';

/* ★ 单点推导：取出一支某烟之后，当日全部数值会变成什么。
   08 的承诺行、23 的落点、以及首页的「② 取出后」态都调它。 */
function afterTake(cigId){
  const c = CIGARETTES[cigId] || CIGARETTES.yunyan;
  const n = BASE.n + 1;
  const T = BASE.T + c.mg;
  const harmRaw = 100*(1-Math.pow(0.5, n/5.2)) + Math.max(-5, Math.min(10, (T - 9*n)*0.5));
  const harm = Math.round(harmRaw);
  const burdenRaw = 0.88*BASE.burden + 0.12*harm;
  const burden = Math.round(burdenRaw*10)/10;
  const net = Math.round(100 - burden);
  const direct = BASE.direct + c.price;
  const cost = direct + 0.43*T;
  return {
    cig:c, n, T, harm, burden, net, direct, cost,
    dHarm:  harm - BASE.harm,
    dTar:   c.mg,
    dPrice: c.price,
    dHealth:0.43*c.mg
  };
}

/* 首页四态里「② 取出后」那一态 —— 现在由 PICKED 决定，不再是写死的常量。
   写成函数以便换烟后重新生成。 */
function homeAfter(){
  const a = afterTake(PICKED);
  return homeScreen({
    n:a.n, tar:String(a.T), harm:a.harm, burden:String(a.burden), net:String(a.net),
    cost:'¥'+a.cost.toFixed(1), stock:16, goal:5, band:'中等',
    toast:{ cls:'neu', t:'已记录 · 今日第 5 支',
            s:'库存 16 支 · 焦油 +'+a.dTar+'mg · 花费 +¥'+a.dPrice.toFixed(2) }
  });
}

/* 首页四态里「③ 忍住」那一态 —— 数值恒等于 ①（忍住不产生代价），
   只有反馈条里的「少摄入焦油 Xmg · 省下 ¥Y」随选中的烟走。
   同样写成函数，换烟后重新生成。 */
function homeHold(){
  const c = CIGARETTES[PICKED] || CIGARETTES.yunyan;
  return homeScreen({
    n:4, tar:'38', harm:42, burden:'42.3', net:'58', cost:'¥24.7', stock:17, goal:5,
    band:'中等', crossed:false, dim:true,
    toast:{ cls:'pos', t:'今天第 3 次忍住',
            s:'这一支没抽，少摄入焦油 '+c.mg+'mg · 省下 ¥'+c.price.toFixed(2) }
  });
}

/* ============================================================
   02 首页 —— 四态
   首页是全 App 的数值中枢：同一屏在不同时点/不同动作后是不同的一组数。
   2026-10-03：原先 22 / 23 / 24 各自手抄了一份首页副本，改主屏时副本
   没跟上（22 的 hero 就是「中等负担」却少了 cap、23 的数值虽对但和 02
   完全脱节）。这是本项目 N1 类（副本遗漏）第 5 次出现 —— 故本轮把首页
   抽成参数化函数，四态共用一套骨架，根除手抄。

   四态数值链（n = 当日取支数，T = 当日焦油 mg，全部按 A1 推导）：
     ① 取出前    n=4  T=38    负担 42.3  净值 58%  成本 ¥24.7  库存 17  进度 4/5
     ② 取出后    n=5  T=46    负担 43.1  净值 57%  成本 ¥29.9  库存 16  进度 5/5   ← 23 取出成功
                  （若取的是中南海低焦则 T=43 · 危害 48 · 负担 43.0 · 成本 ¥27.9）
     ③ 忍住      n=4  T=38    与① 同（忍住不产生代价，只是少了一支）        ← 22 忍住反馈
     ④ 今日 0 支 n=0  T=0     负担 37.2  净值 63%  成本 ¥0.0   库存 17  进度 0/5   ← 24 今日 0 支
   ============================================================ */
function homeScreen(o){
  /* o: {n, tar, burden, net, cost, stock, goal, band, crossed, phase, toast} */
  const crossed = !!o.crossed;
  const dots = Array.from({length:o.goal}, (_,i)=> i < o.n ? '<i class="on"></i>' : '<i></i>').join('');
  /* 横幅：n = 0 时转正向浅绿（design-full §24 的三条新规则之一） */
  const banner = o.n === 0
    ? `<div class="banner sage"><div class="b-ic">${IC.check}</div><div>
         <div class="b-t">轻负担 · 当日危害 0</div>
         <div class="b-s">今天还没有代价发生 —— 这是一天里最好的开局。</div>
       </div></div>`
    : `<div class="banner warn"><div class="b-ic">${IC.warn}</div><div>
         <div class="b-t">中等负担 · 当日危害 ${o.harm}</div>
         <div class="b-s">少量吸烟也不安全，别把「少抽」当成低风险。</div>
       </div></div>`;
  /* 24 屏规则：今日取出为 0 时「放回库存」置灰（没有可撤销的对象） */
  const compact = o.n === 0
    ? `<div class="btn-compact" style="color:var(--disabled);">放回库存</div>`
    : `<div class="btn-compact" onclick="goTo('s22')">放回库存</div>`;

  return `
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead">
        <div class="row">
          <div>
            <h2>戒烟有数</h2>
            <div class="sub num">10 月 3 日 · 周六</div>
          </div>
          <span class="pill outline">模型 A1</span>
        </div>
      </div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:10px;${o.dim?'opacity:.55;':''}">
        <div class="hero">
          <div class="hero-top">
            <span class="hero-label">近期负担指数 · 按最近两周的取出记录计算</span>
            ${bandPill(o.band, crossed)}
          </div>
          <div class="hero-num num">${o.burden}<span>%</span></div>
          <div class="track"><i style="width:${o.burden}%"></i></div>
          <div class="cap">库存 ${o.stock} 支 · ${o.n === 0 ? '今日还未取出' : '今日取出 ' + o.n + ' 支'} · 目标每日少于 ${o.goal} 支</div>
        </div>

        <div class="lungcard">
          <div class="lc-main">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;">
              <span style="font-size:11.5px;color:var(--muted);">肺部负担</span>
              <span class="pill grey" style="font-size:10px;padding:2px 8px;">实时渲染</span>
            </div>
            ${o.n === 0 ? lung(0.35) : lung(0.85)}
            <div class="lc-cap">近两周每取出一支 · 肺色加深 1.9%</div>
          </div>
        </div>

        ${banner}

        <div class="metrics">
          <div class="metric"><span class="m-l">今日成本</span><span class="m-v num">${o.cost}</span></div>
          <div class="metric"><span class="m-l">健康净值</span><span class="m-v num">${o.net}<small>%</small></span></div>
          <div class="metric"><span class="m-l">今日焦油</span><span class="m-v num">${o.tar}<small>mg</small></span></div>
        </div>

        <div class="oprow">
          <div class="btn-progress" onclick="goTo('s09')">
            <span class="bp-t">今日 ${o.n} / ${o.goal} 支</span>
            <span class="bp-dots">${dots}</span>
          </div>
          ${compact}
        </div>
      </div>
    </div>
      ${TABBAR('home')}
    ${o.toast ? `<div class="toast ${o.toast.cls}">
      <div class="t-ic">${o.toast.cls === 'neu' ? IC.pump : IC.check}</div>
      <div>
        <div class="t-t">${o.toast.t}</div>
        <div class="t-s num">${o.toast.s}</div>
      </div>
    </div>` : ''}
  </div>`;
}

/* ① 取出前（主态）—— 与设计稿 02 逐字一致 */
const HOME_BEFORE = homeScreen({
  n:4, tar:'38', harm:42, burden:'42.3', net:'58', cost:'¥24.7', stock:17, goal:5,
  band:'中等', crossed:false
});
/* ② 取出后 —— 不再是写死的常量，由 【当前选中的烟】 单点推导（见 afterTake）。
   原先这里是 homeScreen({...写死 8mg...})，导致 08 里改选 5mg 那支也不会变。
   用 let：换烟后由 setPick() 调 refreshHome() 就地改写。 */
let HOME_AFTER = homeAfter();
/* ③ 忍住 —— 数值与取出前完全一致（忍住不产生代价），仅加一层调暗 + 反馈条。
   反馈条里的「焦油 Xmg · 省下 ¥Y」也随选中的烟走 —— 忍住的是那一支。 */
let HOME_HOLD = homeHold();
/* ④ 今日 0 支 */
const HOME_ZERO = homeScreen({
  n:0, tar:'0', harm:0, burden:'37.2', net:'63', cost:'¥0.0', stock:17, goal:5,
  band:'偏低', crossed:false
});

screen({
  id:'s02', no:'02', name:'首页', tag:'已定稿',
  html: HOME_BEFORE,
  alt:`【四态】① 取出前（本屏主态，n=4）→ 点取出并确认后为 ② 取出后（n=5，就是原 23 屏）／
      ③ 忍住（数值同 ①，仅调暗 + 反馈条）／ ④ 今日 0 支（n=0，负担 37.2 · 净值 63%）。
      四态共用同一套骨架 —— 首页的副本不再手抄，改由 \`homeScreen()\` 单点产出。`
});

variants('s02', [
  { name:'① 取出前', note:'设计稿主态：今日已取 4 支，危害 42，负担 42.3，净值 58%，库存 17',
    html: HOME_BEFORE },
  { name:'② 取出后', note:'点「仍要取出一支」后的落点（原 23 取出成功）：危害 42→49 · 焦油 38→46mg · 成本 ¥24.7→¥29.9 · 净值 58→57% · 负担 42.3→43.1 · 库存 17→16 · 进度 4/5→5/5。反馈条停 1.8s',
    html: HOME_AFTER },
  { name:'③ 忍住', note:'点「好，今天先不抽」后的落点（原 22 忍住反馈）：忍住不产生代价，故全部数值与 ① 相同，只加一层调暗 + 正向反馈条（停 2.6s）',
    html: HOME_HOLD },
  { name:'④ 今日 0 支', note:'每日第一眼（原 24）：n=0 → 危害恰好 0 · 负担 37.2（37.2 = 0.88×42.3 + 0.12×0）· 净值 63% · 横幅转正向浅绿 · 肺透明度 85→35% · 放回库存置灰',
    html: HOME_ZERO }
]);

/* ============================================================
   03 危害警示（事后 · 常规）
   ============================================================ */
screen({
  id:'s03', no:'03', name:'危害警示', tag:'常规档',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead"><h2>戒烟有数</h2><div class="sub num">10 月 3 日 · 周六</div></div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:12px;opacity:.4;">
        <div class="hero">
          <div class="hero-top"><span class="hero-label">近期负担指数 · 按最近两周的取出记录计算</span>${bandPill('中等',false)}</div>
          <div class="hero-num num">42.3<span>%</span></div>
          <div class="track"><i style="width:42.3%"></i></div>
          <div class="cap">库存 17 支 · 今日取出 4 支 · 目标每日少于 5 支</div>
        </div>
        <div class="metrics">
          <div class="metric"><span class="m-l">今日成本</span><span class="m-v num">¥24.7</span></div>
          <div class="metric"><span class="m-l">健康净值</span><span class="m-v num">58<small>%</small></span></div>
          <div class="metric"><span class="m-l">今日焦油</span><span class="m-v num">38<small>mg</small></span></div>
        </div>
        <div class="oprow">
          <div class="btn-progress"><span class="bp-t">今日 4 / 5 支</span>
            <span class="bp-dots"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i></i></span></div>
          <div class="btn-compact">放回库存</div>
        </div>
      </div>
    </div>
      ${TABBAR('home')}
    <div class="scrim strong" data-close="s02"></div>
    <div class="sheet alert">
      <div class="handle"></div>
      <div class="a-ic" style="background:var(--amber-bg);">${IC.warn}</div>
      <h3>健康警示</h3>
      <p class="a-p">今天已取出 4 支。当日危害 <b class="num" style="color:var(--amber)">64</b> 分，属高危区间 —— 少量吸烟同样会推高心血管与呼吸道风险。</p>
      <div class="a-metrics">
        <div class="am"><div class="am-v num" style="color:var(--amber)">64</div><div class="am-l">今日危害</div></div>
        <div class="am"><div class="am-v num">4<span style="font-size:15px;"> 支</span></div><div class="am-l">今日已取出</div></div>
      </div>
      <div class="sheet-foot" style="padding-top:16px;">
        <button class="btn primary" style="height:52px;" onclick="goTo('s22')">✓ 今天不再取出</button>
        <button class="btn ghost" style="height:46px;border:0;color:var(--muted);" onclick="goTo('s02')">我知道了</button>
      </div>
    </div>
  </div>`,
  alt:'【触发规则】当日首次超过自设目标 1–2 支时弹一次；被 17 屏取代（不叠加）；未超目标完全不打扰。'
});

/* ============================================================
   04 资产
   ============================================================ */
screen({
  id:'s04', no:'04', name:'资产', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead">
        <div class="row">
          <div>
            <h2>库存总览</h2>
            <div class="sub">按每日少于 5 支对齐</div>
          </div>
          <span class="pill sage" style="padding:7px 13px;gap:5px;">${IC.plus}添加</span>
        </div>
      </div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:13px;">
        <!-- 库存折算：白底描边卡 —— 依 design-spec.md §10.1
             实心品牌绿在全 App 独占「推荐选项」，所以总览卡不走实色；
             与 05 账本同位置语言对齐。「健康负债」用琥珀写，代价色才是它的语义。 -->
        <div class="card line" style="padding:17px 18px;border-radius:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11.5px;color:var(--muted);">库存折算</span>
            <span class="pill outline" style="font-size:10px;padding:2px 8px;">10/03</span>
          </div>
          <div style="display:flex;gap:12px;margin-top:15px;">
            <div style="flex:1;">
              <div style="font-size:11.5px;color:var(--muted);margin-bottom:5px;">香烟库存价值</div>
              <div style="font-size:26px;font-weight:600;letter-spacing:-.8px;color:var(--ink);" class="num">¥26.0</div>
            </div>
            <div style="width:1px;background:var(--line-soft);"></div>
            <div style="flex:1;padding-left:2px;">
              <div style="font-size:11.5px;color:var(--muted);margin-bottom:5px;">健康负债</div>
              <div style="font-size:26px;font-weight:600;letter-spacing:-.8px;color:var(--amber);" class="num">−¥52.0</div>
            </div>
          </div>
        </div>

        <div class="metrics">
          <div class="metric"><span class="m-v num">17<small>支</small></span><span class="m-l">库存支数</span></div>
          <div class="metric"><span class="m-v num">121<small>mg</small></span><span class="m-l">焦油库存</span></div>
          <div class="metric"><span class="m-v num">12.1<small>mg</small></span><span class="m-l">尼古丁库存</span></div>
        </div>

        <div>
          <div class="group-label" style="padding:6px 4px 9px;display:flex;justify-content:space-between;align-items:baseline;">
            <span>持有资产</span><span style="font-weight:400;color:var(--muted);font-size:11.5px;">2 项</span>
          </div>
          <div class="card" style="overflow:hidden;">
            <div class="rowitem" onclick="goTo('s27')">
              <div class="ri-ic" style="background:var(--sage-100);font-size:10px;font-weight:600;color:var(--sage-900);">8mg</div>
              <div class="ri-main">
                <div class="ri-t">云烟 细支</div>
                <div class="ri-s">库存 12 支 · 持有 6 天</div>
              </div>
              <span class="pill sage" style="font-size:10px;padding:2.5px 8px;">默认</span>
            </div>
            <div class="rowitem" onclick="goTo('s27')">
              <div class="ri-ic" style="background:var(--sage-100);font-size:10px;font-weight:600;color:var(--sage-900);">5mg</div>
              <div class="ri-main">
                <div class="ri-t">中南海 低焦</div>
                <div class="ri-s">库存 5 支 · 持有 4 天</div>
              </div>
              <span class="pill grey" style="font-size:10px;padding:2.5px 8px;">更低焦油</span>
            </div>
          </div>
        </div>

        <div class="hint">把库存当成每日预算：目标每日少于 5 支，优先消耗焦油更高的品牌。</div>

        <button class="btn soft sm" style="height:50px;color:var(--warm-soft);" onclick="goTo('s14')">${IC.trash}清空库存</button>
      </div>
    </div>
      ${TABBAR('assets')}
  </div>`,
  alt:'总览卡按设计稿为实心深绿底 + 白字（右值琥珀）；三指标独立白卡；说明文案取自设计稿原文。列表项可点并加 chevron。'
});

/* ============================================================
   05 账本
   ============================================================ */
screen({
  id:'s05', no:'05', name:'账本', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead">
        <div class="row">
          <div><h2>账本</h2><div class="sub">把每支烟换算成钱、焦油和健康成本</div></div>
          <span class="pill outline">10 月</span>
        </div>
      </div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:8px;">
        <!-- 真实日耗：今日主结论 -->
        <div class="card line" style="padding:12px 15px;border-radius:22px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11.5px;color:var(--muted);">真实日耗 · 今日</span>
            <span class="pill outline" style="font-size:10px;padding:2px 8px;">10/03</span>
          </div>
          <div style="margin-top:3px;display:flex;align-items:baseline;gap:3px;">
            <span style="font-size:27px;font-weight:600;letter-spacing:-1px;" class="num">¥24.7</span>
            <span style="font-size:13px;color:var(--muted);">/ 天</span>
          </div>
          <div class="metrics" style="margin-top:8px;">
            <div class="metric" style="background:transparent;box-shadow:none;padding:0;">
              <div class="m-v num" style="font-size:15px;">¥8.4</div><div class="m-l">直接花费</div></div>
            <div class="metric" style="background:transparent;box-shadow:none;padding:0;">
              <div class="m-v num" style="font-size:15px;color:var(--warm);">¥16.3</div><div class="m-l">健康折算</div></div>
            <div class="metric" style="background:transparent;box-shadow:none;padding:0;">
              <div class="m-v num" style="font-size:15px;">38<small>mg</small></div><div class="m-l">焦油摄入</div></div>
          </div>
        </div>

        <!-- 危害横幅：极性随危害分走 -->
        <div class="banner warn">
          <div class="b-ic">${IC.warn}</div>
          <div>
            <div class="b-t num" style="font-size:19px;letter-spacing:-.5px;">64 <span style="font-size:11.5px;font-weight:500;">当日危害警示分</span></div>
            <div class="b-s">少量吸烟同样不安全，别把「少抽」当成低风险。</div>
          </div>
        </div>

        <!-- 本周取出：日柱状图 -->
        <div>
          <div class="group-label" style="padding:2px 4px 6px;display:flex;justify-content:space-between;align-items:baseline;">
            <span>本周取出</span>
            <span style="font-weight:400;color:var(--muted);font-size:11.5px;">共 26 支 · 10/03 起</span>
          </div>
          <div class="card" style="padding:11px 15px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
              <span style="font-size:11.5px;color:var(--muted);">每日取出支数</span>
              <span style="font-size:12px;font-weight:600;" class="num">今日 4 支</span>
            </div>
            <div class="bars">
              ${[3,4,2,4,1,5,4].map((v,i)=>{
                const last=i===6;
                return `<div class="bar-w"><div class="bar${last?' now':''}" style="height:${v*6+5}px"></div></div>`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- 今日流转 -->
        <div>
          <div class="group-label" style="padding:2px 4px 6px;display:flex;justify-content:space-between;align-items:baseline;">
            <span>今日流转</span>
            <span data-goto="s21" style="font-weight:400;color:var(--sage-900);font-size:11.5px;cursor:pointer;">查看全部 4 条</span>
          </div>
          <div class="card" style="overflow:hidden;">
            ${[['南京 雨花石','9mg · 08:42','¥2.65'],['云烟 细支','8mg · 10:23','¥1.75'],['利群 西子','11mg · 14:15','¥1.90']]
              .map(([n,d,v])=>`
              <div class="rowitem" onclick="goTo('s21')">
                <span class="flow-dot"></span>
                <div class="ri-main">
                  <div class="ri-t">${n}</div>
                  <div class="ri-s num">${d}</div>
                </div>
                <span class="ri-v num" style="color:var(--ink);font-weight:600;">${v}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
      ${TABBAR('ledger')}
  </div>`,
  alt:'04 与 05 是同类「屏首总览卡」，现两屏统一为白底描边 + 单层柔影。'
});

/* ============================================================
   06 我的
   ============================================================ */
screen({
  id:'s06', no:'06', name:'我的', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead">
        <div class="row">
          <div><h2>我的</h2><div class="sub">档案 · 目标 · 偏好</div></div>
          <span class="hdr-icon" onclick="goTo('s07')">${IC.gear}</span>
        </div>
      </div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:13px;">
        <div class="card" style="padding:16px;">
          <div style="display:flex;align-items:center;gap:13px;">
            <div class="avatar">${IC.person}</div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:15.5px;font-weight:600;">本地戒烟档案</span>
                <span class="pill grey" style="font-size:10px;padding:2px 8px;">仅本机</span>
              </div>
              <div style="font-size:12px;color:var(--muted);margin-top:4px;">数据只保存在当前设备</div>
            </div>
          </div>
          <div style="font-size:12.5px;color:var(--muted);margin-top:13px;padding-top:13px;border-top:1px solid var(--line-soft);">
            已记录 <b class="num" style="color:var(--ink)">7 天</b> · 库存 <b class="num" style="color:var(--ink)">17 支</b> · 目标每日少于 5 支
          </div>
        </div>

        <div class="metrics">
          <div class="metric"><span class="m-v num">7<small>天</small></span><span class="m-l">已记录</span></div>
          <div class="metric"><span class="m-v num">9<small>支</small></span><span class="m-l">本周少抽</span></div>
          <div class="metric"><span class="m-v num" style="color:var(--amber)">¥58.8</span><span class="m-l">累计花费</span></div>
        </div>

        <div>
          <div class="group-label" style="padding:2px 4px 9px;display:flex;justify-content:space-between;align-items:baseline;">
            <span>档案</span><span style="font-weight:400;color:var(--muted);font-size:11.5px;">本地优先</span>
          </div>
          <div class="card" style="overflow:hidden;">
            <div class="rowitem" onclick="goTo('s09')">
              <div class="ri-ic">${IC.target}</div>
              <div class="ri-main"><div class="ri-t">戒烟目标</div></div>
              <span class="ri-v num">每日少于 5 支</span>
              ${IC.chev}
            </div>
            <div class="rowitem" onclick="goTo('s10')">
              <div class="ri-ic">${IC.chart}</div>
              <div class="ri-main"><div class="ri-t">危害模型与证据</div></div>
              <span class="ri-v">A1</span>
              ${IC.chev}
            </div>
            <div class="rowitem" onclick="goTo('s13')">
              <div class="ri-ic">${IC.help}</div>
              <div class="ri-main"><div class="ri-t">帮助与关于</div></div>
              <span class="ri-v">原型版</span>
              ${IC.chev}
            </div>
          </div>
        </div>

        <div class="banner calm" style="background:var(--sage-100);">
          <div class="b-ic" style="background:#E4EDE9;">${IC.lock}</div>
          <div>
            <div class="b-s" style="color:var(--sage-900);">
              隐私优先 —— 真实日耗、健康负债与危害模型都在<b>本机计算</b>，不上传吸烟记录。
            </div>
          </div>
        </div>
      </div>
    </div>
      ${TABBAR('mine')}
  </div>`
});

/* ============================================================
   07 设置
   ============================================================ */
screen({
  id:'s07', no:'07', name:'设置', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="navhead"><span class="back" onclick="goTo('s06')">${IC.back}</span><span style="font-size:16px;font-weight:600;">设置</span><span class="spacer"></span></div>
      <div style="padding:0 20px;">
        <div class="group-label">提醒与干预</div>
        <div class="card" style="overflow:hidden;">
          <div class="rowitem">
            <div class="ri-ic">${IC.warn}</div>
            <div class="ri-main"><div class="ri-t">严厉危害警示</div><div class="ri-s">当日首次超过目标时弹出一次，同一天不重复</div></div>
            <div class="sw on"><i></i></div>
          </div>
          <div class="rowitem">
            <div class="ri-ic">${IC.vib}</div>
            <div class="ri-main"><div class="ri-t">取烟震动反馈</div></div>
            <div class="sw on"><i></i></div>
          </div>
          <div class="rowitem" onclick="goTo('s12')">
            <div class="ri-ic">${IC.clock}</div>
            <div class="ri-main"><div class="ri-t">每日复盘提醒</div><div class="ri-s num">21:30 · 每天仅推一次</div></div>
            <div class="sw on"><i></i></div>
          </div>
        </div>

        <div class="group-label">数据与隐私</div>
        <div class="card" style="overflow:hidden;">
          <div class="rowitem" onclick="goTo('s19')">
            <div class="ri-ic">${IC.sync}</div>
            <div class="ri-main"><div class="ri-t">跨设备同步</div></div>
            <span class="ri-v">已开启</span>${IC.chev}
          </div>
          <div class="rowitem" onclick="goTo('s25')">
            <div class="ri-ic">${IC.up}</div>
            <div class="ri-main"><div class="ri-t">导出戒烟账本 CSV</div></div>
            ${IC.chev}
          </div>
          <div class="rowitem">
            <div class="ri-ic">${IC.lock}</div>
            <div class="ri-main"><div class="ri-t">本地数据</div></div>
            <span class="ri-v num">17 条记录</span>
          </div>
        </div>

        <div class="hint" style="margin-top:16px;">数据默认只保存在本机。未登录时不上传任何内容；登录后同步的是加密后的档案。</div>
      </div>
    </div>
  </div>`,
  alt:'本轮改动：① 严厉危害警示副标由「取出后立即弹出…不可跳过」改为「当日首次超过目标时弹出一次，同一天不重复」；② 每日复盘提醒开关由关改为开（与 12 屏 21:30 一致）；③ 删除页脚「原型版 0.1 · 本地数据 17 条」。'
});

/* ============================================================
   08 取出弹层
   ------------------------------------------------------------
   ★ 两支烟现在是真的可点（2026-10-03）。

   原先这里是两段写死的 HTML：第一支带 1.5px 绿描边 + 勾（看着像选中），
   第二支带 1px 灰描边（看着像没选）—— 但两支都没有任何点击处理。
   于是「选中态」只是个装饰，用户改选第二支，弹层仍按第一支承诺、
   落点 23 也仍按第一支记账。

   现在：选中项由 PICKED 决定，点任意一支调 window.setPick()（见文件末尾）——
   它切 PICKED 并重算所有派生快照（08 承诺行 · 02 的 ②③ 态 · 22 · 23）。
   承诺行与落点数值都从 afterTake(sel) 取 —— 与首页「② 取出后」态同源。
   ============================================================ */
function takeSheet(pick){
  const sel = pick || PICKED;
  const a = afterTake(sel);
  const row = (c)=>{
    const on = c.id === sel;
    return `
      <div data-pick="${c.id}" style="height:60px;border-radius:15px;cursor:pointer;
           border:${on?'1.5px':'1px'} solid ${on?'var(--sage-900)':'var(--line)'};
           display:flex;align-items:center;gap:11px;padding:0 14px;">
        <div style="flex:1;">
          <div style="font-size:14.5px;font-weight:600;">${c.name}</div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:2px;" class="num">${c.mg}mg · 本品牌库存 ${c.stock} 支 · 每支 ¥${c.price.toFixed(2)}</div>
        </div>
        ${on ? IC.check : ''}
      </div>`;
  };
  return `
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead"><h2>戒烟有数</h2><div class="sub num">10 月 3 日 · 周六</div></div>
      <div style="padding:0 20px;"><div class="hero" style="opacity:.5"><div class="hero-num num">42.3<span>%</span></div></div></div>
    </div>
      ${TABBAR('home')}
    <div class="scrim" data-close="s02"></div>
    <div class="sheet" style="height:560px;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>想抽一支？</h3><span class="x" data-goto="s02">${IC.x}</span></div>
      <div class="sheet-sub">先看一眼代价，再决定。</div>
      <div class="sheet-body">
        <div style="display:flex;flex-direction:column;gap:9px;">
          ${row(CIGARETTES.yunyan)}
          ${row(CIGARETTES.zhongnan)}
        </div>
        <p style="font-size:12.5px;color:var(--sage-900);text-align:center;margin-top:16px;font-weight:500;">先不抽 —— 今天最划算的一笔。</p>
      </div>
      <div class="sheet-foot">
        <button class="btn primary" data-goto="s22">${IC.checkW}好，今天先不抽</button>
        <div class="card" style="margin-top:11px;padding:12px 14px;background:var(--amber-bg);box-shadow:none;border-radius:14px;">
          <div style="font-size:12.5px;font-weight:600;color:#8A4A1C;">取出「${a.cig.name}」后：当日危害 ${BASE.harm} → ${a.harm}</div>
          <div style="font-size:11px;color:#8A6A4E;margin-top:4px;" class="num">健康折算 +¥${a.dHealth.toFixed(2)} · 焦油 +${a.dTar}mg</div>
        </div>
        <button class="btn ghost" style="margin-top:11px;" data-goto="s23">仍要取出一支</button>
      </div>
    </div>
  </div>`;
}

screen({
  id:'s08', no:'08', name:'取出弹层', tag:'已定稿',
  html: takeSheet(),
  alt:`本屏每次都出现（它是「确认 + 认知」，不是警示）。刻意不加备注字段 —— 取烟场景里备注必然空着，还会稀释主 CTA。
      【2026-10-03 修复】两支烟改为真可选：点哪支，承诺行（危害 42→X · 焦油 +Xmg · 健康折算 +¥X）与落点 23 的数值一起变。
      提示：弹层里的「本品牌库存 N 支」是单品库存，首页/23 的「库存 16/17 支」是全部合计，两者层级不同。`
});

/* 两支烟各一个状态，评审时可逐态走一遍。
   pick 字段把变体与 CIGARETTES 的 id 绑定 —— app.js 靠它反查下标，
   避免用中文状态名做匹配（名字会改，id 不会）。 */
variants('s08', [
  { name:'选中 云烟细支', pick:'yunyan',
    note:'默认选中 8mg 那支：当日危害 42 → 49 · 焦油 +8mg · 健康折算 +¥3.44',
    html: takeSheet('yunyan') },
  { name:'选中 中南海低焦', pick:'zhongnan',
    note:'改选 5mg 那支：当日危害 42 → 48 · 焦油 +5mg · 健康折算 +¥2.15（承诺行与 23 一起变）',
    html: takeSheet('zhongnan') }
]);

/* ============================================================
   09 调整戒烟目标
   ============================================================ */
screen({
  id:'s09', no:'09', name:'调整戒烟目标', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead">
        <div class="row">
          <div><h2>我的</h2><div class="sub">档案 · 目标 · 偏好</div></div>
          <span class="hdr-icon" onclick="goTo('s07')">${IC.gear}</span>
        </div>
      </div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:13px;">
        <div class="card" style="padding:16px;">
          <div style="display:flex;align-items:center;gap:13px;">
            <div class="avatar">${IC.person}</div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:15.5px;font-weight:600;">本地戒烟档案</span>
                <span class="pill grey" style="font-size:10px;padding:2px 8px;">仅本机</span>
              </div>
              <div style="font-size:12px;color:var(--muted);margin-top:3px;">数据仅保存在当前设备</div>
            </div>
          </div>
          <div style="font-size:12.5px;color:var(--muted);margin-top:13px;padding-top:12px;border-top:1px solid var(--line-soft);">
            已记录 <b style="color:var(--ink);">7 天</b> · 库存 <b style="color:var(--ink);">17 支</b> · 目标每日少于 <b style="color:var(--ink);">5 支</b>
          </div>
        </div>
        <div class="metrics">
          <div class="metric"><span class="m-l">连续记录</span><span class="m-v num">7<span style="font-size:12px;"> 天</span></span></div>
          <div class="metric"><span class="m-l">本周少抽</span><span class="m-v num">9<span style="font-size:12px;"> 支</span></span></div>
          <div class="metric"><span class="m-l">健康净值</span><span class="m-v num">58<span style="font-size:12px;">%</span></span></div>
        </div>
      </div>
    </div>
      ${TABBAR('mine')}
    <div class="scrim" data-close="s06"></div>
    <div class="sheet" style="height:562px;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>调整戒烟目标</h3><span class="x" onclick="goTo('s06')">${IC.x}</span></div>
      <div class="sheet-sub">目标决定危害分与健康净值的算法。</div>
      <div class="sheet-body">
        <div class="card line" style="padding:15px 16px;border-radius:18px;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <span style="font-size:13px;font-weight:500;">每日上限</span>
            <span style="font-size:11.5px;color:var(--muted);">范围 1 – 20 支</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;">
            <div class="step-btn" data-s9dir="-1">−</div>
            <div style="text-align:center;">
              <div class="num" data-s9val style="font-size:46px;line-height:48px;font-weight:600;letter-spacing:-2px;">5</div>
              <div style="font-size:11.5px;color:var(--muted);margin-top:1px;">支 / 天</div>
            </div>
            <div class="step-btn" data-s9dir="1">+</div>
          </div>
          <div class="dots" data-s9dots>
            ${Array.from({length:20},(_,i)=>`<i class="${i<5?'on':''}"></i>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:9px;margin-top:13px;">
          ${[['3 支','3'],['5 支 · 默认','5'],['8 支','8']].map(([v,p],i)=>`
            <div class="preset-chip ${i===1?'on':''}" data-s9preset="${p}">${v}</div>`).join('')}
        </div>
        <div class="a-note" style="margin:13px 0 0;background:var(--sage-100);color:#3F635A;">
          <span style="flex:none;margin-top:1px;width:15px;height:15px;border-radius:50%;border:1.4px solid #3F635A;display:grid;place-items:center;font-size:10px;font-weight:700;font-style:italic;">i</span>
          <span>每减少 1 支，日均健康负债约降 ¥3.9。</span>
        </div>
      </div>
      <div class="sheet-foot">
        <button class="btn primary" onclick="goTo('s06')">保存目标</button>
        <div class="link muted" onclick="goTo('s06')">取消</div>
      </div>
    </div>
  </div>`
});

/* ============================================================
   10 危害模型 A1
   ============================================================ */
screen({
  id:'s10', no:'10', name:'危害模型', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="navhead"><span class="back" onclick="goTo('s06')">${IC.back}</span><span style="font-size:16px;font-weight:600;">危害模型</span><span class="spacer"></span></div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:13px;">
        <div>
          <div style="display:flex;align-items:center;gap:8px;">
            <h2 style="font-size:25px;font-weight:600;letter-spacing:-.8px;">危害分怎么算</h2>
            ${bandPill('A1', false)}
          </div>
          <div style="font-size:12.5px;color:var(--muted);margin-top:6px;">每个数字都能追溯到可解释的变量，不做黑箱。</div>
        </div>

        <div class="card" style="padding:15px 16px;">
          <div style="font-size:11.5px;color:var(--muted);">核心公式</div>
          <div style="font-size:13.5px;font-weight:600;margin-top:8px;letter-spacing:-.2px;line-height:1.5;">
            危害分 = 100 × (1 − 0.5^(n / 5.2)) + 焦油修正
          </div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:7px;line-height:1.55;" class="num">
            焦油修正 = clamp((今日焦油 mg − 9n) × 0.5, −5, +10)
          </div>
          <div style="font-size:11px;color:var(--muted-light);margin-top:7px;line-height:1.55;">
            n = 当日取支数，焦油饱和参数 5.2，焦油基准 9mg/支。n = 0 时恰好 0 分。
          </div>
        </div>

        <div>
          <div class="gcard">
            <div class="ghead"><span>变量与当前取值</span><span style="font-weight:400;">今日</span></div>
            <div class="kv-row"><div><div class="k-t">今日取支数</div><div class="k-s">按 0.5^(n/5.2) 收益递减</div></div><span class="v num">4 <small>支</small></span></div>
            <div class="kv-row"><div><div class="k-t">今日焦油</div><div class="k-s">超出 9mg/支 基准部分按 0.5 折算</div></div><span class="v num">38 <small>mg</small></span></div>
            <div class="kv-row"><div><div class="k-t">健康折算单价</div><div class="k-s">每毫克焦油的健康成本</div></div><span class="v num">¥0.43</span></div>
          </div>
        </div>

        <div class="card" style="padding:15px 16px;">
          <div style="font-size:11.5px;color:var(--muted);">当前代入结果</div>
          <div style="display:flex;align-items:center;gap:10px;margin-top:6px;">
            <span class="num" style="font-size:40px;line-height:44px;font-weight:600;letter-spacing:-1.6px;color:var(--amber);">42</span>
            <span class="pill amber" style="font-size:11px;padding:3px 9px;">中等</span>
          </div>
          <div class="band-bar">
            <i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:8px;">
            由轻到重：轻负担 · 偏低 · 中等 · 偏高 · 重负担（阈值 20 / 40 / 60 / 80）
          </div>
          <div class="kv-row" style="border-top:1px solid var(--line-soft);margin-top:11px;padding-top:11px;">
            <div><div class="k-t">近期负担指数</div><div class="k-s">指数加权平均 · 半衰期 5.4 天</div></div>
            <span class="v num">42.3</span>
          </div>
          <div class="kv-row"><div><div class="k-t">健康净值</div><div class="k-s">100 − 42.3 = 57.7</div></div><span class="v num">58%</span></div>
        </div>

        <div class="a-note" style="margin:0;background:var(--sage-100);color:#3F635A;align-items:flex-start;">
          <span style="flex:none;margin-top:1.5px;width:15px;height:15px;border-radius:50%;border:1.4px solid #3F635A;display:grid;place-items:center;font-size:10px;font-weight:700;font-style:italic;">i</span>
          <span style="line-height:1.6;">依据 WHO 与《中国成人烟草调查报告》的剂量-反应关系；焦油按线性折算。本模型用于自我追踪，不构成医学诊断。</span>
        </div>

        <p style="font-size:11.5px;color:var(--muted-light);text-align:center;padding:2px 0 4px;">模型会随记录积累校准，当前版本 A1。</p>
      </div>
    </div>
  </div>`,
  alt:'本轮对齐设计稿 10：整屏为「危害分怎么算」+ A1 胶囊的模型说明页。核心公式、变量与当前取值、当前代入结果 42 中等 + 五档刻度 + 负担指数 42.3 / 净值 58%，全部按 design-spec.md §4 的 A1 口径重算（旧模型 48+(n−2)×6 已弃用）。'
});

/* ============================================================
   11 添加香烟资产
   ============================================================ */
screen({
  id:'s11', no:'11', name:'添加香烟资产', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead">
        <div class="row">
          <div><h2>库存总览</h2><div class="sub">按每日少于 5 支对齐</div></div>
          <span class="pill outline">+ 添加</span>
        </div>
      </div>
      <div style="padding:0 20px;">
        <div class="card line" style="padding:17px 18px;border-radius:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11.5px;color:var(--muted);">库存折算</span>
            <span class="pill outline" style="font-size:10px;padding:2px 8px;">10/03</span>
          </div>
          <div style="display:flex;gap:12px;margin-top:15px;">
            <div style="flex:1;">
              <div style="font-size:11.5px;color:var(--muted);margin-bottom:5px;">香烟库存价值</div>
              <div class="num" style="font-size:26px;font-weight:600;color:var(--ink);letter-spacing:-.8px;">¥26.0</div>
            </div>
            <div style="width:1px;background:var(--line-soft);"></div>
            <div style="flex:1;padding-left:2px;">
              <div style="font-size:11.5px;color:var(--muted);margin-bottom:5px;">健康负债</div>
              <div class="num" style="font-size:26px;font-weight:600;color:var(--amber);letter-spacing:-.8px;">−¥52.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
      ${TABBAR('assets')}
    <div class="scrim" data-close="s04"></div>
    <div class="sheet" style="height:640px;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>添加香烟资产</h3><span class="x" onclick="goTo('s04')">${IC.x}</span></div>
      <div class="sheet-sub">焦油与尼古丁会写入库存折算，填准一点更好用。</div>
      <div class="sheet-body">
        <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">品牌</div>
        <div class="field focus"><span style="color:var(--ink);font-size:15px;">南京 低焦</span></div>

        <div style="display:flex;gap:11px;margin-top:15px;">
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">焦油含量</div>
            <div class="field"><span class="num" style="font-size:15px;">6</span><span style="margin-left:auto;color:var(--muted);font-size:13px;">mg</span></div>
          </div>
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">尼古丁</div>
            <div class="field"><span class="num" style="font-size:15px;">0.6</span><span style="margin-left:auto;color:var(--muted);font-size:13px;">mg</span></div>
          </div>
        </div>

        <div style="display:flex;gap:11px;margin-top:15px;">
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">数量</div>
            <div class="field"><span class="num" style="font-size:15px;">2</span><span style="margin-left:auto;color:var(--muted);font-size:13px;">包</span></div>
          </div>
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">包装价</div>
            <div class="field"><span style="color:var(--muted);font-size:14px;">¥</span><span class="num" style="font-size:15px;">24</span><span style="margin-left:auto;color:var(--muted);font-size:13px;">/ 包</span></div>
          </div>
        </div>

        <div style="display:flex;gap:11px;margin-top:15px;">
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">每包支数</div>
            <div class="field"><span class="num" style="font-size:15px;">20</span><span style="margin-left:auto;color:var(--muted);font-size:13px;">支 / 包</span></div>
          </div>
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">单支价格</div>
            <div class="field" style="background:var(--cream);"><span class="num" style="font-size:15px;color:var(--muted);">¥1.20</span><span style="margin-left:auto;color:var(--muted-light);font-size:11.5px;">只读</span></div>
          </div>
        </div>

        <div class="a-note" style="margin:15px 0 0;background:var(--sage-100);color:#3F635A;">
          <span style="flex:none;margin-top:1.5px;width:15px;height:15px;border-radius:50%;border:1.4px solid #3F635A;display:grid;place-items:center;font-size:10px;font-weight:700;font-style:italic;">i</span>
          <span>录入后库存变为 57 支、焦油 361 mg；本次入库 40 支，账面价值 ¥48.0。</span>
        </div>
      </div>
      <div class="sheet-foot">
        <button class="btn primary" onclick="goTo('s04')">保存到库存</button>
        <div class="link muted" onclick="goTo('s04')">取消</div>
      </div>
    </div>
  </div>`,
  alt:'【错误态】品牌为空 / 含量为非数字 / 包装价为 0 时，对应输入框描边转暖褐 #B4553F，下方暖底提示条给出具体原因，不弹窗。【口径】数量语义是「包」不是「支」（买烟本来就按包）；单支价格 = 包装价 ÷ 每包支数 = 24 ÷ 20 = ¥1.20，只读由前两项推导。示例值 2 包 × 20 支 = 40 支 → 库存 17 + 40 = 57 支、账面价值 40 × 1.20 = ¥48.0。'
});

/* ============================================================
   12 每日复盘提醒
   ============================================================ */
screen({
  id:'s12', no:'12', name:'每日复盘提醒', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="navhead"><span class="back" onclick="goTo('s07')">${IC.back}</span><span style="font-size:16px;font-weight:600;">设置</span><span class="spacer"></span></div>
      <div style="padding:0 20px;">
        <div class="group-label" style="padding:2px 4px 9px;font-weight:400;">提醒与干预</div>
        <div class="card" style="overflow:hidden;">
          <div class="rowitem"><div class="ri-main"><div class="ri-t">严厉危害警示</div><div class="ri-s">取出后立即弹出健康警示，不可跳过</div></div><div class="sw on"><i></i></div></div>
          <div class="rowitem"><div class="ri-main"><div class="ri-t">取烟震动反馈</div><div class="ri-s">记录前轻震一下，给一个停下来的机会</div></div><div class="sw on"><i></i></div></div>
          <div class="rowitem"><div class="ri-main"><div class="ri-t">每日复盘提醒</div><div class="ri-s">到点提醒你回看当天的危害与花费</div></div><div class="sw on"><i></i></div></div>
        </div>
      </div>
    </div>
    <div class="scrim" data-close="s07"></div>
    <div class="sheet" style="height:545px;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>每日复盘提醒</h3><span class="x" onclick="goTo('s07')">${IC.x}</span></div>
      <div class="sheet-sub">到点提醒你回看当天的危害与花费，只推一次。</div>
      <div class="sheet-body">
        <div style="text-align:center;padding:10px 0 0;">
          <div class="num" style="font-size:46px;line-height:50px;font-weight:700;letter-spacing:-1.8px;">21:30</div>
          <div style="font-size:12px;color:var(--muted);margin-top:8px;">每天 · 仅推一次</div>
        </div>
        <div class="dots" style="gap:4px;margin-top:22px;">
          ${Array.from({length:19},(_,i)=>`<i class="${i<11?'on':''}" style="height:10px;border-radius:3.5px;"></i>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--muted-light);margin-top:7px;">
          <span>19:00</span><span>23:00</span>
        </div>
        <div style="display:flex;gap:9px;margin-top:20px;">
          ${['20:30','21:30','22:30'].map((t,i)=>`
            <div class="preset-chip num ${i===1?'on':''}" data-t12="${t}" style="height:48px;">${t}</div>`).join('')}
        </div>
        <div class="a-note" style="margin:15px 0 0;background:var(--sage-100);color:#3F635A;">
          <span style="flex:none;margin-top:1.5px;width:15px;height:15px;border-radius:50%;border:1.4px solid #3F635A;display:grid;place-items:center;font-size:10px;font-weight:700;font-style:italic;">i</span>
          <span>选一个你通常还醒着、但当天已不再抽的时间。</span>
        </div>
      </div>
      <div class="sheet-foot">
        <button class="btn primary" onclick="goTo('s07')">保存提醒时间</button>
        <div class="link muted" onclick="goTo('s07')">取消</div>
      </div>
    </div>
  </div>`,
  alt:'本轮对齐设计稿 12：背景恢复为完整的「提醒与干预」分组（3 行开关）；刻度条改为 19 格扁平刻度 + 19:00 / 23:00 两端标注（原为 16 根高柱 + 三标注）；预设档位改为描边胶囊。'
});

/* ============================================================
   13 帮助与关于
   ============================================================ */
screen({
  id:'s13', no:'13', name:'帮助与关于', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead"><h2>我的</h2><div class="sub">戒烟 18 天 · 已记录 7 天</div></div>
    </div>
      ${TABBAR('mine')}
    <div class="scrim" data-close="s06"></div>
    <div class="sheet" style="height:430px;top:422px;bottom:auto;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>关于</h3><span class="x" onclick="goTo('s06')">${IC.x}</span></div>
      <div class="sheet-body">
        <div style="text-align:center;padding:4px 0 16px;">
          <div class="about-id"><svg width="32" height="32" viewBox="0 0 96 96" fill="none">
            <line x1="10" y1="74" x2="86" y2="74" stroke="#7FA79B" stroke-width="4" stroke-linecap="round"/>
            <rect x="8" y="20" width="14" height="52" rx="7" fill="#F7F4EC"/>
            <rect x="30" y="34" width="14" height="38" rx="7" fill="#F7F4EC"/>
            <rect x="52" y="46" width="14" height="26" rx="7" fill="#F7F4EC"/>
            <rect x="74" y="56" width="14" height="16" rx="7" fill="#F7F4EC"/>
            <path d="M8 37 L8 27 A7 7 0 0 1 22 27 L22 37 Z" fill="#F0B37A"/>
          </svg></div>
          <div style="font-size:15px;font-weight:600;margin-top:11px;">戒烟有数</div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:3px;" class="num">版本 0.1 · 模型 A1</div>
        </div>

        <div style="background:var(--sage-100);border-radius:14px;padding:13px 15px;display:flex;align-items:center;justify-content:space-between;font-size:13.5px;font-weight:500;color:var(--sage-900);">
          检查更新 <span style="font-size:12px;color:#4A6B60;display:flex;align-items:center;gap:5px;">已是最新版本 ${IC.chev}</span>
        </div>

        <div style="margin-top:14px;border-top:1px solid var(--line-soft);">
          <div class="rowitem" style="padding:13px 0;" onclick="goTo('s10')">
            <div class="ri-main"><div class="ri-t" style="font-size:14px;">危害模型与证据</div></div>
            <span class="pill outline" style="font-size:10px;padding:2px 7px;">A1</span>${IC.chev}
          </div>
          <div class="rowitem" style="padding:13px 0;" onclick="goTo('s26')">
            <div class="ri-main"><div class="ri-t" style="font-size:14px;">隐私政策与用户协议</div></div>
            ${IC.chev}
          </div>
          <div class="rowitem" style="padding:13px 0;">
            <div class="ri-main"><div class="ri-t" style="font-size:14px;">反馈与建议</div><div class="ri-s">调起系统邮件，自动带上机型与版本</div></div>
            ${IC.chev}
          </div>
        </div>
        <p class="note" style="margin-top:12px;text-align:center;">本模型用于自我观察，不构成医学建议。</p>
      </div>
    </div>
  </div>`,
  alt:'本轮改动：① App 标识由「绿方块 + 白云」占位换为新 logo；② 删除「关闭」按钮；③ 链接由 4 行合并为 3 行；④ 弹层高 640 → 430。'
});

/* ============================================================
   14 清空库存确认
   ============================================================ */
screen({
  id:'s14', no:'14', name:'清空库存确认', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead">
        <div class="row">
          <div><h2>库存总览</h2><div class="sub">按每日少于 5 支对齐</div></div>
          <span class="pill outline">+ 添加</span>
        </div>
      </div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:11px;">
        <div class="card line" style="padding:17px 18px;border-radius:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11.5px;color:var(--muted);">库存折算</span>
            <span class="pill outline" style="font-size:10px;padding:2px 8px;">10/03</span>
          </div>
          <div style="display:flex;gap:12px;margin-top:15px;">
            <div style="flex:1;">
              <div style="font-size:11.5px;color:var(--muted);margin-bottom:5px;">香烟库存价值</div>
              <div class="num" style="font-size:26px;font-weight:600;color:var(--ink);letter-spacing:-.8px;">¥26.0</div>
            </div>
            <div style="width:1px;background:var(--line-soft);"></div>
            <div style="flex:1;padding-left:2px;">
              <div style="font-size:11.5px;color:var(--muted);margin-bottom:5px;">健康负债</div>
              <div class="num" style="font-size:26px;font-weight:600;color:var(--amber);letter-spacing:-.8px;">−¥52.0</div>
            </div>
          </div>
        </div>
        <div class="metrics">
          <div class="metric"><span class="m-l">库存支数</span><span class="m-v num">17</span></div>
          <div class="metric"><span class="m-l">焦油库存</span><span class="m-v num">121<small>mg</small></span></div>
          <div class="metric"><span class="m-l">尼古丁库存</span><span class="m-v num">12.1<small>mg</small></span></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:9px;background:var(--sage-100);border-radius:14px;padding:12px 13px;font-size:12px;color:#3F635A;line-height:1.55;">
          <span style="flex:none;margin-top:1.5px;width:15px;height:15px;border-radius:50%;border:1.4px solid #3F635A;display:grid;place-items:center;font-size:10px;font-weight:700;font-style:italic;">i</span>
          <span>把库存当成每日预算：目标每日少于 5 支，优先消耗焦油更高的品牌。</span>
        </div>
        <button class="btn ghost" style="height:52px;color:var(--warm);border-color:#E9CFC4;">清空库存</button>
      </div>
    </div>
      ${TABBAR('assets')}
    <div class="scrim strong" data-close="s04"></div>
    <div class="sheet alert">
      <div class="handle"></div>
      <div class="a-ic" style="background:var(--amber-bg);">${IC.trash}</div>
      <h3>清空库存？</h3>
      <p class="a-p">将删除全部持有资产与库存记录，此操作不可撤销。</p>
      <div class="a-metrics">
        <div class="am"><div class="am-v num">17<span style="font-size:15px;"> 支</span></div><div class="am-l">将删除库存</div></div>
        <div class="am"><div class="am-v num">¥26.0</div><div class="am-l">库存价值</div></div>
      </div>
      <div class="sheet-foot" style="padding-top:16px;">
        <button class="btn primary" style="height:52px;" onclick="goTo('s04')">保留库存</button>
        <button class="btn ghost danger" style="height:50px;margin-top:11px;color:var(--warm);border-color:#E9CFC4;" onclick="goTo('s15')">确认清空</button>
      </div>
    </div>
  </div>`,
  alt:'破坏性操作里，安全选项才是绿色主按钮 —— 这一条在 03 / 14 / 21 三处都成立。「确认清空」跳 15 首页空状态（清空后即无库存）。'
});

/* ============================================================
   15 首页 · 空状态
   ============================================================ */
screen({
  id:'s15', no:'15', name:'首页 · 空状态', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead">
        <div class="row">
          <div><h2>戒烟有数</h2><div class="sub num">10 月 3 日 · 周六</div></div>
          <span class="pill outline">模型 A1</span>
        </div>
      </div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:10px;">
        <div class="hero">
          <div class="hero-top">
            <span class="hero-label">近期负担指数 · 按最近两周的取出记录计算</span>
            <span class="pill grey">待数据</span>
          </div>
          <div class="hero-num num empty-ink">--<span>%</span></div>
          <div class="track"></div>
          <div class="cap">还没有库存与取出记录</div>
        </div>

        <div class="lungcard">
          ${lung(0.35)}
          <div class="lc-main">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span style="font-size:11.5px;color:var(--muted);">肺部负担</span>
              <span class="pill grey" style="font-size:10px;padding:2px 8px;">待数据</span>
            </div>
            <div class="lc-cap">记满 3 天后开始渲染</div>
            <!-- 卡底引导语：design-full.html 15 屏「卡底追加引导语」+ 规则「先添加库存、记满 3 天，就能看到自己的负担曲线。」 -->
            <div style="font-size:11.5px;color:var(--sage-900);margin-top:8px;line-height:1.45;">先添加库存、记满 3 天，就能看到自己的负担曲线。</div>
          </div>
        </div>

        <div class="banner" style="background:#F2F0EB;">
          <div class="b-ic" style="background:#E8E5DF;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#A8B0AB" stroke-width="1.9"/><path d="M12 8v5M12 16.4v.4" stroke="#A8B0AB" stroke-width="2.2" stroke-linecap="round"/></svg>
          </div>
          <div>
            <div class="b-t" style="color:#6B7570;">今日还没有取出记录</div>
            <div class="b-s" style="color:#8F9791;">取出后这里会显示当日危害分与等级。</div>
          </div>
        </div>

        <div class="metrics">
          <div class="metric"><span class="m-l">今日成本</span><span class="m-v dim num">--</span></div>
          <div class="metric"><span class="m-l">健康净值</span><span class="m-v dim num">--</span></div>
          <div class="metric"><span class="m-l">今日焦油</span><span class="m-v dim num">--</span></div>
        </div>

        <div class="oprow">
          <div class="btn-progress" style="background:var(--sage-900);" onclick="goTo('s11')">
            <span class="bp-t" style="color:#fff;display:flex;align-items:center;gap:6px;">${IC.plusW}添加库存</span>
            <span></span>
          </div>
          <div class="btn-compact" style="display:flex;align-items:center;justify-content:center;gap:5px;">${IC.target}<span>设定目标</span></div>
        </div>
      </div>
    </div>
      ${TABBAR('home', true)}
  </div>`,
  alt:'本轮改动：① Hero 大数字 44 → 56，与 02 同构（余量实测后仍余 12px）；② 第三格标签「库存焦油」→「今日焦油」；③ 标签「肺部负担指数」→「近期负担指数」。'
});

/* ============================================================
   16 通知展开态
   ============================================================ */
screen({
  id:'s16', no:'16', name:'通知展开态', tag:'已定稿',
  html:`
  <div class="screen">
    <div class="notif-bg"></div>
    <div class="statusbar" style="color:#fff;position:relative;z-index:2;">
      <span class="num">21:30</span>
      <div class="sb-icons">
        <div class="sb-bar"><i style="background:#fff"></i><i style="background:#fff"></i><i style="background:#fff"></i><i style="background:#fff"></i></div>
        <span style="font-size:11px;font-weight:600;margin:0 1px">5G</span>
        <div class="sb-batt" style="border-color:#fff"><i style="background:#fff"></i></div>
      </div>
    </div>
    <div class="notif-wrap" style="position:relative;z-index:2;padding-top:56px;">
      <div style="text-align:center;color:#fff;margin:0 0 22px;font-size:14px;font-weight:500;letter-spacing:-.1px;">
        6月9日 星期二 · 通知中心
      </div>

      <div class="notif-card">
        <div class="notif-head">
          <div class="ni"><svg width="15" height="15" viewBox="0 0 96 96" fill="none">
            <line x1="10" y1="74" x2="86" y2="74" stroke="#7FA79B" stroke-width="5" stroke-linecap="round"/>
            <rect x="8" y="20" width="14" height="52" rx="7" fill="#F7F4EC"/>
            <rect x="30" y="34" width="14" height="38" rx="7" fill="#F7F4EC"/>
            <rect x="52" y="46" width="14" height="26" rx="7" fill="#F7F4EC"/>
            <rect x="74" y="56" width="14" height="16" rx="7" fill="#F7F4EC"/>
            <path d="M8 37 L8 27 A7 7 0 0 1 22 27 L22 37 Z" fill="#F0B37A"/>
          </svg></div>
          <span class="nt">戒烟有数</span>
          <span class="ntime num">21:30</span>
        </div>
        <div class="notif-title">今天的账本出来了</div>
        <div class="notif-text num">今日 5 支 · 危害 49 · 花费 ¥29.9。复看一遍，明天更容易。</div>
        <div class="notif-img">
          <div class="bars">
            ${[3,4,2,5,4,3,6].map((v,i)=>`<i class="${i===6?'hot':''}" style="height:${Math.round(v*7.2)}px"></i>`).join('')}
          </div>
        </div>
        <div class="notif-acts">
          <div class="na pri">看今天的账本</div>
          <div class="na sec">明天再说</div>
        </div>
      </div>
    </div>
  </div>`,
  alt:'本轮改动：对齐设计稿 16（N2 已改内容）—— 通知时间 21:30（对齐 12 屏设定的复盘提醒时间，原 21:42）；标题「今天的账本出来了」；正文「今日 5 支 · 危害 49 · 花费 ¥29.9。复看一遍，明天更容易。」（危害 49 按 A1 口径 n=5/T=46 推导）；图片附件「本周取出」7 柱保留（它本就是周视图，与复盘语境一致）；操作按钮改为「看今天的账本」（推荐，浅绿）+「明天再说」（中性）—— 原「先不抽」在复盘语境下已无意义，当天已成事实。'
});

/* ============================================================
   17 重负担档警示
   ============================================================ */
screen({
  id:'s17', no:'17', name:'重负担档警示', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead"><h2>戒烟有数</h2><div class="sub num">10 月 3 日 · 周六</div></div>
      <div style="padding:0 20px;display:flex;flex-direction:column;gap:12px;opacity:.4;">
        <div class="hero">
          <div class="hero-top"><span class="hero-label">近期负担指数 · 按最近两周的取出记录计算</span>${bandPill('中等',false)}</div>
          <div class="hero-num num">47.5<span>%</span></div>
          <div class="track"><i style="width:47.5%"></i></div>
          <div class="cap">库存 4 支 · 今日取出 13 支 · 目标每日少于 5 支</div>
        </div>
        <div class="metrics">
          <div class="metric"><span class="m-l">今日成本</span><span class="m-v num">¥76.1</span></div>
          <div class="metric"><span class="m-l">健康净值</span><span class="m-v num">52<small>%</small></span></div>
          <div class="metric"><span class="m-l">今日焦油</span><span class="m-v num">124<small>mg</small></span></div>
        </div>
        <div class="oprow">
          <div class="btn-progress"><span class="bp-t">今日 13 / 5 支</span>
            <span class="bp-dots"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></span></div>
          <div class="btn-compact">添加库存</div>
        </div>
      </div>
    </div>
      ${TABBAR('home')}
    <div class="scrim strong" data-close="s02"></div>
    <div class="sheet alert">
      <div class="handle"></div>
      <div class="a-ic" style="background:#F3D9CB;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 7v6.5M12 17.4v.4" stroke="#B4553F" stroke-width="2.8" stroke-linecap="round"/><path d="M12 2.5l9.5 17.5h-19L12 2.5z" stroke="#B4553F" stroke-width="2" stroke-linejoin="round"/></svg>
      </div>
      <h3>今天已经很重了</h3>
      <p class="a-p">当日危害 <b class="num" style="color:var(--warm)">86</b> 分，属重负担区间。今天就到这里吧。</p>
      <div class="a-metrics">
        <div class="am"><div class="am-v num" style="color:var(--warm)">86</div><div class="am-l">今日危害</div></div>
        <div class="am"><div class="am-v num">13<span style="font-size:15px;"> 支</span></div><div class="am-l">今日已取出</div></div>
      </div>
      <div class="a-note amber">
        <span style="flex:none;margin-top:1px;">${IC.chart}</span>
        <span>按这个量，7 天后负担指数 <b class="num">42.3 → 68.1</b></span>
      </div>
      <p class="a-note plain">想抽的时候先做 3 次深呼吸，通常 4 分钟后冲动会过去。</p>
      <div class="sheet-foot" style="padding-top:14px;">
        <button class="btn primary" style="height:52px;" onclick="goTo('s02')">✓ 今天到此为止</button>
        <button class="btn ghost" style="height:46px;border:0;color:var(--muted);" onclick="goTo('s02')">我知道了</button>
      </div>
    </div>
  </div>`,
  alt:'【触发规则】当日首次超目标 ≥3 支时弹一次，取代 03 屏、不叠加。数值按 design-spec.md §4 的 A1 口径重算：13 支 / 124mg → 危害 86（旧模型为 11 支 / 92）；7 天预测 42.3 → 68.1（设计稿原写 66.0，经查系误用起点 37.2，已订正为从 42.3 按 λ=0.12 递推的 68.1）。背景页同步：负担指数 47.5 · 净值 52% · 成本 ¥76.1 · 焦油 124mg · 库存 4 支 · 进度 13/5。'
});

/* ============================================================
   18 通知权限兜底
   ============================================================ */
screen({
  id:'s18', no:'18', name:'通知权限兜底', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead">
        <div class="row">
          <div><h2>戒烟有数</h2><div class="sub num">10 月 3 日 · 周六</div></div>
          <span class="pill outline">模型 A1</span>
        </div>
      </div>

      <!-- 常驻细条 28 高：整条可点 → 直达系统设置 -->
      <div style="margin:0 20px 10px;height:28px;background:#F2F0EB;border-radius:9px;display:flex;align-items:center;gap:7px;padding:0 11px;">
        <span style="display:grid;place-items:center;color:var(--muted);transform:scale(.82);">${IC.warn}</span>
        <span style="font-size:11.5px;color:var(--muted);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">通知已关闭 · 取出后不再推送提醒</span>
        <span style="color:var(--muted-light);font-size:11px;">›</span>
      </div>

      <div style="padding:0 20px;display:flex;flex-direction:column;gap:10px;">
        <div class="hero">
          <div class="hero-top"><span class="hero-label">近期负担指数 · 按最近两周的取出记录计算</span>${bandPill('中等',false)}</div>
          <div class="hero-num num">42.3<span>%</span></div>
          <div class="track"><i style="width:42.3%"></i></div>
          <div class="cap">库存 17 支 · 今日取出 4 支 · 目标每日少于 5 支</div>
        </div>

        <div class="lungcard">
          ${lung(0.85)}
          <div class="lc-main">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span style="font-size:11.5px;color:var(--muted);">肺部负担</span>
              <span class="pill grey" style="font-size:10px;padding:2px 8px;">实时渲染</span>
            </div>
            <div class="lc-cap">近两周每取出一支 · 肺色加深 1.9%</div>
          </div>
        </div>

        <div class="banner">
          <div class="b-ic">${IC.warn}</div>
          <div>
            <div class="b-t">中等负担 · 当日危害 42</div>
            <div class="b-s">少量吸烟也不安全，别把「少抽」当成低风险。</div>
          </div>
        </div>

        <div class="metrics">
          <div class="metric"><span class="m-l">今日成本</span><span class="m-v num">¥24.7</span></div>
          <div class="metric"><span class="m-l">健康净值</span><span class="m-v num">58<small>%</small></span></div>
          <div class="metric"><span class="m-l">今日焦油</span><span class="m-v num">38<small>mg</small></span></div>
        </div>

        <div class="oprow">
          <div class="btn-progress" onclick="goTo('s09')" style="flex:none;width:110px;padding:0 11px;gap:6px;justify-content:flex-start;">
            <span class="bp-t" style="font-size:12.5px;flex:none;">4 / 5</span>
            <span class="bp-dots" style="gap:3px;flex:none;"><i style="width:9px;" class="on"></i><i style="width:9px;" class="on"></i><i style="width:9px;" class="on"></i><i style="width:9px;" class="on"></i><i style="width:9px;"></i></span>
          </div>
          <div class="btn-compact" onclick="goTo('s22')" style="flex:1;width:auto;">放回库存</div>
        </div>
      </div>
    </div>
      ${TABBAR('home')}
  </div>`,
  alt:'对齐设计稿 18：本屏是「首页副本」而非设置页 —— 页头下方插入 28 高的常驻细条「通知已关闭 · 取出后不再推送提醒 ›」（整条可点 → 直达系统设置）。刻意不做弹窗、不做引导页。与 22 / 23 的临时反馈条同处页头下方，优先级：临时反馈 > 常驻提示（不同时出现）。Hero 标签为近期负担指数 · 胶囊中等 · 横幅中等负担 · 当日危害 42；三指标第三格今日焦油；操作区为「今日进度 fill + 放回库存 110」。'
});

/* ============================================================
   19 同步失败态
   ============================================================ */
screen({
  id:'s19', no:'19', name:'同步失败态', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="navhead"><span class="back" onclick="goTo('s06')">${IC.back}</span><span style="font-size:16px;font-weight:600;">设置</span><span class="spacer"></span></div>
      <div style="padding:0 20px;">
        <div class="group-label">提醒与干预</div>
        <div class="card" style="overflow:hidden;">
          <div class="rowitem">
            <div class="ri-ic">${IC.warn}</div>
            <div class="ri-main"><div class="ri-t">严厉危害警示</div><div class="ri-s">当日首次超过目标时弹出一次，同一天不重复</div></div>
            <div class="sw on"><i></i></div>
          </div>
          <div class="rowitem">
            <div class="ri-ic">${IC.clock}</div>
            <div class="ri-main"><div class="ri-t">每日复盘提醒</div><div class="ri-s num">21:30 · 每天仅推一次</div></div>
            <div class="sw on"><i></i></div>
          </div>
        </div>

        <div class="group-label">数据与隐私</div>
        <div class="card" style="overflow:hidden;">
          <div class="rowitem">
            <div class="ri-ic" style="background:var(--amber-bg);">${IC.sync}</div>
            <div class="ri-main"><div class="ri-t">跨设备同步</div></div>
            <span class="ri-v warm">同步失败</span>
          </div>
          <div style="padding:0 16px 15px;">
            <div style="background:var(--amber-bg);border-radius:14px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
              <div>
                <div style="font-size:12.5px;font-weight:600;color:#8A4A1C;">上次同步失败，本机数据完好。</div>
                <div style="font-size:11.5px;color:#8A6A4E;margin-top:3px;">不会丢失记录。</div>
              </div>
              <span data-goto="s07" style="font-size:12.5px;font-weight:600;color:var(--sage-900);flex:none;cursor:pointer;">重试</span>
            </div>
          </div>
          <div class="rowitem" onclick="goTo('s25')">
            <div class="ri-ic">${IC.up}</div>
            <div class="ri-main"><div class="ri-t">导出戒烟账本 CSV</div></div>
            ${IC.chev}
          </div>
          <div class="rowitem">
            <div class="ri-ic">${IC.lock}</div>
            <div class="ri-main"><div class="ri-t">本地数据</div></div>
            <span class="ri-v num">17 条记录</span>
          </div>
        </div>

        <div class="hint" style="margin-top:16px;">数据默认只保存在本机。未登录时不上传任何内容；登录后同步的是加密后的档案。</div>
      </div>
    </div>
  </div>`,
  alt:'两条规则：①「不会丢失记录」必须写在「重试」前面 —— 同步失败时用户最先怕的是数据没了；② 本屏页脚已删除（此前只在主屏删了，副本漏了）。'
});

/* ============================================================
   20 关于 · 有新版本
   ============================================================ */
screen({
  id:'s20', no:'20', name:'关于 · 有新版本', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead"><h2>我的</h2><div class="sub">戒烟 18 天 · 已记录 7 天</div></div>
    </div>
      ${TABBAR('mine')}
    <div class="scrim" data-close="s06"></div>
    <div class="sheet" style="height:430px;top:422px;bottom:auto;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>关于</h3><span class="x" onclick="goTo('s06')">${IC.x}</span></div>
      <div class="sheet-body">
        <div style="text-align:center;padding:4px 0 16px;">
          <div class="about-id"><svg width="32" height="32" viewBox="0 0 96 96" fill="none">
            <line x1="10" y1="74" x2="86" y2="74" stroke="#7FA79B" stroke-width="4" stroke-linecap="round"/>
            <rect x="8" y="20" width="14" height="52" rx="7" fill="#F7F4EC"/>
            <rect x="30" y="34" width="14" height="38" rx="7" fill="#F7F4EC"/>
            <rect x="52" y="46" width="14" height="26" rx="7" fill="#F7F4EC"/>
            <rect x="74" y="56" width="14" height="16" rx="7" fill="#F7F4EC"/>
            <path d="M8 37 L8 27 A7 7 0 0 1 22 27 L22 37 Z" fill="#F0B37A"/>
          </svg></div>
          <div style="font-size:15px;font-weight:600;margin-top:11px;">戒烟有数</div>
          <div style="font-size:11.5px;color:var(--muted);margin-top:3px;" class="num">版本 0.1 · 模型 A1</div>
        </div>

        <div style="background:var(--amber-bg);border-radius:14px;padding:13px 15px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-size:13.5px;font-weight:600;color:#8A4A1C;">检查更新</div>
            <div style="font-size:11.5px;color:#8A6A4E;margin-top:3px;" class="num">有新版本 v0.2</div>
          </div>
          <span class="pill" style="background:var(--sage-900);color:#fff;font-size:11.5px;padding:6px 12px;">立即更新</span>
        </div>

        <div style="margin-top:14px;border-top:1px solid var(--line-soft);">
          <div class="rowitem" style="padding:13px 0;" onclick="goTo('s10')">
            <div class="ri-main"><div class="ri-t" style="font-size:14px;">危害模型与证据</div></div>
            <span class="pill outline" style="font-size:10px;padding:2px 7px;">A1</span>${IC.chev}
          </div>
          <div class="rowitem" style="padding:13px 0;" onclick="goTo('s26')">
            <div class="ri-main"><div class="ri-t" style="font-size:14px;">隐私政策与用户协议</div></div>
            ${IC.chev}
          </div>
          <div class="rowitem" style="padding:13px 0;">
            <div class="ri-main"><div class="ri-t" style="font-size:14px;">反馈与建议</div></div>
            ${IC.chev}
          </div>
        </div>
      </div>
    </div>
  </div>`,
  alt:'13 屏的状态变体，唯一差别在检查更新行。'
});

/* ============================================================
   21 记录明细
   ============================================================ */
screen({
  id:'s21', no:'21', name:'记录明细', tag:'已定稿',
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead"><h2>账本</h2><div class="sub">每一笔取出都记在案</div></div>
      <div style="padding:0 20px;opacity:.35;">
        <div class="card" style="padding:14px 16px;"><div style="font-size:12.5px;color:var(--muted);">今天 · 4 笔</div></div>
      </div>
    </div>
      ${TABBAR('ledger')}
    <div class="scrim" data-close="s05"></div>
    <div class="sheet" style="height:596px;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>记录明细</h3><span class="x" onclick="goTo('s05')">${IC.x}</span></div>
      <div class="sheet-sub">记错了随时改 —— 账本会跟着重算当天的危害分。</div>
      <div class="sheet-body">
        <div class="field" style="justify-content:space-between;">
          <span style="font-size:15px;">品牌</span>
          <span style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:15px;color:var(--muted);">南京 雨花石</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#8A948D" stroke-width="2.2" stroke-linecap="round"/></svg>
          </span>
        </div>
        <div class="field" style="justify-content:space-between;margin-top:11px;">
          <span style="font-size:15px;">取出时间</span>
          <span style="display:flex;align-items:center;gap:8px;">
            <span class="num" style="font-size:15px;color:var(--muted);">08:42</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#8A948D" stroke-width="2.2" stroke-linecap="round"/></svg>
          </span>
        </div>

        <div style="font-size:12.5px;color:var(--muted);margin-top:14px;">
          这一支：焦油 9mg · 花费 ¥2.65 · 当天危害 <b class="num" style="color:var(--warm)">+7</b>
        </div>
      </div>
      <div class="sheet-foot">
        <button class="btn primary" style="height:52px;" onclick="goTo('s05')">保存修改</button>
        <button class="btn ghost" style="margin-top:11px;height:50px;color:var(--warm);border-color:#E9CFC4;">删除这条记录</button>
        <div style="text-align:center;font-size:11.5px;color:var(--muted);margin-top:13px;line-height:1.6;">
          删除后当天危害分会重新计算，不会影响其它记录。
        </div>
      </div>
    </div>
  </div>`,
  alt:'「删除这条记录」与「保存修改」上下并列 —— 破坏性动作用描边暖褐，且不做主按钮。'
});

/* ============================================================
   22 忍住反馈
   ============================================================ */
screen({
  id:'s22', no:'22', name:'忍住反馈', tag:'已定稿',
  /* 不再是手抄的首页副本 —— 与 02 的「③ 忍住」态同一份 HTML（见 homeScreen） */
  html: HOME_HOLD,
  alt:'【浮层规格】x20 y118 w353 · 圆角 14 · padding 12/14 · 绝对定位 · 停 2.6s。主文案 13px Medium #38665F ／ 副文案 11px #4A6B60，底 #F2F7F5（正向极浅绿）。【口径】文案按设计稿：主「今天第 3 次忍住」、副「这一支没抽，少摄入焦油 8mg · 省下 ¥1.75」—— 忍住不增加当日危害，故 hero/三指标与首页保持一致（42.3 / ¥24.7 / 58% / 38mg）。【2026-10-03】本屏与 02 的「③ 忍住」态共用同一份 HTML（homeScreen），不再手抄。'
});

/* ============================================================
   23 取出成功
   ============================================================ */
screen({
  id:'s23', no:'23', name:'取出成功', tag:'新增', isNew:true,
  /* 不再是手抄的首页副本 —— 与 02 的「② 取出后」态同一份 HTML（见 homeScreen）。
     这正是原先的 bug：23 的数值虽对，但和 02 完全脱节，用户在弹层里点了
     「仍要取出一支」，看到的却是一张数字没变的首页。 */
  html: HOME_AFTER,
  alt:'与 22 屏构成镜像：忍住 = 浅绿底 + 勾（正向）· 取出 = 中性绿底 + 取出图标（中性）。停 1.8s（它只是确认，不是激励）。数值链：危害分 42→49 · 焦油 38→46mg · 成本 ¥24.7→¥29.9 · 净值 58%→57% · 负担 42.3→43.1 · 库存 17→16。【2026-10-03】本屏与 02 的「② 取出后」态共用同一份 HTML（homeScreen），不再手抄。'
});

/* ============================================================
   24 首页 · 今日 0 支
   ============================================================ */
screen({
  id:'s24', no:'24', name:'首页 · 今日 0 支', tag:'新增', isNew:true,
  /* 不再是手抄的首页副本 —— 与 02 的「④ 今日 0 支」态同一份 HTML（见 homeScreen） */
  html: HOME_ZERO,
  alt:'本屏定义三条全产品规则：① 危害横幅极性随危害分走（= 0 时转浅绿正向态）② 放回库存在今日取出为 0 时置灰 ③ 肺部负担色块透明度 85% → 35%。数值：危害分恰好 0 · 负担 0.88×42.3+0.12×0 = 37.2 · 净值 100−37.2 = 63%（昨天 58%，涨 5 点 = 衰减生效）。【2026-10-03】本屏与 02 的「④ 今日 0 支」态共用同一份 HTML（homeScreen），不再手抄；肺卡内版式随之统一为与 02 一致的上下结构。'
});

/* ============================================================
   25 导出账本
   ============================================================ */
/* ============================================================
   25 导出账本  ——  三态：导出中 / 成功 / 失败
   规格源：design-full.html §25
   失败文案顺序是刻意的：先安抚（数据完好），再要求操作（重试）。
   ============================================================ */
function exportSheet(inner, footH){
  return `
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="navhead"><span class="back" onclick="goTo('s07')">${IC.back}</span><span style="font-size:16px;font-weight:600;">设置</span><span class="spacer"></span></div>
      <div style="padding:0 20px;opacity:.35;">
        <div class="card" style="overflow:hidden;">
          <div class="rowitem"><div class="ri-main"><div class="ri-t">导出戒烟账本 CSV</div></div>${IC.chev}</div>
          <div class="rowitem"><div class="ri-main"><div class="ri-t">本地数据</div></div><span class="ri-v num">17 条</span></div>
        </div>
      </div>
    </div>
    <div class="scrim" data-close="s07"></div>
    <div class="sheet" style="height:${footH?400:300}px;top:${footH?452:552}px;bottom:auto;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>导出戒烟账本</h3><span class="x" onclick="goTo('s07')">${IC.x}</span></div>
      <div class="sheet-body">${inner}</div>
      ${footH?`<div class="sheet-foot">
        <button class="btn primary" onclick="goTo('s07')">用其他应用打开</button>
        <div class="link">存储到文件</div>
      </div>`:''}
    </div>
  </div>`;
}

screen({
  id:'s25', no:'25', name:'导出账本', tag:'新增', isNew:true,
  html: exportSheet(`
    <div style="background:var(--sage-100);border-radius:16px;padding:16px;display:flex;gap:12px;align-items:flex-start;">
      <div style="width:34px;height:34px;border-radius:11px;background:var(--sage-200);display:grid;place-items:center;flex:none;">${IC.check}</div>
      <div>
        <div style="font-size:14px;font-weight:600;color:var(--sage-900);">导出完成</div>
        <div style="font-size:11.5px;color:#4A6B60;margin-top:5px;line-height:1.6;" class="num">
          戒烟有数-账本-2026-06-09.csv<br>21 条记录 · 12 KB
        </div>
      </div>
    </div>`, true),
  alt:'三态：① 导出中 —— 三点呼吸动画 +「正在整理 21 条记录…」，超过 1.5s 才显示，不可取消（本地读写无法中断，给取消只会制造不确定）；② 成功 —— 如本屏；③ 失败 —— 暖底卡（感叹号 +「导出失败」+「数据完好，不会丢失记录。」）→ 主按钮「重试」→ 文字链「取消」。失败文案顺序是刻意的：先安抚、再要求操作。'
});

variants('s25', [
  { name:'导出中', note:'三点呼吸 + 「正在整理 21 条记录…」· 超过 1.5s 才出现 · 不可取消',
    html: exportSheet(`
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;padding:22px 0;">
        <div class="breath"><i></i><i></i><i></i></div>
        <div style="font-size:13px;color:var(--muted);" class="num">正在整理 21 条记录…</div>
      </div>`, false) },
  { name:'成功', note:'文件名 + 记录条数与体积；主按钮「用其他应用打开」',
    html: exportSheet(`
      <div style="background:var(--sage-100);border-radius:16px;padding:16px;display:flex;gap:12px;align-items:flex-start;">
        <div style="width:34px;height:34px;border-radius:11px;background:var(--sage-200);display:grid;place-items:center;flex:none;">${IC.check}</div>
        <div>
          <div style="font-size:14px;font-weight:600;color:var(--sage-900);">导出完成</div>
          <div style="font-size:11.5px;color:#4A6B60;margin-top:5px;line-height:1.6;" class="num">
            戒烟有数-账本-2026-06-09.csv<br>21 条记录 · 12 KB
          </div>
        </div>
      </div>`, true) },
  { name:'失败态', note:'先安抚（数据完好）再要求操作（重试）· 主按钮是重试、取消走文字链',
    html: `
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="navhead"><span class="back" onclick="goTo('s07')">${IC.back}</span><span style="font-size:16px;font-weight:600;">设置</span><span class="spacer"></span></div>
      <div style="padding:0 20px;opacity:.35;">
        <div class="card" style="overflow:hidden;">
          <div class="rowitem"><div class="ri-main"><div class="ri-t">导出戒烟账本 CSV</div></div>${IC.chev}</div>
          <div class="rowitem"><div class="ri-main"><div class="ri-t">本地数据</div></div><span class="ri-v num">17 条</span></div>
        </div>
      </div>
    </div>
    <div class="scrim" data-close="s07"></div>
    <div class="sheet" style="height:400px;top:452px;bottom:auto;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>导出戒烟账本</h3><span class="x" onclick="goTo('s07')">${IC.x}</span></div>
      <div class="sheet-body">
        <div style="background:#FFF7F4;border:1px solid #EFDCD5;border-radius:16px;padding:16px;display:flex;gap:12px;align-items:flex-start;">
          <div style="width:34px;height:34px;border-radius:11px;background:#F5DCC8;display:grid;place-items:center;flex:none;">${IC.warn}</div>
          <div>
            <div style="font-size:14px;font-weight:600;color:#8A4A1E;">导出失败</div>
            <div style="font-size:11.5px;color:#8A4A1E;margin-top:5px;line-height:1.6;opacity:.9;">存储空间不足，或文件正被其他应用占用。<b>数据完好，不会丢失记录。</b></div>
          </div>
        </div>
      </div>
      <div class="sheet-foot">
        <button class="btn primary" onclick="goTo('s25')">重试</button>
        <div class="link" onclick="goTo('s07')">取消</div>
      </div>
    </div>
  </div>` }
]);

/* ============================================================
   26 隐私政策与用户协议
   ============================================================ */
screen({
  id:'s26', no:'26', name:'隐私政策与用户协议', tag:'新增', isNew:true,
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="navhead"><span class="back" onclick="goTo('s13')">${IC.back}</span><span style="font-size:16px;font-weight:600;">隐私与协议</span><span class="spacer"></span></div>
      <div style="padding:2px 20px 0;">
        <h2 style="font-size:24px;font-weight:600;letter-spacing:-.5px;">你的数据在哪，你最该知道</h2>
        <p class="note" style="margin-top:8px;">戒烟有数是本地优先：记录先写在本机，同步是可选的。</p>
      </div>
      <div style="padding:16px 20px 0;display:flex;flex-direction:column;gap:9px;">
        ${[
          ['不收集什么','不采集通讯录、位置、相册与设备标识；没有埋点 SDK，没有第三方统计。'],
          ['数据存在哪','库存、账本、目标与设置只写在本机数据库。卸载即销毁。'],
          ['什么时候离开本机','只有在你主动登录、且开启跨设备同步时。上传前在本机加密，服务端只存密文。'],
          ['导出与删除','随时可导出 CSV；「清空库存」只删库存，账本记录由你在记录明细里逐条管理。'],
          ['关于健康数据','本模型用于自我观察，不构成医学建议，不能用于诊断或治疗。'],
          ['联系我们','feedback@quitcount.app（占位，上架前替换为真实邮箱）']
        ].map(([t,d])=>`
          <div class="card line" style="padding:14px 15px;border-radius:16px;box-shadow:none;">
            <div style="font-size:13.5px;font-weight:600;">${t}</div>
            <div style="font-size:12px;color:var(--muted);line-height:1.62;margin-top:5px;">${d}</div>
          </div>`).join('')}
      </div>
      <div style="margin-top:auto;padding:18px 24px 30px;">
        <p class="note" style="text-align:center;">更新于 2026-06-09 · 适用版本 0.1（模型 A1）</p>
      </div>
    </div>
  </div>`,
  alt:'【为什么值得做】应用市场没有隐私政策页是常见驳回原因；对本地优先的产品，这一屏的核心不是法律免责，而是把「你的数据不上云」落到实处 —— 它本来就是最该被看见的卖点。刻意不抄模板长文：模板长文没人读。【六节】一、我们收集什么（什么都不收集）／二、数据存在哪（应用私有目录，卸载即删除）／三、什么时候会离开本机／四、导出与删除／五、关于健康数据（自测指标，不构成医学诊断）／六、联系我们。'
});

/* ============================================================
   27 品牌详情
   ============================================================ */
screen({
  id:'s27', no:'27', name:'品牌详情', tag:'新增', isNew:true,
  html:`
  <div class="screen">
    ${STATUS()}
    <div class="body">
      <div class="pagehead"><h2>库存总览</h2><div class="sub">按每日少于 5 支对齐</div></div>
      <div style="padding:0 20px;opacity:.35;">
        <div class="card" style="overflow:hidden;">
          <div class="rowitem"><div class="ri-main"><div class="ri-t">云烟 细支</div><div class="ri-s">库存 12 支 · 持有 6 天</div></div></div>
          <div class="rowitem"><div class="ri-main"><div class="ri-t">中南海 低焦</div><div class="ri-s">库存 5 支 · 持有 3 天</div></div></div>
        </div>
      </div>
    </div>
      ${TABBAR('assets')}
    <div class="scrim" data-close="s04"></div>
    <div class="sheet" style="height:640px;">
      <div class="handle"></div>
      <div class="sheet-head"><h3>编辑资产</h3><span class="x" onclick="goTo('s04')">${IC.x}</span></div>
      <div class="sheet-sub">改品牌、含量或余量 —— 只影响后续记录，历史账目不动。</div>
      <div class="sheet-body">
        <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">品牌</div>
        <div class="field focus"><span style="font-size:15px;">云烟 细支</span></div>

        <div style="display:flex;gap:11px;margin-top:15px;">
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">焦油含量</div>
            <div class="field"><span class="num" style="font-size:15px;">8</span><span style="margin-left:auto;color:var(--muted);font-size:13px;">mg</span></div>
          </div>
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">尼古丁</div>
            <div class="field"><span class="num" style="font-size:15px;">0.8</span><span style="margin-left:auto;color:var(--muted);font-size:13px;">mg</span></div>
          </div>
        </div>

        <div style="display:flex;gap:11px;margin-top:15px;">
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">包装价</div>
            <div class="field"><span style="color:var(--muted);font-size:14px;">¥</span><span class="num" style="font-size:15px;">35</span><span style="margin-left:auto;color:var(--muted);font-size:13px;">/ 包</span></div>
          </div>
          <div style="flex:1;">
            <div style="font-size:11.5px;color:var(--muted);margin-bottom:7px;">单支价格</div>
            <div class="field" style="background:#F7F5F1;border-color:var(--line-soft);"><span class="num" style="font-size:15px;color:var(--sage-900);font-weight:600;">¥1.75</span></div>
          </div>
        </div>

        <div style="font-size:11.5px;color:var(--muted);margin:15px 0 7px;">剩余库存</div>
        <div class="field" style="justify-content:space-between;height:56px;">
          <span data-s27dir="-1" style="width:32px;height:32px;border-radius:10px;background:#F2F0EB;display:grid;place-items:center;font-size:19px;color:var(--muted);cursor:pointer;">−</span>
          <span style="display:flex;align-items:baseline;gap:5px;"><span class="num" data-s27val style="font-size:24px;font-weight:600;">12</span><span style="font-size:13px;color:var(--muted);">支</span></span>
          <span data-s27dir="1" style="width:32px;height:32px;border-radius:10px;background:var(--sage-200);display:grid;place-items:center;font-size:19px;color:var(--sage-900);cursor:pointer;">＋</span>
        </div>

        <div style="background:var(--cream);border-radius:15px;padding:13px 15px;margin-top:16px;">
          <div class="kv" style="padding:0 0 9px;"><span class="k" style="font-size:12.5px;">持有天数</span><span class="v num" style="font-size:12.5px;">6 天</span></div>
          <div class="kv" style="padding:9px 0 0;"><span class="k" style="font-size:12.5px;">这支烟的健康负债</span><span class="v amber num" style="font-size:12.5px;">−¥41.3</span></div>
        </div>
      </div>
      <div class="sheet-foot">
        <button class="btn primary" onclick="goTo('s04')">保存修改</button>
        <button class="btn ghost" style="margin-top:11px;height:50px;">${IC.trash}删除这个品牌</button>
        <p class="note" style="margin-top:11px;text-align:center;">删除后会一并移除该品牌的取出记录，当天的危害分随之重算。</p>
      </div>
    </div>
  </div>`,
  alt:'N7 的落地屏。字段结构复用 11 屏，交互范式复用 21 屏。删除按破坏力分两级：04 屏左滑即时删除（可撤销、无二次确认）；本屏内删除连带历史记录，必须二次确认（沿用 14 屏警示弹层范式 · 底部弹层，2026-10-08 对齐）。'
});

/* ============================================================
   ★ 换烟后的重算入口（2026-10-03 · 08 弹层真联动）
   ------------------------------------------------------------
   为什么必须显式重算：screens.js 里每屏的 html 是【注册时的字符串快照】——
   variants('s02', [...]) 与 screen({id:'s23', html:HOME_AFTER}) 都在调用那一刻
   就把值取走了。所以改了 PICKED 之后，光重渲染 app.js 是不够的：
   22 / 23 / 02 的 ② 态这几份快照本身还是旧的。

   本函数把「取出一支烟」会波及的所有快照一次性重算并写回。
   凡是新增一处依赖 selected 烟的展示，都必须在这里登记 —— 这就是单点口径的
   维护成本：加副本要还债，但只需还这一处。
   ============================================================ */
function refreshDerived(){
  HOME_AFTER = homeAfter();
  HOME_HOLD  = homeHold();

  /* 02 首页的 ② / ③ 两态（variants 里存的是快照，需按名字找回原位） */
  const v2 = VARIANTS['s02'] || [];
  const setV = (name, html)=>{
    const i = v2.findIndex(v=>v.name === name);
    if(i >= 0) v2[i].html = html;
  };
  setV('② 取出后', HOME_AFTER);
  setV('③ 忍住',   HOME_HOLD);
  /* 02 屏自身的主 html 是 ① 取出前，不随选烟变化，无需改 */

  /* 22 忍住 / 23 取出成功 —— 与 02 的 ③ / ② 共用同一份 HTML */
  const s22 = SCREENS.find(s=>s.id === 's22'); if(s22) s22.html = HOME_HOLD;
  const s23 = SCREENS.find(s=>s.id === 's23'); if(s23) s23.html = HOME_AFTER;

  /* 08 弹层自身：承诺行随选中的烟变 */
  const s08 = SCREENS.find(s=>s.id === 's08'); if(s08) s08.html = takeSheet();
  const v8 = VARIANTS['s08'] || [];
  if(v8[0]) v8[0].html = takeSheet('yunyan');
  if(v8[1]) v8[1].html = takeSheet('zhongnan');
}

/* app.js 的 bindNav 在 [data-pick] 上调用它：切选中项 + 就地重算。
   与 app.js 里的 window.goTo 是同一套「screens.js 向 app.js 暴露入口」的先例。 */
window.setPick = function(id){
  if(!CIGARETTES[id] || id === PICKED) return false;
  PICKED = id;
  refreshDerived();
  return true;
};
/* 供评审/断言读取当前选中项 */
window.getPick = function(){ return PICKED; };
