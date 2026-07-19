/* Ameet Babbar — single article page */
(function () {
  "use strict";

  var CAT_VAR = {
    "Architecture": "--cat-architecture", "Landscape": "--cat-landscape",
    "Urbanism": "--cat-urbanism", "Technology": "--cat-technology", "AI": "--cat-ai",
    "Practice": "--cat-practice", "Business": "--cat-business",
    "Real Estate": "--cat-realestate", "Design": "--cat-design", "Personal": "--cat-personal"
  };
  var catColor = function (c) { return "var(" + (CAT_VAR[c] || "--cat-default") + ")"; };

  var root = document.querySelector("#article");
  var esc = function (v) {
    return String(v == null ? "" : v).replace(/[&<>'"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c];
    });
  };
  var formatBody = function (v) {
    return esc(v).split(/\n{2,}/).filter(Boolean).map(function (p) {
      if (p.indexOf("## ") === 0) return "<h2>" + p.slice(3) + "</h2>";
      return "<p>" + p.replace(/\n/g, "<br>") + "</p>";
    }).join("");
  };

  /* theme toggle (shared behaviour with the home page) */
  (function bindTheme() {
    var btn = document.querySelector("#theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var r = document.documentElement;
      var sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      var cur = r.getAttribute("data-theme") || (sysDark ? "dark" : "light");
      var next = cur === "dark" ? "light" : "dark";
      r.setAttribute("data-theme", next);
      try { localStorage.setItem("ab-theme", next); } catch (e) {}
    });
  })();

  async function show() {
    try {
      var res = await fetch("content.json", { cache: "no-store" });
      if (res.ok) content = await res.json();
    } catch (e) {}
    var slug = new URLSearchParams(location.search).get("slug");
    var a = content.articles.filter(function (x) { return x.slug === slug; })[0];
    if (!a) {
      root.innerHTML = '<p class="eyebrow">Writing</p><h1>That piece could not be found.</h1>' +
        '<p class="article-lede">The essay you are looking for may have moved.</p>' +
        '<a class="text-link" href="index.html#writing">Return to writing</a>';
      return;
    }
    document.title = a.title + " — Ameet Babbar";
    root.style.setProperty("--cat-color", catColor(a.category));
    root.innerHTML =
      '<p class="eyebrow">' + esc(a.type) + " · " + esc(a.category) + '</p>' +
      '<h1>' + esc(a.title) + '</h1>' +
      '<p class="article-lede">' + esc(a.excerpt) + '</p>' +
      '<div class="article-details"><span>' + esc(a.date) + '</span><span>' + esc(a.time) + '</span><span>' + esc(a.category) + '</span></div>' +
      (a.image ? '<img class="article-hero-image" src="' + esc(a.image) + '" alt="">' : "") +
      '<div class="article-body">' + formatBody(a.body) + '</div>';
  }
  show();
})();
