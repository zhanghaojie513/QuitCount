/* ============================================================
   浏览器真点击探针（Node 版，免 Python）
   ------------------------------------------------------------
   为什么需要它：verify-regression-27.js 在 Node 里桩化跑 screens.js，
   证明「数据与标记」正确，但测不到 app.js 的事件绑定 —— 本项目踩过
   「数据全对、按钮没绑、点了没反应，桩化测试全绿」。本探针在真实
   Chrome 里 .click() 走完全部链路，是「绑定真的接上了」的唯一证据。

   覆盖（2026-10-08）：
     A. 08 选烟 → 23 落点（原 make-browser-probe.py 的全部断言）
     B. 遮罩点击关闭（data-close）
     C. 死控件补线（17 我知道了 / 18 Tab+放回库存 / 05 查看全部）
     D. 微交互（09 步进器 / 12 时段胶囊 / 27 库存步进 / 开关）
     E. 深链（#s08/1 启动直达屏+状态，且 PICKED 同步）
   A–D 走无 hash 加载，E 走 #s08/1 加载 —— 两次 headless 一条命令跑完。

   跑法： node qa/browser-probe.mjs
   依赖：Chrome 标准安装位，或环境变量 CHROME 指定。
   临时产物 _probe.html 每次自动重生，已入 .gitignore。
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url))); // prototype-visual/
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const css = rd('style.css'), scr = rd('screens.js'), app = rd('app.js');

/* ---------- 探针页里的断言脚本（浏览器内执行） ---------- */
const probe = `
window.__R = [];
function rec(k, v){ window.__R.push('RESULT::' + k + '==' + v); }
function text(sel){ var n=document.querySelector(sel); return n ? (n.textContent||'').replace(/\\s+/g,'').trim() : '(null)'; }
function byText(sel, t){ var ns=document.querySelectorAll(sel); for(var i=0;i<ns.length;i++){ if((ns[i].textContent||'').replace(/\\s+/g,'').indexOf(t)>=0) return ns[i]; } return null; }
window.addEventListener('load', function(){
  try{
    /* —— 0. 启动态（无 hash 时应为 s02 / yunyan；#s08/1 时应为 s08 / zhongnan）—— */
    rec('boot.screen', document.getElementById('phone').dataset.screen);
    rec('boot.pick', String(window.getPick()));

    /* —— A. 08 选烟 → 23 落点（经典链路）—— */
    window.goTo('s08');
    var s08 = document.getElementById('phone');
    rec('进08.pick行数', String(s08.querySelectorAll('[data-pick]').length));
    rec('进08.承诺行', text('#phone .sheet-foot .card div'));
    var rowZ = s08.querySelector('[data-pick="zhongnan"]');
    rec('找到中南海行', String(!!rowZ));
    if(rowZ){ rowZ.click(); }
    rec('点后.PICKED', String(window.getPick()));
    rec('点后.承诺行', text('#phone .sheet-foot .card div'));
    rec('点后.勾在中南海', String(!!s08.querySelector('[data-pick="zhongnan"] svg')));
    var go23 = null, all = s08.querySelectorAll('[data-goto]');
    for(var i=0;i<all.length;i++){ if(all[i].dataset.goto==='s23'){ go23 = all[i]; break; } }
    rec('找到仍要取出', String(!!go23));
    if(go23){ go23.click(); }
    var p = document.getElementById('phone');
    rec('23.screen', p.dataset.screen);
    var mv = [];
    p.querySelectorAll('.metric .m-v').forEach(function(n){ mv.push((n.textContent||'').replace(/\\s+/g,'').trim()); });
    rec('23.三指标', mv.join('/'));
    rec('23.hero负担', text('#phone .hero-num'));
    rec('23.cap', text('#phone .cap'));
    rec('23.横幅', text('#phone .banner .b-t'));
    rec('23.含27.9', String(p.innerHTML.indexOf('27.9')>=0));
    rec('23.含29.9', String(p.innerHTML.indexOf('29.9')>=0));

    /* —— B. 遮罩点击关闭：09 的遮罩应回 06 —— */
    window.goTo('s09');
    document.querySelector('#phone [data-close]').click();
    rec('遮罩关09.落点', document.getElementById('phone').dataset.screen);
    rec('遮罩关09.hash', location.hash);

    /* —— C1. 17 我知道了 → s02 —— */
    window.goTo('s17');
    byText('#phone .btn', '我知道了').click();
    rec('17我知道了.落点', document.getElementById('phone').dataset.screen);

    /* —— C2. 18 Tab → 账本 s05；放回库存 → s22 —— */
    window.goTo('s18');
    byText('#phone .tab', '账本').click();
    rec('18Tab账本.落点', document.getElementById('phone').dataset.screen);
    window.goTo('s18');
    byText('#phone .btn-compact', '放回库存').click();
    rec('18放回.落点', document.getElementById('phone').dataset.screen);

    /* —— C3. 05 查看全部 → s21 —— */
    window.goTo('s05');
    byText('#phone [data-goto]', '查看全部').click();
    rec('05查看全部.落点', document.getElementById('phone').dataset.screen);

    /* —— C4. 19 重试 → s07 —— */
    window.goTo('s19');
    byText('#phone [data-goto]', '重试').click();
    rec('19重试.落点', document.getElementById('phone').dataset.screen);

    /* —— D1. 09 步进器：+ → 6；预设 3 → 3；− 到下限 —— */
    window.goTo('s09');
    var v9 = function(){ return document.querySelector('[data-s9val]').textContent; };
    var dotsOn = function(){ return document.querySelectorAll('[data-s9dots] i.on').length; };
    document.querySelector('[data-s9dir="1"]').click();
    rec('09加一格', v9() + '/' + dotsOn());
    byText('#phone [data-s9preset]', '3支').click();
    rec('09预设3', v9() + '/' + dotsOn());
    for(var j=0;j<25;j++){ document.querySelector('[data-s9dir="-1"]').click(); }
    rec('09下限钳制', v9() + '/' + dotsOn());

    /* —— D2. 12 时段胶囊单选 —— */
    window.goTo('s12');
    var chips = document.querySelectorAll('[data-t12]');
    chips[0].click();
    rec('12单选', chips[0].classList.contains('on') + '/' + chips[1].classList.contains('on'));

    /* —— D3. 27 库存步进 + → 13，− ×2 → 11，− 到底不为负 —— */
    window.goTo('s27');
    var v27 = function(){ return document.querySelector('[data-s27val]').textContent; };
    document.querySelector('[data-s27dir="1"]').click();
    rec('27加一支', v27());
    document.querySelector('[data-s27dir="-1"]').click();
    document.querySelector('[data-s27dir="-1"]').click();
    rec('27减两支', v27());
    for(var k=0;k<20;k++){ document.querySelector('[data-s27dir="-1"]').click(); }
    rec('27下限钳制', v27());

    /* —— D4. 开关可拨，且不触发所在行跳转 —— */
    window.goTo('s07');
    var sw = document.querySelector('#phone .sw');
    var wasOn = sw.classList.contains('on');
    sw.click();
    rec('07开关拨动', wasOn + '→' + sw.classList.contains('on'));
    rec('07开关未跳转', document.getElementById('phone').dataset.screen);

    /* —— E2. hash 双向同步 —— */
    window.goTo('s05');
    rec('hash同步', location.hash);
  }catch(e){ rec('EXCEPTION', e && e.message ? e.message : String(e)); }
  var d = document.createElement('div');
  d.id = 'PROBE_OUT';
  d.textContent = window.__R.join('|');
  document.body.appendChild(d);
});
`;

