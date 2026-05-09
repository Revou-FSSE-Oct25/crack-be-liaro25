# Payment Feature

## 1. Overview

The payment feature manages payment records connected to customer orders.

The system supports multiple payment methods, payment types, payment status handling, remaining balance calculation, and customer ownership access.

---

## 2. Feature Goals

The payment feature is designed to:

- Create payments for orders
- Validate order existence
- Prevent overpayment
- Calculate remaining balance
- Auto-update order status after full payment
- Support refund and failed payment handling
- Support customer ownership access
- Support admin-only payment management

---

## 3. Payment Management Scope

The payment system includes:

- Create payment for order
- Get all payments
- Get payment by ID
- Get customer’s own payments
- Refund payment
- Mark payment as failed

---

## 4. Payment Module

Generated backend components:

```txt
PaymentsModule
PaymentsService
PaymentsController
```

---

## 5. Schema Integration

The payment system is connected with the following Prisma models:

```txt
Payment
Order
Reservation
```

---

## 6. Supported Payment Statuses

```txt
unpaid
paid
failed
refunded
```

---

## 7. Supported Payment Methods

```txt
cash
bank_transfer
credit_card
e_wallet
```

---

## 8. Supported Payment Types

```txt
full_payment
deposit
```

---

## 9. Authorization

The payment system uses:

```txt
✔ JWT authentication
✔ Role-based access control
✔ Customer ownership filtering
```

Customers can view their own payments.  
Admins can manage all payments.

---

## 10. DTO Validation

The payment system validates:

- Payment amount
- UUID fields
- Payment method enum
- Payment status enum
- Payment type enum
- Numeric values

---

## 11. Expected Result

The payment feature allows:

- Payments to be connected to orders
- Customers to view their own payments
- Admin users to manage all payments
- Overpayments to be prevented
- Order status to update automatically after successful payment
- Invalid requests to be rejected through DTO validation

---

## 12. Related Documentation

More detailed documentation is separated into:

```txt
04_PAYMENT_API_FLOW.md
05_ORDER_PAYMENT_TESTING.md
```

---

## 13. Feature Goal

The payment feature is designed to support secure payment tracking and order payment completion for Whisk & Wonder.
