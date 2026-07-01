// app.js - маршрутизация и загрузка контента

marked.setOptions({ breaks: true, gfm: true, headerIds: true });
mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: 'system-ui' });

let currentPath = 'readme';

async function render() {
    const path = location.hash.replace('#/', '') || 'readme';
    currentPath = path;
    
    const content = document.getElementById('content');
    const sidebar = document.getElementById('wiki-sidebar');
    const toc = document.getElementById('toc');

    sidebar.hidden = true;
    toc.innerHTML = '';
    content.innerHTML = '<p class="loading">⏳ Загрузка...</p>';

    // Активная ссылка в меню
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            link.classList.toggle('active', href === `#${path}`);
        }
    });

    try {
        // 🔥 ЗАГРУЖАЕМ ФАЙЛ ИЗ ПАПКИ ТЕКУЩЕГО ЯЗЫКА
        // Защита: если i18n не определен, используем 'ru'
        const lang = (typeof i18n !== 'undefined' && i18n && i18n.currentLang) 
            ? i18n.currentLang 
            : 'ru';
        const file = `content/${lang}/${path}.md`;
        
        console.log(`📂 Загрузка: ${file}`);
        let res = await fetch(file);
        
        // Если файл не найден на текущем языке, пробуем русскую версию
        if (!res.ok) {
            console.warn(`⚠️ Файл ${file} не найден, пробуем русскую версию`);
            const fallbackFile = `content/ru/${path}.md`;
            res = await fetch(fallbackFile);
            
            if (!res.ok) {
                throw new Error(`404: ${path} не найден ни на одном языке`);
            }
        }
        
        const md = await res.text();
        content.innerHTML = marked.parse(md);

        // Подсветка кода
        document.querySelectorAll('pre code:not(.language-mermaid)').forEach(block => {
            if (typeof hljs !== 'undefined') {
                hljs.highlightElement(block);
            }
        });

        // Mermaid диаграммы
        document.querySelectorAll('pre code.language-mermaid').forEach(code => {
            const div = document.createElement('div');
            div.className = 'mermaid';
            div.textContent = code.textContent;
            code.replaceWith(div);
        });
        
        if (typeof mermaid !== 'undefined') {
            await mermaid.run();
        }

        // Показываем sidebar для wiki-страниц
        if (path.startsWith('wiki/')) {
            sidebar.hidden = false;
            generateTOC();
        }

    } catch (e) {
        console.error('❌ Ошибка загрузки:', e);
        const lang = (typeof i18n !== 'undefined' && i18n && i18n.currentLang) 
            ? i18n.currentLang 
            : 'ru';
        content.innerHTML = `
            <div class="error-page">
                <h2>❌ 404</h2>
                <p>Файл <code>content/${lang}/${path}.md</code> не найден.</p>
                <p style="color:#6b778c;font-size:14px;margin-top:8px;">
                    Проверьте, что файл существует в папке <code>content/${lang}/</code>
                </p>
                <a href="#/readme" style="color:#0052cc;text-decoration:none;display:inline-block;margin-top:16px;">← Вернуться на главную</a>
            </div>
        `;
    }
}

// Генерация оглавления (без изменений)
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

    toc.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.getElementById(link.hash.slice(1));
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    });

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

// Перезагрузка при смене языка
function reloadContent() {
    render();
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Ждем, пока i18n загрузится
    if (typeof i18n !== 'undefined') {
        render();
    } else {
        // Если i18n еще не загружен, ждем событие
        document.addEventListener('i18nReady', function() {
            render();
        });
        // Fallback: пробуем через 500ms
        setTimeout(() => {
            if (typeof i18n !== 'undefined') {
                render();
            } else {
                console.warn('⚠️ i18n не загружен, используем русский язык по умолчанию');
                render();
            }
        }, 500);
    }
    
    document.addEventListener('languageChanged', function(e) {
        console.log(`🔄 Язык изменен на: ${e.detail.lang} → Перезагружаем контент`);
        reloadContent();
    });
});

window.addEventListener('hashchange', render);