function buildPage(){
  return ("<!DOCTYPE html><html lang=\"zh-CN\" class=\"static\"><head><meta charset=\"utf-8\">"
    + "<title>probe</title><style>" + css + "</style></head><body>"
    + "<header class=\"topbar\"><div class=\"tb-left\"><span class=\"tb-mark\"></span><div>"
    + "<h1>戒烟有数</h1><p id=\"tbSub\">probe</p></div></div>"
    + "<div class=\"tb-right\"><div class=\"seg\" id=\"scaleSeg\">"
    + "<button data-scale=\"0.8\">80%</button><button data-scale=\"1\" class=\"on\">100%</button>"
    + "<button data-scale=\"1.2\">120%</button></div></div></header>"
    + "<main class=\"stage\"><nav class=\"flowbar\" id=\"flowbar\"></nav>"
    + "<section class=\"viewport\"><div class=\"device\"><div class=\"phone\" id=\"phone\"></div>"
    + "<div class=\"home-indicator\"></div></div><div class=\"under\" id=\"under\"></div>"
    + "</section></main>"
    + "<script>" + scr + "<\/script><script>" + app + "<\/script><script>" + probe + "<\/script>"
    + "</body></html>");
}

const CHROME = process.env.CHROME ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe';
const pagePath = path.join(ROOT, '_probe.html');
fs.writeFileSync(pagePath, buildPage());

