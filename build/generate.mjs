/* ============================================================
   Ameet Babbar — static build
   Reads content.json and produces a clean, deployable site in _site/:
     • copies the static site (html, css, js, images, admin, CNAME…)
     • generates one baked page per article at  _site/<slug>.html
       so every essay has a clean, shareable URL (ameetbabbar.com/<slug>)
       with real <title> + Open Graph / Twitter cards for link previews.
   Run:  node build/generate.mjs
   The GitHub Action runs this on every push, so CMS-published articles
   get their own page automatically.
   ============================================================ */

import { readFileSync, writeFileSync, rmSync, mkdirSync, cpSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = process.env.OUT_DIR || join(ROOT, "_site");
const SITE = "https://ameetbabbar.com";
const VERSION = "20260721";

/* subject → category hue (CSS var, adapts to dark mode) */
const CAT_VAR = {
  "Architecture": "--cat-architecture", "Landscape": "--cat-landscape",
  "Urbanism": "--cat-urbanism", "Technology": "--cat-technology", "AI": "--cat-ai",
  "Practice": "--cat-practice", "Business": "--cat-business",
  "Real Estate": "--cat-realestate", "Design": "--cat-design", "Personal": "--cat-personal"
};
const catColor = (c) => `var(${CAT_VAR[c] || "--cat-default"})`;

const esc = (v) => String(v == null ? "" : v).replace(/[&<>'"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));

/* content.json body → HTML (blank line = paragraph, "## " = subhead) */
const formatBody = (body) => esc(body).split(/\n{2,}/).filter(Boolean).map((p) =>
  p.startsWith("## ") ? `<h2>${p.slice(3)}</h2>` : `<p>${p.replace(/\n/g, "<br>")}</p>`
).join("\n");

/* absolute + URL-encoded (spaces → %20) so link-preview crawlers accept it */
const absImage = (img) => !img ? "" : encodeURI(/^https?:\/\//.test(img) ? img : `${SITE}/${img.replace(/^\//, "")}`);

const LOGO = '<svg class="wordmark__mark" viewBox="-450 -850 1320 1700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M-64.5858 807.323c-1.9572-13.7-1.9572-29.357-1.9572-46.972V-668.365c0-99.815-62.629-150.701-185.929-150.701-117.429 0-176.143 50.886-176.143 150.701v506.9h129.172v-520.6c0-27.4 15.657-41.1 46.971-41.1 31.314 0 46.972 13.7 46.972 41.1v495.158c0 52.842-37.186 105.685-111.558 152.657-74.371 46.971-111.557 90.029-111.557 131.129v587.144c0 72.414 52.843 135.043 125.257 135.043 43.058 0 76.329-23.486 99.815-72.415 1.957 27.4 3.914 46.972 3.914 60.672h135.043ZM-205.5 664.451c0 27.4-15.658 46.972-46.972 46.972-31.314 0-46.971-13.7-46.971-43.058V92.964c0-41.1 7.828-52.843 93.943-105.686v677.173ZM428.615 155.593c0-80.243-46.972-125.257-142.872-135.043v-5.871c95.9-17.614 142.872-66.543 142.872-146.786v-487.33c0-117.429-68.5-176.143-203.543-176.143H54.8v1602.903h170.272c135.043 0 203.543-58.715 203.543-176.143V155.593ZM281.829-104.707c0 41.1-17.614 62.629-52.843 62.629h-31.314V-685.98h31.314c35.229 0 52.843 21.529 52.843 64.586v516.687ZM281.829 625.308c0 41.1-17.614 62.629-52.843 62.629h-31.314V75.35h31.314c35.229 0 52.843 21.529 52.843 62.629v487.329Z"/><circle cx="688.429" cy="671.25" r="147.816" fill="#d9382c"/></svg>';

const THEME_SCRIPT = `<script>(function(){try{var t=localStorage.getItem("ab-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();</script>`;
const TOGGLE_SCRIPT = `<script>document.getElementById("theme-toggle").addEventListener("click",function(){var r=document.documentElement,c=r.getAttribute("data-theme")||"light",n=c==="dark"?"light":"dark";r.setAttribute("data-theme",n);try{localStorage.setItem("ab-theme",n);}catch(e){}});</script>`;

function articlePage(a) {
  const url = `${SITE}/${a.slug}`;
  const ogImg = absImage(a.image);
  const ogImageTags = ogImg
    ? `<meta property="og:image" content="${esc(ogImg)}">\n<meta name="twitter:image" content="${esc(ogImg)}">`
    : "";
  const hero = a.image ? `<img class="article-hero-image" src="${esc(a.image)}" alt="">` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(a.title)} — Ameet Babbar</title>
<meta name="description" content="${esc(a.excerpt)}">
<link rel="canonical" href="${esc(url)}">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#131211" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.title)}">
<meta property="og:description" content="${esc(a.excerpt)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:site_name" content="Ameet Babbar">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(a.title)}">
<meta name="twitter:description" content="${esc(a.excerpt)}">
${ogImageTags}
<link rel="icon" type="image/svg+xml" href="images/favicon.svg">
<link rel="apple-touch-icon" href="images/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css?v=${VERSION}">
${THEME_SCRIPT}
</head>
<body>

<header class="article-header">
  <a href="index.html" class="wordmark" aria-label="Ameet Babbar home">
    ${LOGO}
    <span class="wordmark__name">Ameet <b>Babbar</b></span>
  </a>
  <div class="masthead__right">
    <a class="text-link" href="index.html#writing">← Back to writing</a>
    <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Switch between light and dark">◐</button>
  </div>
</header>

<main class="article-page" style="--cat-color:${catColor(a.category)}">
  <p class="eyebrow">${esc(a.type)} · ${esc(a.category)}</p>
  <h1>${esc(a.title)}</h1>
  <p class="article-lede">${esc(a.excerpt)}</p>
  <div class="article-details"><span>${esc(a.date)}</span><span>${esc(a.time)}</span><span>${esc(a.category)}</span></div>
  ${hero}
  <div class="article-body">
${formatBody(a.body)}
  </div>
</main>

<footer class="footer">
  <div class="footer__row">
    <p class="footer__links"><a href="index.html">Home</a><a href="https://www.linkedin.com/in/bbarch">LinkedIn</a><a href="mailto:ameet@babbar.in">Contact</a></p>
    <span class="footer__copy">© 2026 Ameet Babbar · New Delhi</span>
  </div>
  <p class="footer__note">The writing here is my own; some pieces are drafted or edited with AI assistance. Projects featured may remain the copyright of their respective designers and firms.</p>
</footer>

${TOGGLE_SCRIPT}
</body>
</html>
`;
}

/* ---------- build ---------- */
const EXCLUDE = new Set(["_site", ".git", ".github", "archive", "build", "node_modules", ".DS_Store"]);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// copy each top-level entry (except build/dev/archive dirs) into _site
for (const entry of readdirSync(ROOT)) {
  if (EXCLUDE.has(entry)) continue;
  cpSync(join(ROOT, entry), join(OUT, entry), { recursive: true });
}

writeFileSync(join(OUT, ".nojekyll"), "");

const data = JSON.parse(readFileSync(join(ROOT, "content.json"), "utf8"));
let n = 0;
for (const a of data.articles) {
  if (!a.slug) continue;
  writeFileSync(join(OUT, `${a.slug}.html`), articlePage(a));
  n++;
  console.log(`  ✓ /${a.slug}`);
}
console.log(`\nGenerated ${n} article page(s) into _site/`);
