/* Ameet Babbar — home/about behaviour (theme, writing, notes) */
(function () {
  "use strict";

  var $ = function (s, p) { return (p || document).querySelector(s); };
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>'"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c];
    });
  };

  /* subject → category hue (CSS var, so the stripe follows dark mode) */
  var CAT_VAR = {
    "Architecture": "--cat-architecture", "Landscape": "--cat-landscape",
    "Urbanism": "--cat-urbanism", "Technology": "--cat-technology", "AI": "--cat-ai",
    "Practice": "--cat-practice", "Business": "--cat-business",
    "Real Estate": "--cat-realestate", "Design": "--cat-design", "Personal": "--cat-personal"
  };
  var catColor = function (cat) { return "var(" + (CAT_VAR[cat] || "--cat-default") + ")"; };
  var articleURL = function (it) { return "article.html?slug=" + encodeURIComponent(it.slug); };

  /* ---------- theme ---------- */
  function bindTheme() {
    var btn = $("#theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var root = document.documentElement;
      var cur = root.getAttribute("data-theme") || "light";
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ab-theme", next); } catch (e) {}
    });
  }

  /* ---------- masthead date ---------- */
  function setDate() {
    var el = $("#masthead-date");
    if (!el) return;
    var d = new Date();
    var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var mons = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    el.textContent = days[d.getDay()] + " " + d.getDate() + " " + mons[d.getMonth()] + " " + d.getFullYear();
  }

  /* ---------- state ---------- */
  var state = { cat: "all", view: "grid", q: "" };

  function matches(a) {
    if (state.cat !== "all" && a.category !== state.cat) return false;
    if (state.q) {
      var hay = (a.title + " " + a.excerpt + " " + a.category + " " + a.type).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function cardHTML(a) {
    return '<a class="card" href="' + articleURL(a) + '" style="--cat-color:' + catColor(a.category) + '">' +
      '<div class="card__meta"><span class="card__category">' + esc(a.category) + '</span><span>' + esc(a.time) + '</span></div>' +
      (a.image ? '<img class="card__image" src="' + esc(a.image) + '" alt="">' : '') +
      '<div class="card__title">' + esc(a.title) + '</div>' +
      '<div class="card__desc">' + esc(a.excerpt) + '</div></a>';
  }

  function rowHTML(a) {
    return '<a class="row" href="' + articleURL(a) + '" style="--cat-color:' + catColor(a.category) + '">' +
      '<div class="row__meta"><span>' + esc(a.type) + '</span><span>' + esc(a.date) + '</span></div>' +
      '<div class="row__title">' + esc(a.title) + '</div>' +
      '<div class="row__cat">' + esc(a.category) + " · " + esc(a.time) + '</div></a>';
  }

  function renderWriting() {
    var body = $("#writing-body");
    if (!body) return;
    var list = content.articles.filter(function (a) { return !a.featured; }).filter(matches);
    if (!list.length) {
      body.innerHTML = '<p class="empty-state">No writing matches that filter yet.</p>';
    } else if (state.view === "list") {
      body.innerHTML = '<div class="index-list">' + list.map(rowHTML).join("") + "</div>";
    } else {
      body.innerHTML = '<div class="card-grid">' + list.map(cardHTML).join("") + "</div>";
    }
    var rc = $("#result-count");
    if (rc) {
      var filtering = state.cat !== "all" || state.q;
      rc.hidden = !filtering;
      rc.textContent = filtering ? list.length + (list.length === 1 ? " piece" : " pieces") : "";
    }
  }

  function renderLead() {
    var lead = $("#lead");
    if (!lead) return;
    var a = content.articles.filter(function (x) { return x.featured; })[0];
    if (!a) { lead.hidden = true; return; }
    lead.hidden = false;
    lead.innerHTML = '<a class="lead__card" href="' + articleURL(a) + '" style="--cat-color:' + catColor(a.category) + '">' +
      '<div class="lead__body">' +
        '<span class="lead__eyebrow">Featured essay</span>' +
        '<div class="lead__meta"><span>' + esc(a.type) + '</span><span>' + esc(a.category) + '</span><span>' + esc(a.time) + '</span><span>' + esc(a.date) + '</span></div>' +
        '<h2 class="lead__title">' + esc(a.title) + '</h2>' +
        '<p class="lead__desc">' + esc(a.excerpt) + '</p>' +
        '<span class="text-link" style="align-self:flex-start">Read the essay</span>' +
      '</div>' +
      (a.image ? '<img class="lead__image" src="' + esc(a.image) + '" alt="">' : '<div class="lead__art" aria-hidden="true"></div>') +
      '</a>';
  }

  function renderNotes() {
    var grid = $("#note-grid");
    if (!grid) return;
    grid.innerHTML = (content.notes || []).map(function (n) {
      return '<article class="hl-card">' +
        '<div class="hl-card__date">' + esc(n.date) + '</div>' +
        '<div class="hl-card__title">' + esc(n.title) + '</div>' +
        '<div class="hl-card__body">' + esc(n.body) + '</div></article>';
    }).join("");
  }

  function buildFilters() {
    var wrap = $("#filter-cats");
    if (!wrap) return;
    var cats = [];
    content.articles.forEach(function (a) { if (a.category && cats.indexOf(a.category) === -1) cats.push(a.category); });
    cats.sort();
    var html = '<button type="button" class="chip" data-cat="all" aria-pressed="true">All</button>';
    html += cats.map(function (c) { return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + '</button>'; }).join("");
    wrap.innerHTML = html;
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      state.cat = b.getAttribute("data-cat");
      wrap.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
      renderWriting();
    });
  }

  function bindView() {
    var wrap = $(".viewtoggle");
    if (!wrap) return;
    wrap.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      state.view = b.getAttribute("data-view");
      wrap.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
      renderWriting();
    });
  }

  function bindSearch() {
    var input = $("#search-input");
    if (!input) return;
    input.addEventListener("input", function () { state.q = input.value.toLowerCase().trim(); renderWriting(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input) { e.preventDefault(); input.focus(); }
      else if (e.key === "Escape" && document.activeElement === input) { input.value = ""; state.q = ""; input.blur(); renderWriting(); }
    });
  }

  /* ---------- boot ---------- */
  bindTheme();
  setDate();

  async function boot() {
    try {
      var res = await fetch("content.json", { cache: "no-store" });
      if (res.ok) content = await res.json();
    } catch (e) { /* content.js fallback stays in place */ }
    if ($("#writing-body")) {
      buildFilters(); bindView(); bindSearch();
      renderLead(); renderWriting(); renderNotes();
    }
  }
  boot();
})();