function runChrome(hash){
  const url = 'file:///' + pagePath.replace(/\\/g, '/') + (hash || '');
  const dom = execFileSync(CHROME, [
    '--headless=new','--disable-gpu','--no-sandbox','--dump-dom',
    '--virtual-time-budget=6000', url
  ], { encoding:'utf8', maxBuffer: 64*1024*1024 });
  /* 只解析 #PROBE_OUT 容器：--dump-dom 会把内联脚本源码里的 'RESULT::' 字面量
     也序列化出来，整页正则会把代码切成假断言（虚增通过数）。
     容器内容形如 k1==v1|k2==v2，值里不含 '|'，先取容器再按 '|' 切是安全的。 */
  const seg = dom.match(/id="PROBE_OUT">([^<]*)/);
  if(!seg) return [];
  const out = [];
  seg[1].split('|').forEach(pair=>{
    pair = pair.replace(/^RESULT::/, '');
    const i = pair.indexOf('==');
    if(i > 0) out.push([pair.slice(0, i), pair.slice(i + 2)]);
  });
  return out;
}

/* ---------- 断言表：[key, 期望值, 标签] ---------- */
const CHECKS = [];
function check(res, k, want, label){
  CHECKS.push({ k, want: String(want), label: label || k, res });
}
const FAILS = [];
function runChecks(){
  CHECKS.forEach(c=>{
    const hit = c.res.find(r => r[0] === c.k);
    const got = hit ? hit[1] : '(缺失)';
    if(got !== c.want) FAILS.push(c.label + '  期望[' + c.want + '] 实得[' + got + ']');
  });
}

/* 第 1 轮：无 hash */
const R1 = runChrome('');
CHECKS.length = 0; FAILS.length = 0;
[
  ['boot.screen','s02','启动落点=首页'],
  ['boot.pick','yunyan','启动默认烟=云烟'],
  ['进08.pick行数','2','08 两行可选'],
  ['进08.承诺行','取出「云烟细支」后：当日危害42→49','08 默认承诺行'],
  ['找到中南海行','true','中南海行存在'],
  ['点后.PICKED','zhongnan','点击后 PICKED 切换'],
  ['点后.承诺行','取出「中南海低焦」后：当日危害42→48','08 换烟承诺行'],
  ['点后.勾在中南海','true','勾选态跟随'],
  ['找到仍要取出','true','仍要取出按钮存在'],
  ['23.screen','s23','落点 23'],
  ['23.三指标','¥27.9/57%/43mg','23 三指标(5mg 链)'],
  ['23.hero负担','43%','23 负担(5mg 链)'],
  ['23.cap','库存16支·今日取出5支·目标每日少于5支','23 库存联动'],
  ['23.横幅','中等负担·当日危害48','23 横幅(5mg 链)'],
  ['23.含27.9','true','23 含 ¥27.9'],
  ['23.含29.9','false','23 不含 ¥29.9'],
  ['遮罩关09.落点','s06','遮罩点击关闭回母屏'],
  ['遮罩关09.hash','#s06','遮罩关闭后 hash 同步'],
  ['17我知道了.落点','s02','17 我知道了可退出'],
  ['18Tab账本.落点','s05','18 Tab 可点'],
  ['18放回.落点','s22','18 放回库存可点'],
  ['05查看全部.落点','s21','05 查看全部 → 明细'],
  ['19重试.落点','s07','19 重试 → 设置'],
  ['09加一格','6/6','09 步进 +'],
  ['09预设3','3/3','09 预设联动'],
  ['09下限钳制','1/1','09 下限 1'],
  ['12单选','true/false','12 时段单选'],
  ['27加一支','13','27 步进 +'],
  ['27减两支','11','27 步进 −'],
  ['27下限钳制','0','27 下限 0'],
  ['07开关拨动','true→false','开关可拨'],
  ['07开关未跳转','s07','拨开关不跳转'],
  ['hash同步','#s05','切屏 hash 双向同步'],
].forEach(([k,w,l])=>check(R1,k,w,l));
runChecks();
const pass1 = CHECKS.length - FAILS.length, tot1 = CHECKS.length;

/* 第 2 轮：#s08/1 深链（屏 + 状态 + PICKED 三者一致） */
const R2 = runChrome('#s08/1');
CHECKS.length = 0;
[
  ['boot.screen','s08','深链直达 08'],
  ['boot.pick','zhongnan','深链同步选中烟'],
].forEach(([k,w,l])=>check(R2,k,w,l));
runChecks();
const pass2 = CHECKS.length - FAILS.length, tot2 = CHECKS.length;

/* ---------- 输出 ---------- */
console.log('--------');
if(FAILS.length){
  FAILS.forEach(f=>console.log('FAIL  ' + f));
}
console.log('浏览器探针：通过 ' + (pass1 + pass2) + ' / ' + (tot1 + tot2) +
            (FAILS.length ? '   失败 ' + FAILS.length : '   全部通过'));
process.exit(FAILS.length ? 1 : 0);
