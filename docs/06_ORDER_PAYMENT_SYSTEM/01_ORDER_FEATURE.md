# Order Feature

## 1. Overview

The order feature manages customer orders connected to reservations in the Whisk & Wonder backend system.

Orders can include both individual menu items and menu packages. The system calculates subtotal, tax, and total amount automatically.

---

## 2. Feature Goals

The order feature is designed to:

- Create orders linked to reservations
- Support individual menu items
- Support menu packages
- Calculate subtotal, tax, and total amount
- Prevent duplicate orders for the same reservation
- Support customer ownership access
- Support admin-only order management
- Validate order request data

---

## 3. Order Management Scope

The order system includes:

- Create order from reservation
- Get all orders
- Get order by ID
- Get customer’s own orders
- Update order status
- Cancel order

---

## 4. Order Module

Generated backend components:

```txt
OrdersModule
OrdersService
OrdersController
```

---

## 5. Schema Integration

The order system is connected with the following Prisma models:

```txt
Order
OrderItem
Reservation
MenuItem
MenuPackage
```

This allows orders to be linked with reservations, menu items, and menu packages.

---

## 6. Order Creation Logic

When creating an order, the backend validates:

- Reservation existence
- Customer ownership
- Menu item existence
- Menu package existence
- Duplicate order prevention
- Order item quantity
- Order package quantity

The backend then calculates:

- Subtotal
- Tax
- Total amount

---

## 7. Supported Order Items

Orders can include:

- Individual menu items
- Menu packages

Example:

```txt
Order
→ Matcha Cheesecake
→ Earl Grey Tea
→ Afternoon Tea Set
```

---

## 8. Order Status

Supported order statuses:

```txt
pending
confirmed
cancelled
completed
```

---

## 9. Authorization

The order system uses:

```txt
✔ JWT authentication
✔ Role-based access control
✔ Customer ownership filtering
```

### Customer Access

Customers can:

- Create orders for their own reservations
- View their own orders
- View their own order details

### Admin Access

Admins can:

- View all orders
- Update order status
- Cancel orders
- Manage order records

---

## 10. DTO Validation

The order system uses DTO validation with:

- class-validator
- nested validation
- UUID validation
- enum validation
- numeric validation

---

## 11. Expected Result

The order feature allows:

- Customers to place orders linked to reservations
- Orders to include menu items and packages
- Admin users to manage all orders
- Customers to only access their own orders
- Order totals to be calculated automatically
- Invalid requests to be rejected through DTO validation
- Duplicate orders for the same reservation to be prevented

---

## 12. Related Documentation

More detailed documentation is separated into:

```txt
02_ORDER_API_FLOW.md
05_ORDER_PAYMENT_TESTING.md
```

---

## 13. Feature Goal

The order feature is designed to connect reservations with menu ordering and prepare the backend for payment processing.
