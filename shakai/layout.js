/* Inject a consistent header/footer and set active nav link */
(function(){
  const links = [
    {href:'../index.html',label:'🏡 全般'},
    {href:'../sansu/sansu.html',label:'算数'},
    {href:'../kokugo/kokugo.html',label:'国語'},
    {href:'../rika/',label:'理科'},
    {href:'shakai.html',label:'社会'}
  ];

  function buildHeader(){
    const nav = links.map(l=>`<a href="${l.href}">${l.label}</a>`).join('');
    return `<header class="site-header"><div class="header-inner"><div class="logo"><h1>中学受験</h1></div><nav class="site-nav">${nav}</nav></div></header>`;
  }

  function setActive(){
    const cur = location.pathname.split('/').pop() || 'index.html';
    const anchors = document.querySelectorAll('.site-nav a');
    anchors.forEach(a=>{ a.classList.toggle('active', a.getAttribute('href')===cur); });
  }

  function ensureHeader(){
    const existing = document.querySelector('header');
    const headerHtml = buildHeader();
    if(existing){
      // replace existing header with our consistent header
      const parent = existing.parentNode;
      const frag = document.createElement('div'); frag.innerHTML = headerHtml;
      parent.replaceChild(frag.firstElementChild, existing);
    } else {
      document.body.insertAdjacentHTML('afterbegin', headerHtml);
    }
  }

  function ensureFooter(){
    if(document.querySelector('.page-footer')) return;
    const footer = `<div class="page-footer">© 学習サイト — 作成者</div>`;
    document.body.insertAdjacentHTML('beforeend', footer);
  }

  document.addEventListener('DOMContentLoaded', ()=>{ ensureHeader(); setActive(); ensureFooter(); });
})();
