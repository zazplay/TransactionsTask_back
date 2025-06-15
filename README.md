# API для транзакций с MongoDB

Приложение на NestJS с интеграцией MongoDB для работы с транзакциями.

## Требования

- Node.js (версия 16 или выше)
- npm или yarn
- MongoDB (локальная установка или MongoDB Atlas)

## Локальная настройка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd NewTask1
```

### 2. Установка зависимостей

```bash
npm install
# или
yarn install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корневой директории проекта:

```env
# База данных
MONGODB_URI=mongodb://localhost:27017/transactions-db
# или для MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/transactions-db

# Порт приложения
PORT=3000

# JWT секрет (если используется аутентификация)
JWT_SECRET=your-secret-key
```

### 4. Настройка MongoDB

#### Локальная установка MongoDB:
1. Установите MongoDB Community Server с официального сайта
2. Запустите MongoDB сервис:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb/brew/mongodb-community`
   - Linux: `sudo systemctl start mongod`

#### Или используйте MongoDB Atlas:
1. Создайте аккаунт на [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Создайте новый кластер
3. Получите строку подключения и добавьте её в `.env`

### 5. Запуск приложения

#### Режим разработки:
```bash
npm run start:dev
# или
yarn start:dev
```

#### Продакшн режим:
```bash
npm run build
npm run start:prod
# или
yarn build
yarn start:prod
```

## Доступ к приложению

- **API**: http://localhost:3000
- **Swagger документация**: http://localhost:3000/api

## Полезные команды

```bash
# Запуск тестов
npm run test

# Запуск e2e тестов
npm run test:e2e

# Линтинг кода
npm run lint

# Форматирование кода
npm run format
```

## Структура проекта

```
src/
├── main.ts              # Точка входа приложения
├── app.module.ts        # Корневой модуль
├── modules/             # Модули приложения
├── schemas/             # MongoDB схемы
├── dto/                 # Data Transfer Objects
└── common/              # Общие утилиты и декораторы
```

## Troubleshooting

### Проблемы с подключением к MongoDB
- Убедитесь, что MongoDB запущен
- Проверьте правильность строки подключения в `.env`
- Для MongoDB Atlas проверьте настройки Network Access

### Ошибки при установке зависимостей
- Очистите кэш: `npm cache clean --force`
- Удалите node_modules и package-lock.json, затем переустановите
