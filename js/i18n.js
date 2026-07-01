// i18n.js - система интернационализации
class I18n {
    constructor() {
        this.currentLang = this.getBrowserLang();
        this.translations = {};
        this.supportedLangs = ['ru', 'en', 'zh', 'de'];
        this.loadTranslations(this.currentLang);
    }

    getBrowserLang() {
        const savedLang = localStorage.getItem('chipgpt-lang');
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            return savedLang;
        }
        const browserLang = navigator.language.split('-')[0];
        return this.supportedLangs.includes(browserLang) ? browserLang : 'ru';
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`../locales/${lang}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.translations = await response.json();
            this.currentLang = lang;
            localStorage.setItem('chipgpt-lang', lang);
            this.updateUI();
            this.updateLanguageButtons();
            
            // 🔥 ВАЖНО: Триггерим событие для перезагрузки контента
            document.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { lang: this.currentLang } 
            }));
        } catch (error) {
            console.error('Error loading translations:', error);
            if (lang !== 'ru') {
                this.loadTranslations('ru');
            }
        }
    }

    t(key, params = {}) {
        let text = this.translations[key] || key;
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }

    // 🔥 НОВЫЙ МЕТОД: Перевод HTML-контента
    translateHTML(html) {
        if (!html) return html;
        
        // Заменяем все data-i18n атрибуты в HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Переводим элементы с data-i18n
        tempDiv.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.t(key);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });
        
        // Переводим атрибуты с data-i18n-attr
        tempDiv.querySelectorAll('[data-i18n-attr]').forEach(el => {
            const attr = el.getAttribute('data-i18n-attr');
            const key = el.getAttribute('data-i18n');
            el.setAttribute(attr, this.t(key));
        });
        
        return tempDiv.innerHTML;
    }

    switchLang(lang) {
        if (this.supportedLangs.includes(lang) && lang !== this.currentLang) {
            this.loadTranslations(lang);
        }
    }

    updateUI() {
        // Обновляем статические элементы на странице
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });

        if (this.translations.site_title) {
            document.title = this.translations.site_title;
        }

        document.documentElement.lang = this.currentLang;
    }

    updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

const i18n = new I18n();

document.addEventListener('DOMContentLoaded', function() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            i18n.switchLang(lang);
        });
        
        const lang = btn.getAttribute('data-lang');
        if (lang === i18n.currentLang) {
            btn.classList.add('active');
        }
    });

    const label = document.querySelector('.language-label');
    if (label && i18n.translations.language_selector) {
        label.textContent = i18n.t('language_selector');
    }
});