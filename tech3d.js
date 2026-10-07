/* =====================================================================
   Seção de tecnologias — cards 3D
   - Lê as tecnologias de js/data.js (window.PORTFOLIO.technologies)
   - Lê os ícones de js/icons.js (window.TECH_ICONS) ou de um arquivo
   - Interação por Pointer Events (mouse, toque e caneta)
   - Movimento com física de mola (inércia e amortecimento), sem
     "mouseX = rotateY" direto
   - UM único requestAnimationFrame, que só roda enquanto algum card
     está se movendo; parado = zero custo
   - Só anima transform e opacity (compositor/GPU)
   Este arquivo precisa ser carregado ANTES de js/script.js.
   ===================================================================== */
(function () {
  'use strict';

  var data = window.PORTFOLIO;
  var icons = window.TECH_ICONS || {};
  var rootEl = document.getElementById('skills-root');
  if (!data || !rootEl || !Array.isArray(data.technologies) || rootEl.getAttribute('data-tech3d')) return;
  rootEl.setAttribute('data-tech3d', 'ready');

  /* ---------- Ajustes de sensação (pode mexer com calma) ---------- */
  var TUNING = {
    mouse: { tilt: 13, parallax: 6 },   // graus de inclinação · pixels de parallax do ícone
    touch: { tilt: 8,  parallax: 4 }    // no celular o efeito é mais discreto
  };
  // Profundidade (translateZ, em px) de cada camada em repouso
  var Z = { icon: 56, plate: 28, shadowOnPlate: 29, text: 22, floor: -40 };

  var motionMq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduced = !!(motionMq && motionMq.matches);

  /* ---------- Construção do HTML ---------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function initials(name) { return String(name || '?').slice(0, 2); }

  // Ícone: chave de js/icons.js (SVG inline) ou caminho de arquivo (<img>)
  function buildIcon(tech) {
    var wrap = el('span', 'tc-icon');
    wrap.setAttribute('aria-hidden', 'true');
    var key = String(tech.icon || '');

    if (icons[key]) {
      // SVG vindo do nosso próprio js/icons.js (conteúdo confiável, não é entrada de usuário)
      wrap.insertAdjacentHTML('beforeend', icons[key]);
    } else if (/[\/.]/.test(key)) {
      var img = el('img');
      img.src = key;
      img.alt = '';
      img.decoding = 'async';
      img.loading = 'lazy';
      img.draggable = false;
      img.addEventListener('error', function () {
        img.replaceWith(el('span', 'tc-icon-fallback', initials(tech.name)));
      });
      wrap.append(img);
    } else {
      wrap.append(el('span', 'tc-icon-fallback', initials(tech.name)));
    }
    return wrap;
  }

  var grid = el('ul', 'tech-grid');
  grid.setAttribute('role', 'list');
  var states = [];

  data.technologies.forEach(function (tech, i) {
    var nameId = 'tech-name-' + i;
    var descId = 'tech-desc-' + i;

    var item = el('li', 'tech-item reveal');
    item.style.setProperty('--d', ((i % 4) * 70) + 'ms');

    var card = el('div', 'tech-card');
    card.tabIndex = 0;
    card.setAttribute('role', 'group');
    card.setAttribute('aria-labelledby', nameId);
    if (tech.description) card.setAttribute('aria-describedby', descId);

    var shadow = el('span', 'tc-shadow');
    var slab2 = el('span', 'tc-slab tc-slab-2');
    var slab1 = el('span', 'tc-slab tc-slab-1');
    var face = el('span', 'tc-face');
    var glare = el('span', 'tc-glare');
    face.append(glare);
    var plate = el('span', 'tc-plate');
    var iconShadow = el('span', 'tc-icon-shadow');
    var icon = buildIcon(tech);

    var text = el('div', 'tc-text');
    var name = el('h3', 'tc-name', tech.name);
    name.id = nameId;
    text.append(name);
    if (tech.description) {
      var desc = el('p', 'tc-desc', tech.description);
      desc.id = descId;
      text.append(desc);
    }

    [shadow, slab2, slab1, face, plate, iconShadow, icon].forEach(function (layer) {
      layer.setAttribute('aria-hidden', 'true');
    });
    card.append(shadow, slab2, slab1, face, plate, iconShadow, icon, text);
    item.append(card);
    grid.append(item);

    states.push({
      item: item, card: card,
      shadow: shadow, glare: glare, plate: plate, iconShadow: iconShadow, icon: icon, text: text,
      // molas: [rigidez, amortecimento]. O ícone usa uma mola mais "mole" que o card,
      // então ele fica um pouco atrasado e isso cria a sensação de camadas.
      px: spring(120, 16), py: spring(120, 16),     // inclinação do card
      ix: spring(70, 11),  iy: spring(70, 11),      // parallax do ícone (com atraso)
      h: spring(150, 17),                           // "levantar" ao entrar/focar
      p: spring(260, 22),                           // "apertar" ao pressionar
      pointer: null, mode: 'mouse', active: false, focused: false
    });
  });

  rootEl.replaceChildren(grid);

  /* ---------- Física de mola ---------- */
  function spring(k, c) { return { x: 0, v: 0, t: 0, k: k, c: c }; }
  function step(s, dt) {
    s.v += (s.k * (s.t - s.x) - s.c * s.v) * dt;   // aceleração = força da mola − atrito
    s.x += s.v * dt;
  }
  function settled(s) { return Math.abs(s.v) < 0.0008 && Math.abs(s.t - s.x) < 0.0004; }
  function clamp(n) { return n < -1 ? -1 : n > 1 ? 1 : n; }
  function f(n) { return n.toFixed(2); }

  /* ---------- Loop de animação (único) ---------- */
  var active = [];
  var raf = 0;
  var last = 0;

  function wake(s) {
    if (!s.active) {
      s.active = true;
      s.item.classList.add('is-active');
      active.push(s);
    }
    if (!raf) { last = 0; raf = window.requestAnimationFrame(tick); }
  }

  function render(s) {
    var cfg = TUNING[s.mode] || TUNING.mouse;
    var px = s.px.x, py = s.py.x, ix = s.ix.x, iy = s.iy.x, h = s.h.x, p = s.p.x;
    var par = cfg.parallax;

    s.card.style.transform =
      'translateZ(' + f(h * 16 - p * 12) + 'px) ' +
      'rotateX(' + f(-py * cfg.tilt) + 'deg) rotateY(' + f(px * cfg.tilt) + 'deg) ' +
      'scale(' + (1 + h * 0.02 - p * 0.012).toFixed(4) + ')';

    // O brilho segue o cursor. Em repouso fica no canto superior esquerdo (luz "vinda de cima").
    var rest = 1 - h;
    s.glare.style.transform =
      'translate(' + f(px * 36 - 11 * rest) + '%,' + f(py * 36 - 14 * rest) + '%)';
    s.glare.style.opacity = f(0.5 + h * 0.5);

    s.plate.style.transform =
      'translate3d(' + f(ix * par * 0.45) + 'px,' + f(iy * par * 0.45) + 'px,' + f(Z.plate + h * 6) + 'px)';
    s.iconShadow.style.transform =
      'translate3d(' + f(ix * par * 0.25) + 'px,' + f(10 + iy * par * 0.25 + h * 4) + 'px,' + f(Z.shadowOnPlate + h * 6) + 'px)';
    s.iconShadow.style.opacity = f(0.7 + h * 0.3);
    s.icon.style.transform =
      'translate3d(' + f(ix * par) + 'px,' + f(iy * par) + 'px,' + f(Z.icon + h * 12 + p * 8) + 'px)';
    s.text.style.transform =
      'translate3d(' + f(ix * par * 0.15) + 'px,' + f(iy * par * 0.15) + 'px,' + f(Z.text + h * 6) + 'px)';

    // Sombra no "chão": desloca conforme a inclinação e fica mais contida quando o card é apertado
    s.shadow.style.transform =
      'translate3d(' + f(px * 14) + 'px,' + f(22 + py * 10 + h * 6) + 'px,' + Z.floor + 'px)';
    s.shadow.style.opacity = f(0.6 + h * 0.25 - p * 0.15);
  }

  function tick(now) {
    raf = 0;
    var dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;

    // 1) leitura (todas as leituras de layout antes de qualquer escrita)
    for (var i = 0; i < active.length; i++) {
      var s = active[i];
      if (s.pointer) {
        var r = s.item.getBoundingClientRect();   // o <li> não sofre transform, então a medida é estável
        s.px.t = clamp(((s.pointer.x - r.left) / r.width) * 2 - 1);
        s.py.t = clamp(((s.pointer.y - r.top) / r.height) * 2 - 1);
      }
      s.ix.t = s.px.t;
      s.iy.t = s.py.t;
    }

    // 2) integração das molas + escrita dos transforms
    var still = [];
    for (var j = 0; j < active.length; j++) {
      var st = active[j];
      step(st.px, dt); step(st.py, dt); step(st.ix, dt); step(st.iy, dt); step(st.h, dt); step(st.p, dt);

      var done = settled(st.px) && settled(st.py) && settled(st.ix) && settled(st.iy) && settled(st.h) && settled(st.p);
      var engaged = !!st.pointer || st.focused;

      if (done && !engaged) {
        // chegou ao repouso: fixa nos valores finais, devolve ao CSS e libera a GPU
        st.px.x = st.py.x = st.ix.x = st.iy.x = st.h.x = st.p.x = 0;
        resetStyles(st);
        st.active = false;
        st.item.classList.remove('is-active');
      } else {
        if (!done) render(st);
        still.push(st);
      }
    }
    active = still;
    if (active.length) raf = window.requestAnimationFrame(tick);
  }

  function resetStyles(s) {
    [s.card, s.glare, s.plate, s.iconShadow, s.icon, s.text, s.shadow].forEach(function (n) {
      n.style.transform = '';
      n.style.opacity = '';
    });
  }

  /* ---------- Entrada: Pointer Events ---------- */
  function engage(s, e) {
    s.mode = e.pointerType === 'mouse' || e.pointerType === 'pen' ? 'mouse' : 'touch';
    s.pointer = { x: e.clientX, y: e.clientY };
    s.h.t = 1;
    wake(s);
  }

  function release(s) {
    if (!s.active && !s.pointer) return;                  // já está em repouso: nada a fazer
    s.pointer = null;
    s.p.t = 0;
    if (s.focused) { s.px.t = -0.25; s.py.t = -0.2; s.h.t = 1; }
    else { s.px.t = 0; s.py.t = 0; s.h.t = 0; }
    wake(s);
  }

  function bind(s) {
    var item = s.item;

    item.addEventListener('pointerenter', function (e) {
      if (reduced || e.pointerType === 'touch') return;   // no toque, quem começa é o pointerdown
      engage(s, e);
    });

    item.addEventListener('pointerdown', function (e) {
      if (reduced) return;
      engage(s, e);
      s.p.t = 1;
      wake(s);
    });

    item.addEventListener('pointermove', function (e) {
      if (reduced) return;
      if (!s.pointer) {
        if (e.pointerType === 'touch') return;            // toque só reage enquanto o dedo está apoiado
        engage(s, e);
        return;
      }
      s.pointer.x = e.clientX;                            // só guarda a posição; o cálculo acontece no rAF
      s.pointer.y = e.clientY;
    }, { passive: true });

    item.addEventListener('pointerup', function (e) {
      if (!s.pointer) return;
      if (e.pointerType === 'touch') release(s);          // dedo saiu: volta suavemente
      else { s.p.t = 0; wake(s); }                        // mouse continua em cima: só "solta" o card
    });

    // pointercancel acontece quando o navegador assume o gesto para rolar a página
    item.addEventListener('pointercancel', function () { release(s); });
    item.addEventListener('pointerleave', function () { release(s); });

    // Teclado: foco visível levanta o card e deixa o brilho aparecer
    s.card.addEventListener('focus', function () {
      var visible = true;
      try { visible = s.card.matches(':focus-visible'); } catch (err) { /* navegador antigo */ }
      if (reduced || !visible) return;
      s.focused = true;
      if (!s.pointer) { s.px.t = -0.25; s.py.t = -0.2; s.h.t = 1; wake(s); }
    });
    s.card.addEventListener('blur', function () {
      s.focused = false;
      if (!s.pointer) release(s);
    });
  }

  if (window.PointerEvent) states.forEach(bind);

  // Se a pessoa ativar "reduzir movimento" com a página aberta, assenta tudo na hora
  if (motionMq) {
    var onMotionChange = function (e) {
      reduced = e.matches;
      if (reduced) states.forEach(function (s) {
        s.pointer = null; s.focused = false;
        [s.px, s.py, s.ix, s.iy, s.h, s.p].forEach(function (m) { m.x = m.v = m.t = 0; });
        resetStyles(s);
        s.active = false;
        s.item.classList.remove('is-active');
      });
      if (reduced) active = [];
    };
    if (motionMq.addEventListener) motionMq.addEventListener('change', onMotionChange);
  }
})();
