# Swagger API Documentation

## 1. Overview

Whisk & Wonder Backend API uses Swagger / OpenAPI to provide interactive API documentation.

Swagger helps developers understand, test, and validate API endpoints directly from the browser.

---

## 2. Swagger URL

### Local Development

```txt
http://localhost:3000/api
```

### Base Path

```txt
/api
```

---

## 3. Swagger Purpose

Swagger is used to document:

- Available API endpoints
- Request body structure
- Response examples
- Authentication requirements
- Authorization rules
- DTO validation rules
- API status codes

---

## 4. Swagger Features

Swagger provides:

- Interactive endpoint testing
- Request body preview
- Response schema preview
- JWT bearer token authorization
- API grouping by module
- Developer-friendly API reference

---

## 5. Authentication in Swagger

Protected endpoints require JWT authentication.

After logging in through:

```txt
POST /auth/login
```

Copy the returned access token.

Then click the **Authorize** button in Swagger and enter:

```txt
Bearer <access_token>
```

Example:

```txt
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

After authorization, protected endpoints can be tested directly from Swagger.

---

## 6. Swagger Module Groups

The API endpoints are grouped by module.

Example groups:

- Auth
- Users
- Reservations
- Tables
- Menus
- Orders
- Payments

This makes the API documentation easier to navigate and test.

---

## 7. Public Endpoints

Public endpoints can be accessed without authentication.

Examples:

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| POST   | `/auth/register` | Register new user         |
| POST   | `/auth/login`    | Login user                |
| GET    | `/menus`         | View available menu items |
| GET    | `/tables`        | View table information    |

---

## 8. Protected User Endpoints

Protected user endpoints require a valid JWT token.

Examples:

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| GET    | `/users/profile`   | Get logged-in user profile    |
| PATCH  | `/users/profile`   | Update logged-in user profile |
| GET    | `/reservations/my` | Get user reservation history  |
| GET    | `/orders/my`       | Get user order history        |

---

## 9. Admin Endpoints

Admin endpoints require:

```txt
Valid JWT token + ADMIN role
```

Examples:

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | `/users`      | Get all users    |
| POST   | `/tables`     | Create table     |
| PATCH  | `/tables/:id` | Update table     |
| DELETE | `/tables/:id` | Delete table     |
| POST   | `/menus`      | Create menu item |
| PATCH  | `/menus/:id`  | Update menu item |
| DELETE | `/menus/:id`  | Delete menu item |
| GET    | `/payments`   | Get all payments |

---

## 10. DTO Validation in Swagger

Swagger displays request body fields based on DTO definitions.

Example validation rules:

- Required fields
- Email format
- Minimum string length
- Enum values
- Number fields
- Date fields

Example request body:

```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

---

## 11. Example Swagger Testing Flow

### Customer Flow

```txt
1. Register user
2. Login user
3. Copy JWT token
4. Click Authorize
5. Add Bearer token
6. Create reservation
7. Create order
8. Create payment
```

### Admin Flow

```txt
1. Login as admin
2. Copy admin JWT token
3. Click Authorize
4. Manage tables
5. Manage menus
6. Manage reservations
7. Manage orders
8. Manage payments
```

---

## 12. Swagger Configuration Goal

Swagger documentation is configured to support:

- API testing
- Frontend integration
- Backend review
- Portfolio presentation
- Developer onboarding
- Clear endpoint communication

---

## 13. Notes

Swagger is used as an API reference and testing interface.

Even though endpoints are visible in Swagger, protected and admin endpoints still require authentication and authorization before they can be accessed.
