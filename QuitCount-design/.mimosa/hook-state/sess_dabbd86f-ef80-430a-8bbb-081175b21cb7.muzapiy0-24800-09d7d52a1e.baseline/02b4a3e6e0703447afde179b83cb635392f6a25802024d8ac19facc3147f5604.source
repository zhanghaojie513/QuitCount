# -*- coding: utf-8 -*-
"""生成「浏览器真点击」探针页，验证 08 弹层选烟 → 落点 23 的跨屏联动。

为什么需要它：verify-pick-linkage.js 是在 Node 里桩化 window 跑的，
它证明了 screens.js 的数据链正确，但**测不到 app.js 里 [data-pick] 的绑定**。
本探针在真实浏览器里 .click() 一条龙走完，是「绑定真的接上了」的唯一证据。

用法：
  python qa/make-browser-probe.py
  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new \
      --disable-gpu --no-sandbox --virtual-time-budget=6000 --dump-dom \
      "file:///C:/.../design/prototype-visual/_probe.html" 2>/dev/null \
    | grep -o "RESULT::[^<]*" | sed 's/RESULT:://' | tr '|' '\\n'
  （注意：必须 grep+sed 之后再 tr，直接 tr 会把断言名切碎）
"""
import io, os

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)

def rd(p):
    with io.open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()

css = rd('style.css'); scr = rd('screens.js'); app = rd('app.js')

probe = r"""
<script>
window.__R = [];
function rec(k, v){ window.__R.push('RESULT::' + k + '==' + v); }
function text(sel){ var n=document.querySelector(sel); return n ? (n.textContent||'').replace(/\s+/g,'').trim() : '(null)'; }
window.addEventListener('load', function(){
  try{
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

    var go23 = null;
    var all = s08.querySelectorAll('[data-goto]');
    for(var i=0;i<all.length;i++){ if(all[i].dataset.goto==='s23'){ go23 = all[i]; break; } }
    rec('找到仍要取出', String(!!go23));
    if(go23){ go23.click(); }

    var p = document.getElementById('phone');
    rec('23.screen', p.dataset.screen);
    var mv = [];
    p.querySelectorAll('.metric .m-v').forEach(function(n){ mv.push((n.textContent||'').replace(/\s+/g,'').trim()); });
    rec('23.三指标', mv.join('/'));
    rec('23.hero负担', text('#phone .hero-num'));
    rec('23.cap', text('#phone .cap'));
    rec('23.横幅', text('#phone .banner').substring(0,40));
    rec('23.含27.9', String(p.innerHTML.indexOf('27.9')>=0));
    rec('23.含29.9', String(p.innerHTML.indexOf('29.9')>=0));
  }catch(e){ rec('EXCEPTION', e && e.message ? e.message : String(e)); }
  var d = document.createElement('div');
  d.id = 'PROBE_OUT';
  d.textContent = window.__R.join('|');
  document.body.appendChild(d);
});
</script>
"""

html = ("<!DOCTYPE html><html lang=\"zh-CN\" class=\"static\"><head><meta charset=\"utf-8\">"
        "<title>probe</title><style>" + css + "</style></head><body>"
        "<header class=\"topbar\"><div class=\"tb-left\"><span class=\"tb-mark\"></span><div>"
        "<h1>戒烟有数</h1><p id=\"tbSub\">probe</p></div></div>"
        "<div class=\"tb-right\"><div class=\"seg\" id=\"scaleSeg\">"
        "<button data-scale=\"0.8\">80%</button><button data-scale=\"1\" class=\"on\">100%</button>"
        "<button data-scale=\"1.2\">120%</button></div></div></header>"
        "<main class=\"stage\"><nav class=\"flowbar\" id=\"flowbar\"></nav>"
        "<section class=\"viewport\"><div class=\"device\"><div class=\"phone\" id=\"phone\"></div>"
        "<div class=\"home-indicator\"></div></div><div class=\"under\" id=\"under\"></div>"
        "</section></main>"
        "<script>" + scr + "</script><script>" + app + "</script>" + probe +
        "</body></html>")

out = os.path.join(ROOT, '_probe.html')
with io.open(out, 'w', encoding='utf-8') as f: f.write(html)
print('written', out, len(html), 'bytes')
