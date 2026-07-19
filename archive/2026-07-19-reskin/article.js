const articleRoot = document.querySelector('#article');
const esc = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const formatBody = value => esc(value).split(/\n{2,}/).filter(Boolean).map(paragraph => paragraph.startsWith('## ') ? `<h2>${paragraph.slice(3)}</h2>` : `<p>${paragraph.replace(/\n/g, '<br>')}</p>`).join('');

async function showArticle() {
  try {
    const response = await fetch('content.json', { cache: 'no-store' });
    if (response.ok) content = await response.json();
  } catch (_) {}
  const slug = new URLSearchParams(location.search).get('slug');
  const article = content.articles.find(item => item.slug === slug);
  if (!article) {
    articleRoot.innerHTML = '<p class="eyebrow">Writing</p><h1>That piece could not be found.</h1><a class="text-link" href="index.html#writing">Return to writing</a>';
    return;
  }
  document.title = `${article.title} — Ameet Babbar`;
  articleRoot.innerHTML = `<article><p class="eyebrow">${esc(article.type)} · ${esc(article.category)}</p><h1>${esc(article.title)}</h1><p class="article-lede">${esc(article.excerpt)}</p><div class="article-details"><span>${esc(article.date)}</span><span>${esc(article.time)}</span></div>${article.image ? `<img class="article-hero-image" src="${esc(article.image)}" alt="">` : ''}<div class="article-body">${formatBody(article.body)}</div></article>`;
}
showArticle();
