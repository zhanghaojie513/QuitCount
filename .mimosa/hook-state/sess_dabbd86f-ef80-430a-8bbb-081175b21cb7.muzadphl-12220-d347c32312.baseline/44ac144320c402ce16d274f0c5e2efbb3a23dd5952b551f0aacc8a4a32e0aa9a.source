/* ============================================================
   戒烟有数 · 原型模拟器
   单屏真机模拟：393×852 设备框内真实点击导航，按设计稿 1:1 还原

   交互分层（2026-10-08）：
     ① 导航：屏内 onclick / [data-goto]（screens.js 唯一来源）+ PATCH 兜底
     ② 关闭：弹层遮罩 [data-close] 点击 = 关弹层回母屏
     ③ 微交互：09 步进器 / 12 时段胶囊 / 27 库存步进 / 开关可拨 —— 仅演示，
        不写回任何数据口径（口径仍以 design-spec.md §4 为准）
     ④ 动效：翻屏 push/back/fade + 弹层上滑 + 遮罩淡入，全部 .live 门控 ——
        _export.html / _probe.html（切图导出与探针）不挂 .live，零动画，
        保证切图像素与动效前完全一致
     ⑤ 深链：#sNN 双向同步（切屏即更新 URL，可复制分享）；#sNN/v 直达某状态
   ============================================================ */
