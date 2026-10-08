/* 08 弹层真联动 —— 断言脚本（Node 桩化 window，无需浏览器） */
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync(require('path').join(__dirname,'..','screens.js'), 'utf8');
const sandbox = { window:{}, console };
vm.createContext(sandbox);
vm.runInContext(src, sandbox);

const R = [];
const ok = (name, cond, detail)=>{ R.push({ name, pass: !!cond, detail: detail||'' }); };
const has = (html, s)=> html.indexOf(s) >= 0;

const S = vm.runInContext('SCREENS', sandbox);
const V = vm.runInContext('VARIANTS', sandbox);
const byId = id => S.find(s=>s.id===id);

/* ---------- 1. 结构：屏数仍为 27 ---------- */
ok('屏总数 = 27', S.length === 27, '实际 '+S.length);

/* ---------- 2. 初始（PICKED = yunyan）---------- */
const s23_0 = byId('s23').html;
ok('初始 23 危害 49', has(s23_0, '>49<') || has(s23_0,'49</'), '');
ok('初始 23 焦油 46mg', /46<small>mg<\/small>/.test(s23_0), '');
ok('初始 23 成本 ¥29.9', has(s23_0, '¥29.9'), '');
ok('初始 23 负担 43.1', has(s23_0, '43.1'), '');
ok('初始 23 净值 57%', has(s23_0, '57'), '');
ok('初始 23 库存 16 支', has(s23_0, '库存 16 支'), '');

const s08_0 = byId('s08').html;
ok('08 承诺行 42 → 49', has(s08_0, '当日危害 42 → 49'), '');
ok('08 承诺 焦油 +8mg', has(s08_0, '焦油 +8mg'), '');
ok('08 承诺 健康折算 +¥3.44', has(s08_0, '健康折算 +¥3.44'), '');
ok('08 「仍要取出一支」→ s23', has(s08_0, 'data-goto="s23"'), '');

/* ---------- 3. 两支烟都能在 08 里找到，且带 data-pick ---------- */
ok('08 有 data-pick=yunyan', has(s08_0, 'data-pick="yunyan"'), '');
ok('08 有 data-pick=zhongnan', has(s08_0, 'data-pick="zhongnan"'), '');
ok('08 单品库存加「本品牌」限定词', has(s08_0, '本品牌库存 12 支') && has(s08_0,'本品牌库存 5 支'), '');

/* ---------- 4. variants('s08') 两态 + pick 字段 ---------- */
const v8 = V['s08'] || [];
ok('08 变体数 = 2', v8.length === 2, '实际 '+v8.length);
ok('08 变体[0].pick=yunyan', v8[0] && v8[0].pick === 'yunyan', '');
ok('08 变体[1].pick=zhongnan', v8[1] && v8[1].pick === 'zhongnan', '');

/* ---------- 5. 切到中南海：数值链整体换档 ---------- */
const changed = sandbox.window.setPick('zhongnan');
ok('setPick(zhongnan) 返回 true', changed === true, '');
ok('getPick() = zhongnan', sandbox.window.getPick() === 'zhongnan', '');

const s23_1 = byId('s23').html;
ok('换烟后 23 危害 48', has(s23_1, '>48<') || has(s23_1, '48</'), '');
ok('换烟后 23 焦油 43mg', /43<small>mg<\/small>/.test(s23_1) || has(s23_1,'>43<'), '');
ok('换烟后 23 成本 ¥27.9', has(s23_1, '¥27.9'), '');
ok('换烟后 23 负担 43', has(s23_1, '43'), '');
/* 用带上下文的精确串，避免撞上 SVG 肺图坐标（如 cy="146"）*/
ok('换烟后 23 焦油不再是 46mg', !/46<small>mg<\/small>/.test(s23_1), '');
ok('换烟后 23 不再是 ¥29.9', !has(s23_1, '¥29.9'), '');

const s08_1 = byId('s08').html;
ok('换烟后 08 承诺行 42 → 48', has(s08_1, '当日危害 42 → 48'), '');
ok('换烟后 08 承诺 焦油 +5mg', has(s08_1, '焦油 +5mg'), '');
ok('换烟后 08 承诺 健康折算 +¥2.15', has(s08_1, '健康折算 +¥2.15'), '');
ok('换烟后 08 勾在 zhongnan 行', /data-pick="zhongnan"[^>]*border:1\.5px/.test(s08_1), '');
ok('换烟后 08 yunyan 行转 1px', /data-pick="yunyan"[^>]*border:1px/.test(s08_1), '');

/* ---------- 6. 02 的 ②③ 态与 22 同步 ---------- */
const v2 = V['s02'] || [];
const st2 = v2.find(v=>v.name === '② 取出后');
const st3 = v2.find(v=>v.name === '③ 忍住');
ok('02 ② 态跟着换档（¥27.9）', st2 && has(st2.html, '¥27.9'), '');
ok('22 忍住文案用 5mg', has(byId('s22').html, '焦油 5mg'), '');
ok('22 忍住省下 ¥1.00', has(byId('s22').html, '¥1.00'), '');

/* ---------- 7. 切回云烟，能复原 ---------- */
sandbox.window.setPick('yunyan');
ok('切回后 23 恢复 ¥29.9', has(byId('s23').html, '¥29.9'), '');
ok('切回后 22 恢复 8mg', has(byId('s22').html, '焦油 8mg'), '');
ok('setPick 同值返回 false', sandbox.window.setPick('yunyan') === false, '');

/* ---------- 8. A1 口径核对（独立复算）---------- */
function harm(n,T){ return Math.round(100*(1-Math.pow(0.5,n/5.2)) + Math.max(-5,Math.min(10,(T-9*n)*0.5))); }
ok('A1: n=4,T=38 → 42', harm(4,38) === 42, '算出 '+harm(4,38));
ok('A1: n=5,T=46 → 49', harm(5,46) === 49, '算出 '+harm(5,46));
ok('A1: n=5,T=43 → 48', harm(5,43) === 48, '算出 '+harm(5,43));
const b46 = Math.round((0.88*42.3+0.12*49)*10)/10;
const b43 = Math.round((0.88*42.3+0.12*48)*10)/10;
ok('EMA: 8mg → 43.1', b46 === 43.1, '算出 '+b46);
ok('EMA: 5mg → 43.0', b43 === 43.0, '算出 '+b43);
ok('成本 8mg = 8.4+1.75+0.43*46 = 29.93', Math.abs((8.4+1.75+0.43*46)-29.93) < 1e-9, '');
ok('成本 5mg = 8.4+1.00+0.43*43 = 27.89', Math.abs((8.4+1.00+0.43*43)-27.89) < 1e-9, '');

/* ---------- 输出 ---------- */
let pass = 0, fail = 0;
R.forEach(r=>{ if(r.pass) pass++; else { fail++; console.log('FAIL  '+r.name+(r.detail?'  ['+r.detail+']':'')); } });
console.log('--------');
console.log('通过 '+pass+' / '+(pass+fail)+(fail?('  失败 '+fail):'   全部通过'));
process.exit(fail ? 1 : 0);
