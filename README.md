# PROJECT_NAME — Landing Page

Промо-страница для MMORPG в постапокалиптическом сеттинге.

## 🚀 Запуск

Проект — статический сайт, бэкенд не нужен. Любой из способов:

```bash
# Вариант 1: npx serve
npx -y serve .

# Вариант 2: VS Code Live Server
# Установить расширение "Live Server" → ПКМ на index.html → Open with Live Server

# Вариант 3: Python
python -m http.server 3000
```

Откройте `http://localhost:3000` (или порт из Live Server).

## 📁 Структура

```
├── index.html              Главная страница
├── robots.txt              Правила для поисковых роботов
├── sitemap.xml             Карта сайта
├── README.md               Документация
└── assets/
    ├── css/
    │   └── styles.css      Основные стили
    ├── js/
    │   └── main.js         Скрипты
    ├── img/                Изображения (placeholder → реальные ассеты)
    └── fonts/              Кастомные шрифты
```

## 📝 Правила именования

| Сущность | Формат | Пример |
|----------|--------|--------|
| CSS-файлы | `kebab-case.css` | `styles.css`, `hero-section.css` |
| JS-файлы | `camelCase.js` | `main.js`, `scrollReveal.js` |
| Изображения | `kebab-case.webp` | `hero-bg.webp`, `feature-icon-01.webp` |
| CSS-классы | BEM (`block__element--modifier`) | `.header__nav-link--active` |
| CSS-переменные | `--category-name` | `--clr-accent`, `--fs-lg` |
| HTML id/якоря | `kebab-case` | `#about`, `#game-features` |

## 🛠 Технологии

- HTML5, CSS3, Vanilla JS
- Без фреймворков и сборщиков
- Mobile-first, семантическая разметка
- SEO: meta, OG, canonical, sitemap, robots
