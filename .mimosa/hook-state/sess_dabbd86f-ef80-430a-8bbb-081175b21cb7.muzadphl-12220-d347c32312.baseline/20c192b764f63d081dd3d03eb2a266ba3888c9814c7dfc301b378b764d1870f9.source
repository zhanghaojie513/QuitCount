# -*- coding: utf-8 -*-
"""批量导出 27 屏切图（多态屏额外出各状态），共 37 张。

产物：design/screens/NN-屏名.png（@2x，786×1704）

命名沿用旧 screens-v1 惯例 `NN-屏名.png`；多态屏加状态后缀，
后缀取自 VARIANTS 的状态名（去掉「① ②」这类序号前缀，保留语义）。

依赖：先跑 qa/make-export-page.py 生成 _export.html
"""
import io, os, re, struct, subprocess, sys

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)              # design/prototype-visual
DESIGN = os.path.dirname(ROOT)            # design
OUT = os.path.join(DESIGN, 'screens')     # design/screens

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
NODE = r'C:/Users/haiha/.workbuddy/binaries/node/versions/22.22.2-5/node.exe'
EXPORT_HTML = os.path.join(ROOT, '_export.html')
TMP = os.path.join(os.environ.get('TEMP', '/tmp'), 'quitcount-screens')

# ---------- 1. 从 screens.js 读出屏清单与状态 ----------
probe = r'''
const fs=require('fs'),vm=require('vm');
const sb={window:{},console};vm.createContext(sb);
vm.runInContext(fs.readFileSync(process.argv[2],'utf8'),sb);
const S=vm.runInContext('SCREENS',sb);
const V=vm.runInContext('VARIANTS',sb);
const out=S.map(s=>({
  id:s.id, no:s.no, name:s.name,
  variants:(V[s.id]||[]).map(v=>({name:v.name, pick:v.pick||null}))
}));
console.log('JSON::'+JSON.stringify(out));
'''
probe_path = os.path.join(TMP, '_list.js')
os.makedirs(TMP, exist_ok=True)
with io.open(probe_path, 'w', encoding='utf-8') as f:
    f.write(probe)

r = subprocess.run([NODE, probe_path, os.path.join(ROOT, 'screens.js')],
                   capture_output=True, text=True, encoding='utf-8')
line = [l for l in r.stdout.splitlines() if l.startswith('JSON::')]
if not line:
    print('读取屏清单失败:', r.stdout, r.stderr); sys.exit(1)
import json
screens = json.loads(line[0][6:])

# ---------- 2. 文件名净化 ----------
def safe(s):
    s = re.sub(r'^[①②③④⑤⑥]\s*', '', s)      # 去掉序号前缀
    s = s.replace('/', '-').replace('\\', '-')
    s = re.sub(r'[<>:"|?*\s]+', '', s)
    return s

# 弹层类屏（含遮罩）在切图里不用去圆角以外的处理；这里只做命名

# ---------- 3. 逐屏导出 ----------
os.makedirs(OUT, exist_ok=True)
jobs = []
for s in screens:
    if s['variants']:
        for i, v in enumerate(s['variants']):
            suffix = safe(v['name'])
            jobs.append((s, f"{s['no']}-{safe(s['name'])}-{suffix}.png",
                         {'s': s['id'], 'vi': str(i), 'pick': v.get('pick') or ''}))
    else:
        jobs.append((s, f"{s['no']}-{safe(s['name'])}.png", {'s': s['id']}))

print(f'共 {len(jobs)} 张待导出 → {OUT}')
ok = 0
for s, fname, params in jobs:
    qs = '&'.join(f'{k}={v}' for k, v in params.items() if v != '')
    url = 'file:///' + EXPORT_HTML.replace('\\', '/') + '?' + qs
    dst = os.path.join(OUT, fname)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--force-device-scale-factor=2',
                    '--window-size=393,852', '--virtual-time-budget=4000',
                    f'--screenshot={dst}', url],
                   capture_output=True)
    if os.path.exists(dst) and os.path.getsize(dst) > 5000:
        d = open(dst, 'rb').read()
        w, h = struct.unpack('>II', d[16:24])
        ok += 1
        print(f'  [OK] {fname}  {w}x{h}  {os.path.getsize(dst)//1024}KB')
    else:
        print(f'  [!!] {fname}  导出失败')

print(f'\n完成 {ok}/{len(jobs)}')
