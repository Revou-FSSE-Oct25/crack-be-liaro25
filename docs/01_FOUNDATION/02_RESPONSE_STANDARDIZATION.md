# Response Standardization

## 1. Overview

Whisk & Wonder Backend API uses standardized JSON responses to maintain consistency across all endpoints.

Standardized responses help:

- Improve frontend integration
- Simplify API debugging
- Create predictable API behavior
- Improve developer experience
- Maintain scalable backend structure

---

## 2. Standard Success Response

Successful API requests return a structured JSON response.

Example:

```json
{
  "message": "Request successful",
  "data": {}
}
```

---

## 3. Standard Create Response

Example successful resource creation response:

```json
{
  "message": "Reservation created successfully",
  "data": {
    "id": "reservation-id",
    "guestName": "Lia",
    "guestCount": 4,
    "status": "PENDING"
  }
}
```

---

## 4. Standard Authentication Response

Example login response:

```json
{
  "message": "Login successful",
  "access_token": "jwt_token_here",
  "user": {
    "id": "user-id",
    "name": "Lia",
    "email": "lia@example.com",
    "role": "CUSTOMER"
  }
}
```

---

## 5. Standard Error Response

### Validation Error

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password should not be empty"],
  "error": "Bad Request"
}
```

---

### Unauthorized Error

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

### Forbidden Error

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

### Not Found Error

```json
{
  "statusCode": 404,
  "message": "Reservation not found"
}
```

---

### Conflict Error

```json
{
  "statusCode": 409,
  "message": "Reservation slot already booked"
}
```

---

## 6. Success Response Structure

| Field   | Type         | Description            |
| ------- | ------------ | ---------------------- |
| message | String       | Response message       |
| data    | Object/Array | Returned resource data |

Example:

```json
{
  "message": "Users retrieved successfully",
  "data": []
}
```

---

## 7. Error Response Structure

| Field      | Type         | Description       |
| ---------- | ------------ | ----------------- |
| statusCode | Number       | HTTP status code  |
| message    | String/Array | Error description |
| error      | String       | Error category    |

---

## 8. Authentication Response Structure

| Field        | Type   | Description                   |
| ------------ | ------ | ----------------------------- |
| message      | String | Authentication result message |
| access_token | String | JWT token                     |
| user         | Object | Logged-in user information    |

---

## 9. Validation Response Structure

Validation errors may return multiple messages.

Example:

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 10. HTTP Status Code Usage

| Status Code | Meaning                        |
| ----------- | ------------------------------ |
| 200         | Request successful             |
| 201         | Resource created successfully  |
| 400         | Validation or bad request      |
| 401         | Unauthorized access            |
| 403         | Forbidden access               |
| 404         | Resource not found             |
| 409         | Conflict or duplicate resource |
| 500         | Internal server error          |

---

## 11. API Response Goals

The response standardization aims to:

- Maintain consistent API behavior
- Improve frontend integration
- Simplify debugging process
- Improve API readability
- Create scalable backend structure
- Support production-oriented API practices
