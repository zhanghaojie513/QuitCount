/* 全量回归：27 屏渲染 + 01 五态 + 08/23 联动（Node 桩化，无浏览器）*/
const fs = require('fs'), vm = require('vm');
const sb = { window:{}, console }; vm.createContext(sb);
vm.runInContext(fs.readFileSync(require('path').join(__dirname,'..','screens.js'),'utf8'), sb);

const S = vm.runInContext('SCREENS', sb);
const V = vm.runInContext('VARIANTS', sb);
const R = []; const ok=(n,c,d)=>R.push({n,p:!!c,d:d||''});
const byId = id => S.find(s=>s.id===id);

/* ---------- A. 屏集合完整性 ---------- */
ok('屏总数 27', S.length===27, '实际 '+S.length);
const ids = S.map(s=>s.id);
ok('屏 id 无重复', new Set(ids).size===ids.length, '');
const expect = ['s01','s02','s03','s04','s05','s06','s07','s08','s09','s10','s11','s12','s13','s14','s15','s16','s17','s18','s19','s20','s21','s22','s23','s24','s25','s26','s27'];
expect.forEach(id=>ok('存在 '+id, ids.indexOf(id)>=0, ''));
ok('无多余屏', ids.length===expect.length, '多了 '+(ids.length-expect.length));
ok('编号连续无 01b', S.every(s=>!/^01b$/.test(s.no)), '');

/* ---------- B. 每屏 html 非空且是闭合的 screen 容器 ---------- */
S.forEach(s=>{
  ok(s.id+' html 非空', typeof s.html==='string' && s.html.length>200, 'len='+(s.html||'').length);
  const open=(s.html.match(/class="screen"/g)||[]).length;
  ok(s.id+' 恰一个 .screen 容器', open===1, '找到 '+open);
  const dOpen=(s.html.match(/<div/g)||[]).length, dClose=(s.html.match(/<\/div>/g)||[]).length;
  ok(s.id+' div 配平', dOpen===dClose, dOpen+' vs '+dClose);
});

/* ---------- C. 01 五态 ---------- */
const v1 = V['s01'] || [];
ok('01 五态', v1.length===5, '实际 '+v1.length);
ok('01 态① 空号', v1[0] && /空号/.test(v1[0].name), '');
ok('01 态① 按钮真 disabled', v1[0] && /<button class="btn primary" disabled/.test(v1[0].html), '');
ok('01 态② 已填', v1[1] && /已填/.test(v1[1].name), '');
ok('01 态② 按钮带 data-step=3', v1[1] && /data-step="3"/.test(v1[1].html), '');
ok('01 态② 显号码', v1[1] && /138/.test(v1[1].html), '');
ok('01 态③ 验证码', v1[2] && /验证码/.test(v1[2].name), '');
ok('01 更换号码 回已填态(data-step=2)', v1[2] && /data-step="2"/.test(v1[2].html), '');
ok('01 态⑤ 错误态', v1[4] && /错误态/.test(v1[4].name), '');

/* ---------- D. 02 四态 ---------- */
const v2 = V['s02'] || [];
ok('02 四态', v2.length===4, '实际 '+v2.length);
ok('02 ② 取出后', v2[1] && v2[1].name==='② 取出后', '');
ok('02 ③ 忍住', v2[2] && v2[2].name==='③ 忍住', '');
ok('02 ④ 今日0支', v2[3] && /今日 0 支/.test(v2[3].name), '');
ok('02 ② HTML 变量', v2[1] && byId('s23').html===v2[1].html, '应与 23 同源');

/* ---------- E. 22/23/24 与 02 同源 ---------- */
ok('23 == 02②', byId('s23').html===v2[1].html, '');
ok('22 == 02③', byId('s22').html===v2[2].html, '');
ok('24 == 02④', byId('s24').html===v2[3].html, '');

/* ---------- F. 25 三态 ---------- */
const v25 = V['s25'] || [];
ok('25 三态', v25.length===3, '实际 '+v25.length);

/* ---------- G. 联动（默认 8mg）---------- */
const h23a = byId('s23').html;
ok('默认 23 焦油 46mg', /46<small>mg<\/small>/.test(h23a), '');
ok('默认 23 成本 ¥29.9', /¥29\.9/.test(h23a), '');
ok('默认 23 危害 49', /49</.test(h23a), '');
ok('默认 08 承诺 42→49', /当日危害 42 → 49/.test(byId('s08').html), '');
ok('默认 08 两行可选', (byId('s08').html.match(/data-pick=/g)||[]).length===2, '');