(function(){

  const PHONE_W = 393, PHONE_H = 852;

  /* 动效只在交互模拟器里生效。export / probe 页的 document.title 是固定字面量
     （见 qa/make-export-page.py / qa/make-browser-probe.py 的模板），
     另给两个生成器加了 <html class="static"> 双保险。 */
  const LIVE = !/\b(export|probe)\b/.test(document.title) &&
               !document.documentElement.classList.contains('static');
  if(LIVE) document.documentElement.classList.add('live');

  /* 流程条：按真实使用路径分组，不是平铺索引 */
  const FLOWS = [
    { name:'入口',   ids:['s01','s02','s22','s23','s24','s03','s17','s15'] },
    { name:'资产',   ids:['s04','s11','s27'] },
    { name:'账本',   ids:['s05','s12'] },
    { name:'我的',   ids:['s06','s07','s08','s09','s10','s13','s14','s16','s18','s19','s20','s21','s25','s26'] }
  ];
  /* 上一条 / 下一条的线性顺序 = 分组拼接顺序 */
  const ORDER = FLOWS.reduce((a,f)=>a.concat(f.ids), []);
  const byId  = id => SCREENS.find(s=>s.id===id) || null;

  /* ------------------------------------------------------------
     兜底补丁
     screens.js 已为 47 个元素写好内联 onclick，剩下的缺口在这里按
     「屏 id → [{text, go}]」补。text 用可见文案，只在目标屏生效。
     当前分两类：
       ① Tab Bar 统一补齐（除首页本身，活动项不跳）
       ② 各屏操作区 / 动作按钮的缺口
     ------------------------------------------------------------ */
  /* Tab Bar 顺序严格对齐设计稿：首页 · 资产 · 取出 · 账本 · 我的
     「取出」是正中第 3 项（不是第 2 项）—— 它是全栏唯一的功能性动作位 */
  const TABS = [
    { text:'首页', go:'s02' }, { text:'资产', go:'s04' },
    { text:'账本', go:'s05' }, { text:'我的', go:'s06' },
    { text:'取出', go:'s08' }
  ];

  const PATCH = {
    /* 02 首页：Tab + 操作区 */
    s02: [ ...TABS, { text:'放回库存', go:'s22' } ],
    /* 03 / 17 警示：Tab + 底部安全按钮 */
    s03: [ ...TABS ],
    s17: [ ...TABS ],
    /* 04 资产 / 05 账本 / 06 我的 / 09 目标：Tab 补齐 */
    s04: [ ...TABS, { text:'清空库存', go:'s14' } ],
    s05: [ ...TABS ],
    s06: [ ...TABS ],
    s09: [ ...TABS ],
    /* 15 空状态 / 24 今日 0 支：Tab + 操作区 */
    s15: [ ...TABS, { text:'设定目标', go:'s09' }, { text:'添加库存', go:'s11' } ],
    s24: [ ...TABS, { text:'今日 0 / 5 支', go:'s09' }, { text:'设定目标', go:'s09' } ],
    /* 16 通知展开态：两颗动作按钮（N2 后只有「看今天的账本 / 明天再说」，原「先不抽」已删） */
    s16: [ { text:'看今天的账本', go:'s05' }, { text:'明天再说', go:'s02' } ],
    /* 18 通知权限兜底：无遮罩屏，Tab 真实可点（放回库存 / 进度按钮已由 data-goto 直连） */
    s18: [ ...TABS ],
    /* 22 忍住 / 23 取出成功：Tab + 操作区 */
    s22: [ ...TABS ],
    s23: [ ...TABS, { text:'放回库存', go:'s22' } ],
    /* 21 记录明细：Tab */
    s21: [ ...TABS ],
    /* 27 品牌详情：Tab */
    s27: [ ...TABS ]
  };

  /* 账本记录行 → 记录明细（每行文案不同，按行容器整段匹配） */
  const ROW_GO = {
    s05: { go:'s21', row:[/21 云烟/, /18 云烟/, /14 中南海/, /09 云烟/] }
  };

  /* ------------------------------------------------------------
     渲染
     ------------------------------------------------------------ */
  const phone   = document.getElementById('phone');
  const under   = document.getElementById('under');
  const flowbar = document.getElementById('flowbar');
  const tbSub   = document.getElementById('tbSub');

  let cur = 's02';           // 当前屏
  let curVar = 0;            // 当前状态变体下标（多态屏用）
  const hist = [];           // 返回栈
  let scale = 1;

  /* 屏 → 进入该屏时应落在的状态下标。
     02 首页是四态的（① 取出前／② 取出后／③ 忍住／④ 今日 0 支），
     22 / 23 / 24 三个反馈屏引用的是同一份 HTML，但它们各自对应其中一态。
     进屏时先按 VARIANTS 的状态名匹配，匹配不到再按这里的下标兜底。 */
  const ENTRY_VAR = { s22:'③ 忍住', s23:'② 取出后', s24:'④ 今日 0 支' };

  function entryVarFor(id){
    const vs = VARIANTS[id] || [];

    /* 变体带 pick 的屏（目前只有 08）：它的「状态」本质就是 PICKED 的值，
       不是「第几个变体」。深链直达 / 从别处跳回来时，必须按当前 PICKED
       定位下标 —— 否则 bodyOf() 会取变体[0] 把选中的烟盖回去。 */
    if(vs.some(v=>v.pick)){
      const i = vs.findIndex(v=>v.pick === window.getPick());
      return i < 0 ? 0 : i;
    }

    const want = ENTRY_VAR[id];
    if(!want) return 0;
    const i = vs.findIndex(v=>v.name === want);
    return i < 0 ? 0 : i;
  }

  /* 取当前屏的 HTML：有变体时用变体的，否则用主 html */
  function bodyOf(s, vi){
    const vs = VARIANTS[s.id];
    if(vs && vs.length){
      const v = vs[Math.min(vi, vs.length-1)] || vs[0];
      return v.html;
    }
    return s.html;
  }

  function render(id, pushHist, vi, move){
    const s = byId(id);
    if(!s){ return; }
    if(cur && cur !== id && pushHist !== false){ hist.push(cur); }
    const switched = (id !== cur);
    cur = id;
    /* 换屏时：先看该屏是否有指定的入口状态（22 / 23 / 24 各自对应首页的一态），
       没有就回主态 0。同屏内切态则沿用传入的下标。 */
    curVar = switched ? entryVarFor(id) : (vi == null ? curVar : vi);

    /* 内容：screens.js 里每屏是 <div class="screen">…</div> */
    phone.innerHTML = bodyOf(s, curVar);
    phone.dataset.screen = id;

    /* 翻屏动效（仅交互模拟器）：前进自右推入、返回自左、同屏切态淡入 */
    if(LIVE && move && move !== 'none'){
      const sc = phone.firstElementChild;
      if(sc) sc.classList.add('anim-' + move);
    }

    /* 绑定屏内导航 */
    bindNav(id);
    bindMicro(id);

    /* 顶栏副标题 + 浏览器标签页 + 深链（切屏即更新 URL，评审时可直接复制/刷新） */
    tbSub.textContent = `${s.no} ${s.name} · ${ORDER.indexOf(id)+1}/${ORDER.length}`;
    document.title = `戒烟有数原型 · ${s.no} ${s.name}`;
    syncHash();

    /* 流程条高亮 + 滚动跟随（深链直达后面的屏时左侧栏要跟得上） */
    document.querySelectorAll('.rail-group button').forEach(b=>{
      b.classList.toggle('on', b.dataset.id===id);
      if(b.dataset.id===id) b.scrollIntoView({block:'nearest'});
    });

    /* 下方说明（原 alt 注释）+ 状态切换条 + 兜底出口 */
    const vs = VARIANTS[id] || [];
    const stateBar = vs.length ? `<div class="under-states">
        <span class="us-label">状态</span>
        ${vs.map((v,i)=>`<button class="us-btn${i===curVar?' on':''}" data-vi="${i}">${v.name}</button>`).join('')}
      </div>${vs[curVar] && vs[curVar].note ? `<div class="under-note">${vs[curVar].note}</div>` : ''}` : '';

    const backDisabled = hist.length ? '' : ' disabled';
    under.innerHTML =
      stateBar +
      `<div class="under-bar">
         <button id="ubBack"${backDisabled}>← 返回上一屏</button>
         <button id="ubHome"${cur==='s02'?' disabled':''}>回首页</button>
         <button id="ubNext" class="ghost">下一屏 →</button>
       </div>` +
      (s.alt ? `<div class="under-note">${s.alt}</div>` : '');

    under.querySelectorAll('.us-btn').forEach(b=>{
      b.onclick = ()=>{
        const vi = parseInt(b.dataset.vi, 10);
        /* 变体带 pick 的（目前只有 08）—— 状态条切换必须同时同步 PICKED，
           否则「状态条切到中南海、但 23 仍按云烟记账」会重新出现。 */
        const v = vs[vi];
        if(v && v.pick) window.setPick(v.pick);
        render(cur, false, vi, 'fade');
      };
    });

    const ubBack = document.getElementById('ubBack');
    if(ubBack) ubBack.onclick = ()=>{ if(hist.length) render(hist.pop(), false, undefined, 'back'); };
    const ubHome = document.getElementById('ubHome');
    if(ubHome) ubHome.onclick = ()=>goTo('s02');
    const ubNext = document.getElementById('ubNext');
    if(ubNext) ubNext.onclick = ()=>{
      const n = ORDER.indexOf(cur)+1;
      if(n < ORDER.length) goTo(ORDER[n]);
    };

    /* 回到顶部 */
    phone.scrollTop = 0;
  }

  /* ------------------------------------------------------------
     屏内导航
     screens.js 里已经给 47 个元素写好了内联 onclick="goTo('sXX')"，
     那是唯一的导航来源 —— 不要再按文案猜目标（会猜错，且和它打架）。
     这里只做两件事：
       ① 把 [data-go] 补成真实点击（screens.js 中少数没写 onclick 的）
       ② 给内联 onclick 的元素加上 .clickable 视觉反馈
     ------------------------------------------------------------ */
  function bindNav(id){
    /* ① 兜底：PATCH 表里补的缺口 —— 按可见文案找元素 */
    (PATCH[id] || []).forEach(rule=>{
      if(rule.go === id) return;                    // 不给自己加跳转（活动项不点）
      const want = rule.text.replace(/\s+/g,'');
      phone.querySelectorAll('.btn,.btn-progress,.btn-compact,.tab,.rowitem,.pill,.link,.x,.back,.na')
        .forEach(node=>{
          if(node.dataset.bound) return;
          if((node.textContent||'').replace(/\s+/g,'').indexOf(want) < 0) return;
          node.dataset.bound = '1';
          node.classList.add('clickable');
          node.addEventListener('click', ev=>{
            ev.preventDefault();
            ev.stopPropagation();
            goTo(rule.go);
          });
        });
    });

      /* ② 视觉 + 通用跳转：带内联 onclick 或 [data-goto] 的元素表现为可点。
            [data-goto] 用于「跳转同时指定落点状态」的场景 —— 见 ④ 的先例，
            当时用 data-step 解决同屏切态，data-goto 是它的跨屏版本。 */
      phone.querySelectorAll('[onclick]').forEach(node=>{
        node.classList.add('clickable');
      });
      phone.querySelectorAll('[data-goto]').forEach(node=>{
        node.classList.add('clickable');
        node.addEventListener('click', ev=>{
          ev.preventDefault(); ev.stopPropagation();
          goTo(node.dataset.goto);
        });
      });

    /* ③ 账本记录行 → 记录明细 */
    const rowRule = ROW_GO[id];
    if(rowRule){
      phone.querySelectorAll('.rowitem').forEach(node=>{
        if(node.dataset.bound) return;
        const t = (node.textContent||'').replace(/\s+/g,'');
        if(!rowRule.row.some(re=>re.test(t))) return;
        node.dataset.bound = '1';
        node.classList.add('clickable');
        node.addEventListener('click', ev=>{
          ev.preventDefault(); ev.stopPropagation();
          goTo(rowRule.go);
        });
      });
    }

    /* ④ 屏内步骤推进（仅 01）：[data-step] 切到同一屏的另一个步骤，
          这是「状态」而不是「换屏」—— 所以不走 goTo，不压返回栈。
          原 `01b 验证码` 的独立编号已取消，两步合进这里。 */
    phone.querySelectorAll('[data-step]').forEach(node=>{
      node.classList.add('clickable');
      node.addEventListener('click', ev=>{
        ev.preventDefault(); ev.stopPropagation();
        render(cur, false, parseInt(node.dataset.step, 10) - 1, 'fade');
      });
    });

    /* ⑤ 弹层内选烟（仅 08）：[data-pick] 也是「状态」而非「换屏」，
          不压栈。选中项本身存在 screens.js 的 PICKED 里（它还会牵动
          02 的 ②③ 态与 22 / 23 的数值），所以这里只负责：切选中 →
          重算派生快照 → 重画当前屏。

          注意 curVar 必须跟着走：08 有「选中 云烟细支 / 选中 中南海低焦」
          两个变体，而 bodyOf() 在有变体时【只取变体快照】。若只改 PICKED
          不切 curVar，重画时会用旧变体把结果盖掉。故按变体的 pick 字段反查
          下标 —— 不拿中文状态名做匹配。 */
    phone.querySelectorAll('[data-pick]').forEach(node=>{
      node.classList.add('clickable');
      node.addEventListener('click', ev=>{
        ev.preventDefault(); ev.stopPropagation();
        const id = node.dataset.pick;
        if(!window.setPick(id)) return;
        const vs = VARIANTS[cur] || [];
        const i = vs.findIndex(v=>v.pick === id);
        render(cur, false, i >= 0 ? i : curVar, 'fade');
      });
    });

    /* ⑥ 弹层遮罩（全部 [data-close]）：点击遮罩 = 关闭弹层，回到母屏。
         与真实 App 的「点外面关掉」一致；弹层内容在遮罩之上（z-11 > z-10），
         误点弹层内部不会触发。 */
    phone.querySelectorAll('[data-close]').forEach(node=>{
      node.addEventListener('click', ev=>{
        ev.preventDefault(); ev.stopPropagation();
        goTo(node.dataset.close);
      });
    });
  }

  /* ------------------------------------------------------------
     ⑦ 微交互（仅演示手感，不写回数据口径）
       · 09 调整戒烟目标：− / + 步进（1–20），20 格刻度与预设胶囊联动
       · 12 每日复盘提醒：三个时段胶囊单选
       · 27 编辑资产：剩余库存 − / ＋（0 起）
       · 开关 .sw：可拨（弹层/设置页通用），不触发所在行的跳转
     初始渲染与改动前逐字节一致（切图导出不受影响）。
     ------------------------------------------------------------ */
  function bindMicro(id){
    if(id === 's09'){
      let n = 5;
      const val   = phone.querySelector('[data-s9val]');
      const dots  = phone.querySelectorAll('[data-s9dots] i');
      const chips = phone.querySelectorAll('[data-s9preset]');
      const sync = ()=>{
        if(val) val.textContent = n;
        dots.forEach((d,i)=>d.classList.toggle('on', i < n));
        chips.forEach(c=>c.classList.toggle('on', parseInt(c.dataset.s9preset,10) === n));
      };
      phone.querySelectorAll('[data-s9dir]').forEach(b=>{
        b.classList.add('clickable');
        b.addEventListener('click', ev=>{
          ev.preventDefault(); ev.stopPropagation();
          n = Math.min(20, Math.max(1, n + parseInt(b.dataset.s9dir,10)));
          sync();
        });
      });
      chips.forEach(c=>{
        c.classList.add('clickable');
        c.addEventListener('click', ev=>{
          ev.preventDefault(); ev.stopPropagation();
          n = parseInt(c.dataset.s9preset,10) || n;
          sync();
        });
      });
    }
    if(id === 's12'){
      const chips = phone.querySelectorAll('[data-t12]');
      chips.forEach(c=>{
        c.classList.add('clickable');
        c.addEventListener('click', ev=>{
          ev.preventDefault(); ev.stopPropagation();
          chips.forEach(x=>x.classList.toggle('on', x === c));
        });
      });
    }
    if(id === 's27'){
      let n = 12;
      const val = phone.querySelector('[data-s27val]');
      phone.querySelectorAll('[data-s27dir]').forEach(b=>{
        b.classList.add('clickable');
        b.addEventListener('click', ev=>{
          ev.preventDefault(); ev.stopPropagation();
          n = Math.max(0, n + parseInt(b.dataset.s27dir,10));
          if(val) val.textContent = n;
        });
      });
    }
    /* 开关：点一下拨动；stopPropagation 避免触发所在行的跳转（如 07 → 12） */
    phone.querySelectorAll('.sw').forEach(node=>{
      if(node.dataset.boundSw) return;
      node.dataset.boundSw = '1';
      node.addEventListener('click', ev=>{
        ev.preventDefault(); ev.stopPropagation();
        node.classList.toggle('on');
      });
    });
  }

  function goTo(id, pushHist){
    render(id, pushHist, undefined, 'push');
  }
  window.goTo = goTo;

  /* 深链双向同步：#s08 或 #s08/1（屏 id / 状态下标）。
     用 replaceState 不制造历史条目（浏览器后退仍归 Esc / 返回按钮管）。 */
  function syncHash(){
    const vs = VARIANTS[cur] || [];
    const h = '#' + cur + (vs.length > 1 ? '/' + curVar : '');
    try{ history.replaceState(null, '', h); }catch(e){ /* file:// 个别环境拒改，忽略 */ }
  }

  /* ------------------------------------------------------------
     流程条（左侧栏）
     ------------------------------------------------------------ */
  FLOWS.forEach(flow=>{
    const g = document.createElement('div');
    g.className = 'rail-group';
    g.innerHTML = `<div class="rail-title">${flow.name}</div>`;

    flow.ids.forEach(id=>{
      const s = byId(id);
      if(!s) return;
      const b = document.createElement('button');
      b.dataset.id = id;
      b.innerHTML = `<i>${s.no}</i><span>${s.name}</span>` +
        (s.isNew ? `<em class="n">新</em>` : '');
      b.onclick = ()=>goTo(id);
      g.appendChild(b);
    });
    flowbar.appendChild(g);
  });

  /* ------------------------------------------------------------
     缩放
     ------------------------------------------------------------ */
  document.querySelectorAll('#scaleSeg button').forEach(b=>{
    b.onclick = ()=>{
      document.querySelectorAll('#scaleSeg button').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      scale = parseFloat(b.dataset.scale);
      applyScale();
    };
  });

  function applyScale(){
    const dev = document.querySelector('.device');
    dev.style.transform = scale===1 ? '' : `scale(${scale})`;
    /* 缩放后用 margin 补回占位高度，避免与下方说明重叠 */
    const dh = PHONE_H + 20;
    under.style.paddingTop = scale===1 ? '' : `${Math.round(dh*(scale-1))}px`;
  }

  /* ------------------------------------------------------------
     键盘：← → 翻屏，Esc 返回，Backspace 也当返回
     多态屏：↑ ↓ 切换状态（没有变体时不响应）
     ------------------------------------------------------------ */
  document.addEventListener('keydown', e=>{
    const vs = VARIANTS[cur] || [];
    if(vs.length > 1 && (e.key === 'ArrowDown' || e.key === 'ArrowUp')){
      e.preventDefault();
      const n = e.key === 'ArrowDown' ? curVar+1 : curVar-1;
      if(n >= 0 && n < vs.length) render(cur, false, n, 'fade');
      return;
    }
    if(e.key === 'ArrowRight' || e.key === 'ArrowLeft'){
      const i = ORDER.indexOf(cur);
      const n = e.key === 'ArrowRight' ? i+1 : i-1;
      if(n >= 0 && n < ORDER.length) goTo(ORDER[n]);
    }
    if(e.key === 'Escape' || e.key === 'Backspace'){
      e.preventDefault();
      if(hist.length){ render(hist.pop(), false, undefined, 'back'); }
      else if(cur !== 's02'){ goTo('s02'); }
    }
  });

  /* 启动：支持 #s07 深链直达某一屏、#s08/1 直达某屏某状态，方便逐屏评审与截图。
     带状态的深链若挂在 pick 屏（08），按该变体的 pick 字段同步选中烟 ——
     与状态条点击走同一条路（见 us-btn 的注释）。 */
  const bootM = (location.hash || '').match(/^#(s\d{2})(?:\/(\d+))?$/);
  const bootId = bootM && ORDER.indexOf(bootM[1]) >= 0 ? bootM[1] : 's02';
  render(bootId, undefined, undefined, 'none');
  if(bootM && bootM[2] != null){
    const vs = VARIANTS[bootId] || [];
    const vi = Math.min(parseInt(bootM[2], 10), vs.length - 1);
    if(vi >= 0){
      const v = vs[vi];
      if(v && v.pick) window.setPick(v.pick);
      render(bootId, false, vi, 'none');
    }
  }
})();
