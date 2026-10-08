# -*- coding: utf-8 -*-
"""生成「切图导出」页面。

与原型模拟器（index.html）的区别：
  ① 只渲染 .phone 本体，隐藏 topbar / flowbar / under / 缩放条
  ② 去掉 .phone 的模拟器外壳（11px 深绿环 + 投影）—— 那是模拟器语汇，不属于设计稿
  ③ 支持 ?s=<屏id> 直达某屏、?pick=<烟id> 预置 08 的选中烟、?vi=<n> 预置状态下标

用法（由 export-screens.py 调用，一般不用手工跑）：
  python qa/make-export-page.py
产物：design/prototype-visual/_export.html
"""
import io, os

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)

def rd(p):
    with io.open(os.path.join(ROOT, p), encoding='utf-8') as f:
        return f.read()

css = rd('style.css'); scr = rd('screens.js'); app = rd('app.js')

# 切图专用样式：抹掉一切「模拟器」语汇，只留 393×852 的屏本体
export_css = """
html,body{margin:0;padding:0;background:#FFFFFF;}
.topbar,.flowbar,.under{display:none !important;}
.stage{display:block !important;height:auto !important;}
.viewport{display:block !important;padding:0 !important;overflow:visible !important;}
.device{transform:none !important;}
/* 去外壳：模拟器的 11px 深绿环 + 投影不属于设计稿 */
.phone{border-radius:0 !important;box-shadow:none !important;}
/* 屏内状态栏与 Home Indicator 是设计稿的一部分，保留 */
"""

ctx = r"""
<script>
(function(){
  var q = new URLSearchParams(location.search);
  window.addEventListener('load', function(){
    var pick = q.get('pick');
    if(pick && window.setPick) window.setPick(pick);
    var s = q.get('s');
    if(s) window.goTo(s);
    var vi = q.get('vi');
    if(vi !== null && vi !== ''){
      var bs = document.querySelectorAll('.us-btn');
      if(bs[+vi]) bs[+vi].click();
    }
    document.documentElement.setAttribute('data-export-ready','1');
  });
})();
</script>
"""

html = ("<!DOCTYPE html><html lang=\"zh-CN\" class=\"static\"><head><meta charset=\"utf-8\">"
        "<title>export</title><style>" + css + export_css + "</style></head><body>"
        "<header class=\"topbar\"><div class=\"tb-left\"><span class=\"tb-mark\"></span><div>"
        "<h1>戒烟有数</h1><p id=\"tbSub\">export</p></div></div>"
        "<div class=\"tb-right\"><div class=\"seg\" id=\"scaleSeg\">"
        "<button data-scale=\"0.8\">80%</button><button data-scale=\"1\" class=\"on\">100%</button>"
        "<button data-scale=\"1.2\">120%</button></div></div></header>"
        "<main class=\"stage\"><nav class=\"flowbar\" id=\"flowbar\"></nav>"
        "<section class=\"viewport\"><div class=\"device\"><div class=\"phone\" id=\"phone\"></div>"
        "<div class=\"home-indicator\"></div></div><div class=\"under\" id=\"under\"></div>"
        "</section></main>"
        "<script>" + scr + "</script><script>" + app + "</script>" + ctx +
        "</body></html>")

out = os.path.join(ROOT, '_export.html')
with io.open(out, 'w', encoding='utf-8') as f: f.write(html)
print('written', out, len(html), 'bytes')
