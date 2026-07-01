// i18n.js

class I18n {
    constructor() {
        this.supportedLangs = ['ru', 'en', 'zh', 'de', 'it'];
        this.translations = {};
        this.currentLang = 'ru'; // Значение по умолчанию
        
        // Инициализация с защитой от ошибок
        try {
            this.currentLang = this.getBrowserLang();
            this.loadTranslations(this.currentLang);
        } catch (error) {
            console.error('❌ Ошибка инициализации i18n:', error);
            this.currentLang = 'ru';
            // Пробуем загрузить русский язык как fallback
            this.loadTranslations('ru');
        }
    }

    getBrowserLang() {
        try {
            const savedLang = localStorage.getItem('chipgpt-lang');
            if (savedLang && this.supportedLangs.includes(savedLang)) {
                return savedLang;
            }
        } catch (e) {
            console.warn('⚠️ Не удалось прочитать localStorage:', e);
        }
        
        try {
            const browserLang = navigator.language.split('-')[0];
            if (this.supportedLangs.includes(browserLang)) {
                return browserLang;
            }
        } catch (e) {
            console.warn('⚠️ Не удалось определить язык браузера:', e);
        }
        
        return 'ru'; // Fallback
    }

    async loadTranslations(lang) {
        try {
            // Пробуем загрузить JSON
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} - locales/${lang}.json`);
            }
            this.translations = await response.json();
            this.currentLang = lang;
            
            // Сохраняем в localStorage
            try {
                localStorage.setItem('chipgpt-lang', lang);
            } catch (e) {
                console.warn('⚠️ Не удалось сохранить язык в localStorage:', e);
            }
            
            this.updateUI();
            this.updateLanguageButtons();
            
            document.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { lang: this.currentLang } 
            }));
            
            console.log(`✅ Язык загружен: ${lang}`);
        } catch (error) {
            console.error(`❌ Ошибка загрузки языка ${lang}:`, error);
            
            // Если не удалось загрузить запрошенный язык, пробуем русский
            if (lang !== 'ru') {
                console.log('🔄 Пробуем загрузить русский язык как fallback');
                await this.loadTranslations('ru');
            } else {
                // Если даже русский не загрузился, создаем пустые переводы
                console.warn('⚠️ Не удалось загрузить ни один язык, используем ключи как текст');
                this.translations = {};
                this.currentLang = 'ru';
                this.updateUI();
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

    getContentPath(route) {
        return `content/${this.currentLang}/${route}.md`;
    }

    switchLang(lang) {
        if (this.supportedLangs.includes(lang) && lang !== this.currentLang) {
            this.loadTranslations(lang);
        }
    }

    updateUI() {
        try {
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
        } catch (error) {
            console.warn('⚠️ Ошибка обновления UI:', error);
        }
    }

    updateLanguageButtons() {
        try {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                const lang = btn.getAttribute('data-lang');
                btn.classList.toggle('active', lang === this.currentLang);
            });
        } catch (error) {
            console.warn('⚠️ Ошибка обновления кнопок языков:', error);
        }
    }
}

// Создаем глобальный экземпляр с защитой
let i18n;
try {
    i18n = new I18n();
    console.log('✅ i18n инициализирован');
} catch (error) {
    console.error('❌ Критическая ошибка i18n:', error);
    // Создаем заглушку, чтобы сайт не падал
    i18n = {
        currentLang: 'ru',
        supportedLangs: ['ru', 'en', 'zh', 'de', 'it'],
        translations: {},
        t: (key) => key,
        getContentPath: (route) => `content/ru/${route}.md`,
        switchLang: () => {},
        updateUI: () => {}
    };
}

// Инициализация кнопок после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    try {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                if (i18n && i18n.switchLang) {
                    i18n.switchLang(lang);
                }
            });
            
            if (i18n && i18n.currentLang && btn.getAttribute('data-lang') === i18n.currentLang) {
                btn.classList.add('active');
            }
        });
    } catch (error) {
        console.warn('⚠️ Ошибка инициализации кнопок языков:', error);
    }
});