# Order API Flow

## 1. Overview

The Order API manages customer orders connected to reservations.

Orders can include individual menu items and menu packages. The backend calculates subtotal, tax, and total amount automatically.

---

## 2. Order Endpoints

| Method | Endpoint             | Access         | Description               |
| ------ | -------------------- | -------------- | ------------------------- |
| POST   | `/orders`            | Customer       | Create order              |
| GET    | `/orders`            | Admin          | Get all orders            |
| GET    | `/orders/my`         | Customer       | Get customer’s own orders |
| GET    | `/orders/:id`        | Customer/Admin | Get order by ID           |
| PATCH  | `/orders/:id/status` | Admin          | Update order status       |
| DELETE | `/orders/:id`        | Customer/Admin | Cancel order              |

---

## 3. Create Order Flow

```txt
Customer sends order request
→ Backend validates JWT token
→ Backend validates reservation existence
→ Backend validates customer ownership
→ Backend checks duplicate order for reservation
→ Backend validates menu items and packages
→ Backend calculates subtotal, tax, and total amount
→ Backend creates order and order items
→ Backend returns created order
```

---

## 4. Example Create Order Request

```http
POST /orders
```

```json
{
  "reservationId": "reservation-id",
  "items": [
    {
      "menuItemId": "menu-item-id",
      "quantity": 2
    }
  ],
  "packages": [
    {
      "menuPackageId": "menu-package-id",
      "quantity": 1
    }
  ]
}
```

---

## 5. Example Success Response

```json
{
  "message": "Order created successfully",
  "data": {
    "id": "order-id",
    "reservationId": "reservation-id",
    "subtotal": 5200,
    "tax": 520,
    "totalAmount": 5720,
    "status": "pending"
  }
}
```

---

## 6. Get Customer Orders Flow

```http
GET /orders/my
```

Required header:

```http
Authorization: Bearer <access_token>
```

Expected result:

```txt
Backend returns orders owned by the logged-in customer.
```

---

## 7. Get All Orders Flow

```http
GET /orders
```

Required access:

```txt
Valid JWT token + ADMIN role
```

Expected result:

```txt
Backend returns all orders in the system.
```

---

## 8. Update Order Status Flow

```http
PATCH /orders/:id/status
```

Example request:

```json
{
  "status": "confirmed"
}
```

Supported statuses:

```txt
pending
confirmed
cancelled
completed
```

---

## 9. Cancel Order Flow

```http
DELETE /orders/:id
```

Expected result:

```txt
Order status is updated to cancelled.
```

---

## 10. Order API Goal

The Order API is designed to connect reservation data with customer menu selections and prepare the backend for payment processing.
