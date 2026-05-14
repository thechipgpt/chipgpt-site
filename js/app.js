// === Конфигурация ===
marked.setOptions({ breaks: true, gfm: true, headerIds: true });
mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: 'system-ui' });

// === Роутер ===
async function render() {
  const path = location.hash.replace('#/', '') || 'readme';
  const file = `content/${path}.md`;
  const content = document.getElementById('content');
  const sidebar = document.getElementById('wiki-sidebar');
  const toc = document.getElementById('toc');

  // Скрываем sidebar по умолчанию
  sidebar.hidden = true;
  toc.innerHTML = '';
  content.innerHTML = '<p class="loading">Загрузка...</p>';

  // Активная ссылка в меню
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${path}`);
  });

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error('404');
    const md = await res.text();

    // Рендер Markdown
    content.innerHTML = marked.parse(md);

    // Подсветка кода
    document.querySelectorAll('pre code:not(.language-mermaid)').forEach(hljs.highlightElement);

    // Mermaid диаграммы
    document.querySelectorAll('pre code.language-mermaid').forEach(code => {
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = code.textContent;
      code.replaceWith(div);
    });
    await mermaid.run();

    // Показываем sidebar ТОЛЬКО для wiki-страниц
    if (path.startsWith('wiki/')) {
      sidebar.hidden = false;
      generateTOC();
    }

  } catch (e) {
    content.innerHTML = `<h2>❌ 404</h2><p>Файл <code>${file}</code> не найден.</p>`;
  }
}

// === Генерация оглавления (TOC) ===
function generateTOC() {
  const headings = document.querySelectorAll('#content h2, #content h3');
  const toc = document.getElementById('toc');
  if (!headings.length) return;

  let html = '<ul>';
  headings.forEach((h, i) => {
    if (!h.id) h.id = `h-${i}`;
    const indent = h.tagName === 'H3' ? 'class="sub"' : '';
    html += `<li ${indent}><a href="#${h.id}">${h.textContent}</a></li>`;
  });
  html += '</ul>';
  toc.innerHTML = html;

  // Плавный скролл + активная ссылка
  toc.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(link.hash.slice(1));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Scroll Spy: подсветка при прокрутке
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        toc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        toc.querySelector(`a[href="#${entry.target.id}"]`)?.classList.add('active');
      }
    });
  }, { rootMargin: '-100px 0px -60% 0px' });

  headings.forEach(h => observer.observe(h));
}

// === Инициализация ===
window.addEventListener('DOMContentLoaded', render);
window.addEventListener('hashchange', render);