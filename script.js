/* =====================================================================
   Portfólio — Hyago Soares Matos
   Os dados (tecnologias e projetos) ficam em js/data.js; os cards 3D de tecnologias ficam em js/tech3d.js.
   Índice: helpers · tema · menu · scroll · reveal
           projetos · modal · GitHub API · contato
   ===================================================================== */
(function () {
  'use strict';

  var data = window.PORTFOLIO;
  if (!data) {
    console.warn('js/data.js não foi carregado.');
    return;
  }

  /* ---------- helpers ---------- */
  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cria elementos de forma segura (sem innerHTML)
  function h(tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (key) {
      var val = props[key];
      if (val === null || val === undefined || val === false) return;
      if (key === 'class') el.className = val;
      else if (key === 'text') el.textContent = val;
      else if (key.indexOf('on') === 0) el.addEventListener(key.slice(2), val);
      else el.setAttribute(key, val === true ? '' : val);
    });
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (Array.isArray(child)) child.forEach(function (c) { if (c) el.append(c); });
      else if (child) el.append(child);
    }
    return el;
  }

  function store(action, key, value) {
    try {
      if (action === 'get') return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* armazenamento indisponível: ignora */ }
    return null;
  }

  function externalLink(label, href, className) {
    return h('a', { class: className, href: href, target: '_blank', rel: 'noopener noreferrer' },
      label,
      h('span', { class: 'visually-hidden', text: ' (abre em nova aba)' })
    );
  }

  /* ---------- TEMA (claro / escuro) ---------- */
  var themeBtn = $('#theme-toggle');
  var themeMeta = $('meta[name="theme-color"]');

  function applyTheme(theme, save) {
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0d0e10' : '#fafaf8');
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
      themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    }
    if (save) store('set', 'theme', theme);
  }

  applyTheme(root.getAttribute('data-theme') || 'light', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-transition');
      applyTheme(next, true);
      window.setTimeout(function () { root.classList.remove('theme-transition'); }, 350);
    });
  }

  // Acompanha o tema do sistema enquanto a pessoa não escolheu um manualmente
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onSystemChange = function (e) {
      if (!store('get', 'theme')) applyTheme(e.matches ? 'dark' : 'light', false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
  }

  /* ---------- MENU MOBILE ---------- */
  var header = $('#site-header');
  var navToggle = $('#nav-toggle');
  var nav = $('#primary-nav');
  var desktopMq = window.matchMedia('(min-width: 860px)');

  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    root.style.overflow = open ? 'hidden' : '';
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  // No mobile o menu fechado fica fora do alcance do teclado
  function syncNavInert() {
    var closedOnMobile = !desktopMq.matches && !header.classList.contains('menu-open');
    if (closedOnMobile) nav.setAttribute('inert', ''); else nav.removeAttribute('inert');
  }

  navToggle.addEventListener('click', function () {
    setMenu(!header.classList.contains('menu-open'));
    syncNavInert();
  });
  $$('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); syncNavInert(); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      syncNavInert();
      navToggle.focus();
    }
  });
  var onBreakpoint = function () { if (desktopMq.matches) setMenu(false); syncNavInert(); };
  if (desktopMq.addEventListener) desktopMq.addEventListener('change', onBreakpoint);
  syncNavInert();

  /* ---------- SCROLL: header, voltar ao topo e seção ativa ---------- */
  var toTop = $('#to-top');
  toTop.hidden = false;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 8);
    toTop.classList.toggle('is-visible', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  var navLinks = $$('.nav-link');
  var sections = navLinks
    .map(function (a) { return $(a.getAttribute('href')); })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (a) {
      var active = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
  setActive('inicio');

  /* ---------- REVEAL (aparecer ao rolar) ---------- */
  var revealObserver = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }

  function observeReveals(scope) {
    $$('.reveal:not(.is-visible)', scope).forEach(function (el) {
      if (revealObserver) revealObserver.observe(el); else el.classList.add('is-visible');
    });
  }

  /* ---------- PROJETOS: cards e filtros ---------- */
  var grid = $('#projects-grid');
  var filtersEl = $('#project-filters');
  var emptyEl = $('#projects-empty');

  function imageEl(project, className) {
    var img = h('img', {
      class: className,
      src: project.image,
      alt: project.imageAlt || ('Capa do projeto ' + project.name),
      width: '1200',
      height: '750',
      decoding: 'async'
    });
    // Se a imagem não carregar, mostra um bloco de texto no lugar (nunca quebra o layout)
    img.addEventListener('error', function () {
      img.replaceWith(h('div', { class: 'img-fallback', role: 'img', 'aria-label': img.alt, text: project.name }));
    });
    return img;
  }

  function createCard(project, index) {
    var cover = imageEl(project, '');
    cover.setAttribute('loading', 'lazy');

    var info = h('div', { class: 'project-info' },
      h('span', { class: 'status', text: project.status || 'Projeto' }),
      h('h3', { text: project.name }),
      h('p', { class: 'project-summary', text: project.summary }),
      project.tech && project.tech.length
        ? h('ul', { class: 'chips', role: 'list' }, project.tech.map(function (t) { return h('li', { class: 'chip', text: t }); }))
        : null,
      h('span', { class: 'project-more', 'aria-hidden': 'true' }, 'Ver detalhes ', h('span', { text: '→' }))
    );

    var card = h('button', {
      type: 'button',
      class: 'project-card reveal',
      'aria-haspopup': 'dialog',
      'aria-label': 'Ver detalhes do projeto ' + project.name,
      'data-category': project.category,
      style: '--d:' + ((index % 3) * 80) + 'ms'
    }, h('div', { class: 'project-cover' }, cover), info);

    card.addEventListener('click', function () { openModal(project, card); });
    return card;
  }

  function renderProjects() {
    if (!grid || !data.projects) return;
    data.projects.forEach(function (p, i) { grid.append(createCard(p, i)); });

    (data.filters || []).forEach(function (f, i) {
      filtersEl.append(h('button', {
        type: 'button',
        class: 'filter-btn',
        'data-filter': f.id,
        'aria-pressed': String(i === 0),
        text: f.label,
        onclick: function () { applyFilter(f.id); }
      }));
    });
  }

  function applyFilter(id) {
    $$('.filter-btn', filtersEl).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === id));
    });

    var update = function () {
      var visible = 0;
      $$('.project-card', grid).forEach(function (card) {
        var show = id === 'all' || card.getAttribute('data-category') === id;
        card.hidden = !show;
        if (show) visible++;
      });
      emptyEl.hidden = visible > 0;
      grid.classList.remove('is-changing');
    };

    if (reduceMotion) { update(); return; }
    grid.classList.add('is-changing');
    window.setTimeout(update, 200);
  }

  /* ---------- MODAL DE PROJETO ---------- */
  var modal = $('#project-modal');
  var modalMedia = $('#modal-media');
  var modalTools = $('#modal-tools');
  var lastTrigger = null;
  var iframeTimer = null;

  function showImagePreview(project) {
    window.clearTimeout(iframeTimer);
    modalMedia.replaceChildren(imageEl(project, ''));
    modalTools.replaceChildren();
    modalTools.hidden = true;

    // Prévia interativa: só é oferecida quando o projeto tem demo e "embed: true"
    if (project.demo && project.embed) {
      modalTools.hidden = false;
      modalTools.append(
        h('p', { text: 'Este projeto tem uma versão online. Você pode tentar abri-la aqui mesmo.' }),
        h('button', { type: 'button', class: 'btn btn-secondary btn-sm', onclick: function () { showIframePreview(project); } }, 'Carregar prévia interativa')
      );
    }
  }

  function showIframePreview(project) {
    var frame = h('iframe', {
      src: project.demo,
      title: 'Prévia interativa do projeto ' + project.name,
      loading: 'lazy',
      referrerpolicy: 'no-referrer',
      sandbox: 'allow-scripts allow-same-origin allow-forms allow-popups'
    });
    modalMedia.replaceChildren(frame);

    var note = h('p', { text: 'Carregando prévia…' });
    modalTools.replaceChildren(
      note,
      h('button', { type: 'button', class: 'btn btn-secondary btn-sm', onclick: function () { showImagePreview(project); } }, 'Voltar à imagem'),
      externalLink('Abrir projeto', project.demo, 'btn btn-primary btn-sm')
    );
    modalTools.hidden = false;

    // Alguns sites bloqueiam exibição dentro de outras páginas e o navegador não avisa.
    // Por isso a mensagem de alternativa aparece sempre, e o modal nunca depende da prévia.
    frame.addEventListener('load', function () {
      window.clearTimeout(iframeTimer);
      note.textContent = 'Se a página não aparecer acima, o site não permite ser exibido aqui. Use "Abrir projeto".';
    });
    iframeTimer = window.setTimeout(function () {
      note.textContent = 'A prévia está demorando ou foi bloqueada pelo site. Use "Abrir projeto" para ver em uma nova aba.';
    }, 8000);
  }

  function openModal(project, trigger) {
    lastTrigger = trigger;

    $('#modal-title').textContent = project.name;
    $('#modal-status').textContent = project.status || '';
    $('#modal-status').className = 'modal-status status';

    var desc = $('#modal-desc');
    desc.replaceChildren();
    String(project.description || project.summary || '').split('\n\n').forEach(function (para) {
      desc.append(h('p', { text: para }));
    });

    var tech = $('#modal-tech');
    tech.replaceChildren();
    if (project.tech && project.tech.length) {
      project.tech.forEach(function (t) { tech.append(h('li', { class: 'chip', text: t })); });
    } else {
      tech.append(h('li', { class: 'muted', text: 'A definir' }));
    }

    var actions = $('#modal-actions');
    actions.replaceChildren();
    if (project.repo) actions.append(externalLink('Ver código', project.repo, 'btn btn-secondary'));
    if (project.demo) actions.append(externalLink('Ver projeto', project.demo, 'btn btn-primary'));
    else actions.append(h('span', { class: 'btn-disabled', text: 'Demonstração online em breve' }));

    showImagePreview(project);

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      // Navegadores muito antigos: abre o repositório em vez de quebrar a página
      window.open(project.repo || data.github.profileUrl, '_blank', 'noopener');
      return;
    }
    root.classList.add('modal-open');
    modal.querySelector('.modal-inner').scrollTop = 0;
  }

  function onModalClosed() {
    window.clearTimeout(iframeTimer);
    modalMedia.replaceChildren(); // descarrega o iframe, se existir
    modalTools.replaceChildren();
    root.classList.remove('modal-open');
    if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
  }

  $('#modal-close').addEventListener('click', function () { modal.close(); });
  modal.addEventListener('close', onModalClosed);
  // Clique fora: o <dialog> recebe o clique apenas quando ele acontece no fundo escurecido
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  // A tecla ESC já fecha o <dialog> nativamente

  /* ---------- GITHUB API (opcional, com fallback) ---------- */
  var ghBox = $('#github-extra');
  var ghBody = $('#github-extra-body');

  function repoName(url) {
    return String(url || '').replace(/\/+$/, '').split('/').pop().toLowerCase();
  }

  function readCache(key, maxAgeMs) {
    try {
      var raw = sessionStorage.getItem(key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return Date.now() - parsed.t < maxAgeMs ? parsed.v : null;
    } catch (e) { return null; }
  }
  function writeCache(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value })); } catch (e) { /* ignora */ }
  }

  function renderRepos(repos) {
    var known = (data.projects || []).map(function (p) { return repoName(p.repo); });
    var ignored = (data.github.ignore || []).map(function (n) { return n.toLowerCase(); });

    var extra = repos.filter(function (r) {
      var name = String(r.name).toLowerCase();
      return !r.fork && !r.archived && known.indexOf(name) === -1 && ignored.indexOf(name) === -1;
    });

    if (!extra.length) { ghBox.hidden = true; return; }

    ghBody.replaceChildren(h('div', { class: 'gh-list' }, extra.map(function (r) {
      return h('a', { class: 'gh-item', href: r.html_url, target: '_blank', rel: 'noopener noreferrer' },
        h('strong', { text: r.name }),
        r.description ? h('span', { text: r.description }) : null,
        r.language ? h('span', { class: 'gh-lang', text: r.language }) : null
      );
    })));
    ghBox.hidden = false;
  }

  function loadGithubRepos() {
    var cfg = data.github;
    if (!cfg || !cfg.useApi || !ghBox) return;

    var cacheKey = 'gh-repos:' + cfg.user;
    var cached = readCache(cacheKey, (cfg.cacheMinutes || 30) * 60000);
    if (cached) { renderRepos(cached); return; }

    ghBox.hidden = false;
    ghBody.replaceChildren(h('p', { class: 'gh-state' }, h('span', { class: 'gh-spinner', 'aria-hidden': 'true' }), 'Buscando outros repositórios públicos…'));

    var controller = 'AbortController' in window ? new AbortController() : null;
    var timeout = window.setTimeout(function () { if (controller) controller.abort(); }, 8000);

    fetch('https://api.github.com/users/' + encodeURIComponent(cfg.user) + '/repos?per_page=100&sort=updated', {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub respondeu com status ' + res.status);
        return res.json();
      })
      .then(function (repos) {
        window.clearTimeout(timeout);
        if (!Array.isArray(repos)) throw new Error('Resposta inesperada');
        writeCache(cacheKey, repos);
        renderRepos(repos);
      })
      .catch(function () {
        window.clearTimeout(timeout);
        ghBody.replaceChildren(h('p', { class: 'gh-state' },
          'Não foi possível carregar os repositórios do GitHub agora. Os projetos acima continuam disponíveis. ',
          externalLink('Ver todos no GitHub', cfg.profileUrl, 'link')
        ));
      });
  }

  // Só consulta a API quando a pessoa chega perto da seção de projetos
  function lazyLoadGithub() {
    var section = $('#projetos');
    if (!data.github || !data.github.useApi || !section) return;
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          io.disconnect();
          loadGithubRepos();
        }
      }, { rootMargin: '400px 0px' });
      io.observe(section);
    } else {
      loadGithubRepos();
    }
  }

  /* ---------- CONTATO: copiar e-mail ---------- */
  var copyBtn = $('#copy-email');
  var copyStatus = $('#copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      var done = function (ok) {
        copyBtn.textContent = ok ? 'Copiado ✓' : 'Não copiou';
        copyBtn.classList.toggle('is-done', ok);
        copyStatus.textContent = ok ? 'E-mail copiado para a área de transferência.' : 'Não foi possível copiar. Selecione o e-mail manualmente.';
        window.setTimeout(function () {
          copyBtn.textContent = 'Copiar';
          copyBtn.classList.remove('is-done');
        }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  }

  /* ---------- INICIALIZAÇÃO ---------- */
  renderProjects();
  observeReveals(document);
  lazyLoadGithub();
})();