/* ---------- H. 联动（切 5mg）---------- */
ok('setPick(zhongnan)=true', sb.window.setPick('zhongnan')===true, '');
const h23b = byId('s23').html;
ok('换后 23 焦油 43mg', /43<small>mg<\/small>/.test(h23b), '');
ok('换后 23 成本 ¥27.9', /¥27\.9/.test(h23b), '');
ok('换后 23 危害 48', /48</.test(h23b), '');
ok('换后 23 无 ¥29.9', !/¥29\.9/.test(h23b), '');
ok('换后 23 无 46mg', !/46<small>mg<\/small>/.test(h23b), '');
ok('换后 08 承诺 42→48', /当日危害 42 → 48/.test(byId('s08').html), '');
ok('换后 08 焦油 +5mg', /焦油 \+5mg/.test(byId('s08').html), '');
ok('换后 22 用 5mg', /焦油 5mg/.test(byId('s22').html), '');
ok('换后 22 省 ¥1.00', /¥1\.00/.test(byId('s22').html), '');
ok('换后 02② 同源 23', byId('s23').html===V['s02'][1].html, '');

/* ---------- I. 复原 ---------- */
sb.window.setPick('yunyan');
ok('复原 23 ¥29.9', /¥29\.9/.test(byId('s23').html), '');
ok('复原 22 8mg', /焦油 8mg/.test(byId('s22').html), '');
ok('同值 setPick 返回 false', sb.window.setPick('yunyan')===false, '');

/* ---------- J. 限定词 ---------- */
ok('08 单品库存带"本品牌"', /本品牌库存 12 支/.test(byId('s08').html), '');
ok('08 无裸"库存 12 支"', !/[^牌]库存 12 支/.test(byId('s08').html.replace(/本品牌库存 12 支/g,'X')), '');

/* ---------- K. 交互补线（2026-10-08 优化轮）----------
   本组锁住四类改动：遮罩可点关闭、死控件补线、微交互挂钩、状态条/深链数据源。
   浏览器侧（事件真的绑上）由 qa/browser-probe.mjs 覆盖 —— 与 README 的
   「Node 桩化 + 浏览器真点击」两层分工一致。 */
/* K1 · 遮罩可点关闭：每个 .scrim 必须带 data-close，且目标都是真实存在的屏 */
S.forEach(s=>{
  const nScrim = (s.html.match(/class="scrim/g)||[]).length;
  const closes = (s.html.match(/data-close="(s\d{2})"/g)||[]);
  ok(s.id+' 遮罩数=data-close 数', nScrim === closes.length, nScrim+' vs '+closes.length);
  closes.forEach(m=>{
    const t = (m.match(/s\d{2}/)||[''])[0];
    ok(s.id+' 关闭目标 '+t+' 存在', ids.indexOf(t)>=0, '');
  });
});
/* K2 · 死控件补线 */
ok('17 我知道了 → s02', /onclick="goTo\('s02'\)">我知道了<\/button>/.test(byId('s17').html), '');
ok('18 放回库存 → s22', /class="btn-compact" onclick="goTo\('s22'\)"/.test(byId('s18').html), '');
ok('18 进度按钮 → s09', /class="btn-progress" onclick="goTo\('s09'\)"/.test(byId('s18').html), '');
ok('05 查看全部 → s21', /data-goto="s21"[^>]*>查看全部 4 条</.test(byId('s05').html), '');
ok('19 重试 → s07', /data-goto="s07"[^>]*>重试</.test(byId('s19').html), '');
/* K3 · 微交互挂钩（初始渲染不变，只多挂 data-* 钩子） */
ok('09 步进器 −/+', /data-s9dir="-1"/.test(byId('s09').html) && /data-s9dir="1"/.test(byId('s09').html), '');
ok('09 数值与刻度挂钩', /data-s9val/.test(byId('s09').html) && /data-s9dots/.test(byId('s09').html), '');
ok('09 三个预设胶囊', (byId('s09').html.match(/data-s9preset="/g)||[]).length===3, '');
ok('12 三个时段胶囊', (byId('s12').html.match(/data-t12="/g)||[]).length===3, '');
ok('27 库存步进 −/＋', /data-s27dir="-1"/.test(byId('s27').html) && /data-s27dir="1"/.test(byId('s27').html), '');
ok('27 库存数值挂钩', /data-s27val/.test(byId('s27').html), '');
/* K4 · 微交互不得改变初始渲染口径：数值仍为 5 / 21:30 高亮第 2 档 / 库存 12 */
ok('09 初始仍 5 支', /data-s9val[^>]*>5</.test(byId('s09').html), '');
ok('12 初始仍 21:30', /data-t12="21:30" class="preset-chip num on"|class="preset-chip num on" data-t12="21:30"/.test(byId('s12').html), '');
ok('27 初始仍 12 支', /data-s27val[^>]*>12</.test(byId('s27').html), '');

let pass=0, fail=0;
R.forEach(r=>{ if(r.p) pass++; else { fail++; console.log('FAIL  '+r.n+(r.d?'  ['+r.d+']':'')); } });
console.log('--------');
console.log('全量回归：通过 '+pass+' / '+(pass+fail)+(fail?('  失败 '+fail):'   全部通过'));
process.exit(fail?1:0);
