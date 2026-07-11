const $ = (s, p = document) => p.querySelector(s);
const articleGrid = $('#article-grid');
const noteGrid = $('#note-grid');

function render() {
  articleGrid.innerHTML = content.articles.map((item, index) => `<article class="article-card" data-search="${item.title} ${item.excerpt} ${item.category}"><div class="article-meta"><span>${item.type}</span><span>${item.time}</span></div><div><p class="card-number">0${index + 1}</p><h3>${item.title}</h3><p>${item.excerpt}</p></div><div class="card-bottom"><span>${item.category}</span><a href="#article-${index}" aria-label="Read ${item.title}">↗</a></div></article>`).join('');
  noteGrid.innerHTML = content.notes.map(note => `<article class="note"><p class="note-date">${note.date}</p><h3>${note.title}</h3><p>${note.body}</p><a href="#note">Read note <span>→</span></a></article>`).join('');
}
render();

$('.notice button').addEventListener('click', () => $('.notice').remove());
const dialog = $('#search-dialog');
$('.search-toggle').addEventListener('click', () => dialog.showModal());
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
$('#site-search').addEventListener('input', e => {
  const term = e.target.value.toLowerCase().trim();
  const results = content.articles.filter(a => `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(term));
  $('#search-results').innerHTML = term ? (results.length ? results.map(a => `<a href="#writing"><span>${a.type}</span>${a.title}<b>↗</b></a>`).join('') : '<p>No matching writing yet.</p>') : '';
});
$('#signup-form').addEventListener('submit', e => { e.preventDefault(); $('.form-message').textContent = 'Thank you — you’re on the list.'; e.target.reset(); });
