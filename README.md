# Менеджер учетных записей

[![Статус деплоя](https://img.shields.io/badge/vercel-deployed-success)](https://saasoft-test-case.vercel.app/)
[![Vue Version](https://img.shields.io/badge/vue-3.5-42b883)](https://vuejs.org/)
[![PrimeVue](https://img.shields.io/badge/primevue-4.3-blue)](https://primevue.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8-blue)](https://www.typescriptlang.org/)

Приложение для управления учетными записями с функциями создания, редактирования и удаления.
Демо доступно по ссылке: [https://saasoft-test-case.vercel.app/](https://saasoft-test-case.vercel.app/)

## Скриншот приложения

![Скриншот приложения](./public/screenshot.png)

## Функциональность

- 🔒 Поддержка учетных записей двух типов: LOCAL и LDAP
- 🏷️ Добавление меток к учетным записям с их валидацией
- 🔑 Управление учетными данными (логин, пароль)
- 🗑️ Удаление учетных записей с подтверждением
- 💾 Автоматическое сохранение данных в localStorage
- 📱 Адаптивный и современный интерфейс
- 🔄 Отзывчивый UX с анимациями

## Технологии

- **Frontend**: Vue 3 + TypeScript + Pinia
- **UI компоненты**: PrimeVue 4
- **CSS Utilities**: PrimeFlex
- **Иконки**: PrimeIcons
- **Сборка**: Vite
- **Линтинг**: ESLint + Prettier

## Структура проекта

```
/src
├── assets/          # Статические ресурсы
├── components/      # Vue компоненты
│   ├── AppForms.vue      # Управление формами учетных записей
│   ├── AppHeader.vue     # Заголовок приложения
│   └── AppTip.vue        # Подсказки для пользователя
├── stores/          # Pinia хранилища
│   └── useAccountsStore.ts  # Управление состоянием учетных записей
├── types/           # TypeScript определения типов
├── views/           # Vue представления (страницы)
│   └── MainView.vue      # Главное представление
└── App.vue          # Корневой компонент
```

## Установка

Для установки и запуска проекта локально вам потребуется Node.js и Yarn.

```bash
# Клонирование репозитория
git clone https://ваш-репозиторий/sass-test-case.git
cd sass-test-case

# Установка зависимостей
yarn

# Запуск dev-сервера
yarn dev
```

## Скрипты

| Команда          | Описание                                       |
| ---------------- | ---------------------------------------------- |
| `yarn dev`       | Запускает dev-сервер для разработки            |
| `yarn build`     | Собирает проект для продакшена                 |
| `yarn preview`   | Предпросмотр собранного проекта                |
| `yarn lint`      | Запускает линтинг с ESLint и автоисправлениями |
| `yarn format`    | Форматирует код с Prettier                     |

## Функции хранилища

Приложение использует Pinia для управления состоянием с основными функциями:

- `addNewAccount()` - Добавляет новую учетную запись
- `updateAccount(id, updates)` - Обновляет существующую учетную запись
- `deleteAccount(id)` - Удаляет учетную запись
- Автоматическое сохранение данных в localStorage с помощью Vue watcher

## Валидация

Приложение обеспечивает валидацию пользовательского ввода:

- Метки: максимум 50 символов
- Логин: максимум 100 символов
- Пароль: максимум 100 символов с индикацией силы пароля
