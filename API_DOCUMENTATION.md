# API Документация

## Базовая информация

- **Base URL**: `http://localhost:3000`
- **Формат данных**: JSON
- **Аутентификация**: Bearer Token (JWT)

### Аутентификация

Для доступа к защищенным endpoints необходимо передавать JWT токен в заголовке `Authorization`:

```
Authorization: Bearer <your_jwt_token>
```

Токен можно получить через endpoints регистрации (`/auth/register`) или входа (`/auth/login`). Токен действителен 24 часа.

## Endpoints

### Авторизация

#### POST /auth/register
Регистрация нового пользователя

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "login": "username",
  "password": "password123"
}
```

**Пример ответа:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "email": "user@example.com",
    "login": "username",
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-01T10:30:00.000Z"
  }
}
```

**Коды ошибок:**
- `409`: Пользователь с таким email или логином уже существует

#### POST /auth/login
Вход в систему

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Пример ответа:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "email": "user@example.com",
    "login": "username",
    "createdAt": "2023-12-01T10:30:00.000Z",
    "updatedAt": "2023-12-01T10:30:00.000Z"
  }
}
```

**Коды ошибок:**
- `401`: Неверные учетные данные

#### GET /auth/profile
Получение профиля текущего пользователя

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Пример ответа:**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "email": "user@example.com",
  "login": "username",
  "createdAt": "2023-12-01T10:30:00.000Z",
  "updatedAt": "2023-12-01T10:30:00.000Z"
}
```

**Коды ошибок:**
- `401`: Неавторизован (отсутствует или невалидный токен)

### Транзакции

> **Примечание**: Все endpoints для работы с транзакциями требуют авторизации. Необходимо передавать JWT токен в заголовке `Authorization: Bearer <token>`.

#### GET /transactions
Получить список всех транзакций

**Параметры запроса:**
- `page` (optional): Номер страницы (по умолчанию: 1)
- `limit` (optional): Количество записей на странице (по умолчанию: 10)
- `type` (optional): Тип транзакции (income/expense)
- `category` (optional): Категория транзакции

**Пример запроса:**
```http
GET /transactions?page=1&limit=10&type=income
```

**Пример ответа:**
```json
{
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "amount": 1000,
      "type": "income",
      "category": "salary",
      "description": "Зарплата",
      "date": "2023-12-01T00:00:00.000Z",
      "createdAt": "2023-12-01T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### POST /transactions
Создать новую транзакцию

**Тело запроса:**
```json
{
  "amount": 1500,
  "type": "expense",
  "category": "food",
  "description": "Покупка продуктов",
  "date": "2023-12-01T00:00:00.000Z"
}
```

**Пример ответа:**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
  "amount": 1500,
  "type": "expense",
  "category": "food",
  "description": "Покупка продуктов",
  "date": "2023-12-01T00:00:00.000Z",
  "createdAt": "2023-12-01T11:00:00.000Z"
}
```

#### GET /transactions/:id
Получить транзакцию по ID

**Параметры пути:**
- `id`: ID транзакции

**Пример ответа:**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "amount": 1000,
  "type": "income",
  "category": "salary",
  "description": "Зарплата",
  "date": "2023-12-01T00:00:00.000Z",
  "createdAt": "2023-12-01T10:30:00.000Z"
}
```

#### PUT /transactions/:id
Обновить транзакцию

**Параметры пути:**
- `id`: ID транзакции

**Тело запроса:**
```json
{
  "amount": 1200,
  "description": "Обновленное описание"
}
```

#### DELETE /transactions/:id
Удалить транзакцию

**Параметры пути:**
- `id`: ID транзакции

**Ответ:**
```json
{
  "message": "Транзакция успешно удалена"
}
```

### Статистика

#### GET /transactions/stats
Получить статистику по транзакциям

**Параметры запроса:**
- `startDate` (optional): Начальная дата (YYYY-MM-DD)
- `endDate` (optional): Конечная дата (YYYY-MM-DD)

**Пример ответа:**
```json
{
  "totalIncome": 15000,
  "totalExpense": 8500,
  "balance": 6500,
  "transactionCount": 45,
  "categoryStats": {
    "income": {
      "salary": 12000,
      "freelance": 3000
    },
    "expense": {
      "food": 3500,
      "transport": 2000,
      "entertainment": 3000
    }
  }
}
```

### Категории

#### GET /categories
Получить список всех категорий

**Пример ответа:**
```json
{
  "income": ["salary", "freelance", "investment", "gift"],
  "expense": ["food", "transport", "entertainment", "bills", "shopping"]
}
```

## Коды ошибок

| Код | Описание |
|-----|----------|
| 200 | Успешный запрос |
| 201 | Ресурс создан |
| 400 | Неверный запрос |
| 401 | Не авторизован |
| 404 | Ресурс не найден |
| 422 | Ошибка валидации |
| 500 | Внутренняя ошибка сервера |

## Примеры использования

### Регистрация пользователя

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "login": "username",
    "password": "password123"
  }'
```

### Вход в систему

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Получение профиля (с токеном)

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Создание транзакции с помощью curl

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 2000,
    "type": "income",
    "category": "freelance",
    "description": "Фриланс проект",
    "date": "2023-12-01T00:00:00.000Z"
  }'
```

### Получение статистики за период

```bash
curl "http://localhost:3000/transactions/stats?startDate=2023-12-01&endDate=2023-12-31"
```

## Валидация данных

### Создание/обновление транзакции

- `amount`: Обязательное поле, положительное число
- `type`: Обязательное поле, должно быть "income" или "expense"
- `category`: Обязательное поле, строка
- `description`: Опциональное поле, строка (максимум 200 символов)
- `date`: Опциональное поле, дата в формате ISO 8601

## Swagger документация

Для интерактивной работы с API используйте Swagger UI по адресу:
`http://localhost:3000/api`
