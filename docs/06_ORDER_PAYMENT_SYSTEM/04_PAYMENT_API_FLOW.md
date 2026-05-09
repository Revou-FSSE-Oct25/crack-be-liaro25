# Payment API Flow

## 1. Overview

The Payment API manages payment records connected to customer orders.

The backend validates order ownership, prevents overpayment, calculates remaining balance, and updates order status after successful payment.

---

## 2. Payment Endpoints

| Method | Endpoint               | Access         | Description                 |
| ------ | ---------------------- | -------------- | --------------------------- |
| POST   | `/payments`            | Customer       | Create payment              |
| GET    | `/payments`            | Admin          | Get all payments            |
| GET    | `/payments/my`         | Customer       | Get customer’s own payments |
| GET    | `/payments/:id`        | Customer/Admin | Get payment by ID           |
| PATCH  | `/payments/:id/refund` | Admin          | Refund payment              |
| PATCH  | `/payments/:id/fail`   | Admin          | Mark payment as failed      |

---

## 3. Create Payment Flow

```txt
Customer sends payment request
→ Backend validates JWT token
→ Backend validates order existence
→ Backend validates customer ownership
→ Backend checks previous payments
→ Backend calculates remaining balance
→ Backend prevents overpayment
→ Backend creates payment record
→ Backend updates order status if fully paid
→ Backend returns payment response
```

---

## 4. Example Create Payment Request

```http
POST /payments
```

```json
{
  "orderId": "order-id",
  "amount": 5720,
  "paymentMethod": "credit_card",
  "paymentType": "full_payment"
}
```

---

## 5. Example Success Response

```json
{
  "message": "Payment created successfully",
  "data": {
    "id": "payment-id",
    "orderId": "order-id",
    "amount": 5720,
    "paymentMethod": "credit_card",
    "paymentType": "full_payment",
    "status": "paid"
  }
}
```

---

## 6. Remaining Balance Logic

The backend calculates remaining balance using:

```txt
Remaining balance = Order total amount - Total successful payments
```

If payment amount is greater than remaining balance, the request is rejected.

---

## 7. Full Payment Behavior

If payment covers the remaining balance:

```txt
Payment status becomes paid
Order payment status is updated
Order can move to confirmed or completed depending on implementation
```

---

## 8. Deposit Payment Behavior

If payment is a deposit:

```txt
Payment is recorded
Remaining balance is recalculated
Order remains partially paid until full amount is completed
```

---

## 9. Refund Payment Flow

```http
PATCH /payments/:id/refund
```

Required access:

```txt
Valid JWT token + ADMIN role
```

Expected result:

```txt
Payment status is updated to refunded.
```

---

## 10. Failed Payment Flow

```http
PATCH /payments/:id/fail
```

Required access:

```txt
Valid JWT token + ADMIN role
```

Expected result:

```txt
Payment status is updated to failed.
```

---

## 11. Error Response Examples

### Overpayment

```json
{
  "statusCode": 400,
  "message": "Payment amount exceeds remaining balance",
  "error": "Bad Request"
}
```

### Order Not Found

```json
{
  "statusCode": 404,
  "message": "Order not found",
  "error": "Not Found"
}
```

### Forbidden Access

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

## 12. Payment API Goal

The Payment API is designed to track payment progress, prevent invalid payments, and connect order completion with payment status.
