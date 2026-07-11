const $ = (s, p = document) => p.querySelector(s);
const articleGrid = $('#article-grid');
const noteGrid = $('#note-grid');
const escapeHTML = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

function articleURL(item) { return `article.html?slug=${encodeURIComponent(item.slug)}`; }

function renderFeatured(item) {
  if (!item) return;
  const title = $('#featured-title');
  const excerpt = $('#featured-excerpt');
  const meta = $('#featured-meta');
  const link = $('#featured-link');
  const artwork = $('.ai-art');
  if (title) title.textContent = item.title;
  if (excerpt) excerpt.textContent = item.excerpt;
  if (meta) meta.innerHTML = `<span>${escapeHTML(item.type)}</span><span>${escapeHTML(item.time)}</span><span>${escapeHTML(item.date)}</span>`;
  if (link) link.href = articleURL(item);
  if (artwork) {
    if (item.image) {
      artwork.classList.add('has-image');
      artwork.innerHTML = `<img src="${escapeHTML(item.image)}" alt="" />`;
    } else {
      artwork.classList.remove('has-image');
      artwork.innerHTML = '<i></i><b></b><span></span><strong></strong>';
    }
  }
}

function render() {
  const visibleArticles = content.articles.filter(item => !item.featured);
  articleGrid.innerHTML = visibleArticles.map((item, index) => `<article class="article-card" data-search="${escapeHTML(`${item.title} ${item.excerpt} ${item.category}`)}">${item.image ? `<img class="article-image" src="${escapeHTML(item.image)}" alt="" />` : ''}<div class="article-meta"><span>${escapeHTML(item.type)}</span><span>${escapeHTML(item.time)}</span></div><div><p class="card-number">0${index + 1}</p><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.excerpt)}</p></div><div class="card-bottom"><span>${escapeHTML(item.category)}</span><a href="${articleURL(item)}" aria-label="Read ${escapeHTML(item.title)}">↗</a></div></article>`).join('');
  noteGrid.innerHTML = content.notes.map(note => `<article class="note"><p class="note-date">${escapeHTML(note.date)}</p><h3>${escapeHTML(note.title)}</h3><p>${escapeHTML(note.body)}</p></article>`).join('');
  renderFeatured(content.articles.find(item => item.featured));
}

async function loadContent() {
  try {
    const response = await fetch('content.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Content unavailable');
    content = await response.json();
  } catch (_) {
    // The fallback in content.js keeps local file previews usable.
  }
  render();
}
loadContent();

$('.notice button').addEventListener('click', () => $('.notice').remove());
const dialog = $('#search-dialog');
$('.search-toggle').addEventListener('click', () => dialog.showModal());
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
$('#site-search').addEventListener('input', e => {
  const term = e.target.value.toLowerCase().trim();
  const results = content.articles.filter(a => `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(term));
  $('#search-results').innerHTML = term ? (results.length ? results.map(a => `<a href="${articleURL(a)}"><span>${escapeHTML(a.type)}</span>${escapeHTML(a.title)}<b>↗</b></a>`).join('') : '<p>No matching writing yet.</p>') : '';
});
$('#signup-form').addEventListener('submit', e => { e.preventDefault(); $('.form-message').textContent = 'Thank you — you’re on the list.'; e.target.reset(); });
