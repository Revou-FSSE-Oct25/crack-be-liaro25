# Database Schema

## 1. Database Overview

Whisk & Wonder Backend API uses a relational database to manage users, reservations, tables, menus, orders, and payments.

The database is managed using Prisma ORM with PostgreSQL / Supabase.

---

## 2. Main Database Entities

The main entities in this backend system are:

- User
- Reservation
- Table
- Menu
- Order
- Order Item
- Payment

---

## 3. Entity Relationship Summary

```txt
User → Reservation
User → Order
Reservation → Table
Reservation → Order
Order → Order Item
Order → Payment
Menu → Order Item
```

---

## 4. User Table

The `User` table stores customer and admin account data.

| Field     | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| id        | UUID     | Unique user ID               |
| name      | String   | User full name               |
| email     | String   | Unique user email            |
| password  | String   | Hashed user password         |
| role      | Enum     | User role: CUSTOMER or ADMIN |
| createdAt | DateTime | Record creation time         |
| updatedAt | DateTime | Record update time           |

### Relationship

```txt
User has many Reservations
User has many Orders
```

---

## 5. Reservation Table

The `Reservation` table stores customer booking data.

| Field           | Type     | Description            |
| --------------- | -------- | ---------------------- |
| id              | UUID     | Unique reservation ID  |
| userId          | UUID     | Related user ID        |
| tableId         | UUID     | Related table ID       |
| guestName       | String   | Guest name             |
| guestEmail      | String   | Guest email            |
| guestPhone      | String   | Guest phone number     |
| reservationDate | DateTime | Reservation date       |
| startTime       | String   | Reservation start time |
| endTime         | String   | Reservation end time   |
| guestCount      | Number   | Total number of guests |
| status          | Enum     | Reservation status     |
| createdAt       | DateTime | Record creation time   |
| updatedAt       | DateTime | Record update time     |

### Reservation Status

```txt
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

### Relationship

```txt
Reservation belongs to User
Reservation belongs to Table
Reservation may have one Order
```

---

## 6. Table Table

The `Table` table stores cafe table data.

| Field       | Type     | Description               |
| ----------- | -------- | ------------------------- |
| id          | UUID     | Unique table ID           |
| tableNumber | String   | Table identifier          |
| capacity    | Number   | Maximum seating capacity  |
| status      | Enum     | Table availability status |
| createdAt   | DateTime | Record creation time      |
| updatedAt   | DateTime | Record update time        |

### Table Status

```txt
AVAILABLE
RESERVED
OCCUPIED
MAINTENANCE
```

### Relationship

```txt
Table has many Reservations
```

---

## 7. Menu Table

The `Menu` table stores afternoon tea packages, desserts, and beverages.

| Field       | Type        | Description              |
| ----------- | ----------- | ------------------------ |
| id          | UUID        | Unique menu ID           |
| name        | String      | Menu item name           |
| description | String      | Menu item description    |
| category    | Enum/String | Menu category            |
| price       | Number      | Menu item price          |
| isAvailable | Boolean     | Menu availability status |
| createdAt   | DateTime    | Record creation time     |
| updatedAt   | DateTime    | Record update time       |

### Menu Categories

```txt
AFTERNOON_TEA_PACKAGE
DESSERT
BEVERAGE
SAVORY
SWEET
```

### Relationship

```txt
Menu has many Order Items
```

---

## 8. Order Table

The `Order` table stores customer order records.

| Field         | Type     | Description            |
| ------------- | -------- | ---------------------- |
| id            | UUID     | Unique order ID        |
| userId        | UUID     | Related user ID        |
| reservationId | UUID     | Related reservation ID |
| totalAmount   | Number   | Total order amount     |
| status        | Enum     | Order status           |
| createdAt     | DateTime | Record creation time   |
| updatedAt     | DateTime | Record update time     |

### Order Status

```txt
PENDING
CONFIRMED
PREPARING
COMPLETED
CANCELLED
```

### Relationship

```txt
Order belongs to User
Order belongs to Reservation
Order has many Order Items
Order has one Payment
```

---

## 9. Order Item Table

The `OrderItem` table stores each menu item inside an order.

| Field    | Type   | Description              |
| -------- | ------ | ------------------------ |
| id       | UUID   | Unique order item ID     |
| orderId  | UUID   | Related order ID         |
| menuId   | UUID   | Related menu ID          |
| quantity | Number | Ordered quantity         |
| price    | Number | Menu price at order time |
| subtotal | Number | quantity × price         |

### Relationship

```txt
OrderItem belongs to Order
OrderItem belongs to Menu
```

---

## 10. Payment Table

The `Payment` table stores payment records linked to customer orders.

| Field     | Type        | Description             |
| --------- | ----------- | ----------------------- |
| id        | UUID        | Unique payment ID       |
| orderId   | UUID        | Related order ID        |
| amount    | Number      | Payment amount          |
| method    | Enum/String | Payment method          |
| status    | Enum        | Payment status          |
| paidAt    | DateTime    | Payment completion time |
| createdAt | DateTime    | Record creation time    |
| updatedAt | DateTime    | Record update time      |

### Payment Status

```txt
PENDING
PAID
FAILED
REFUNDED
```

### Payment Method

```txt
CASH
CARD
BANK_TRANSFER
QR_PAYMENT
```

### Relationship

```txt
Payment belongs to Order
```

---

## 11. Database Relationship Diagram

```txt
┌─────────┐
│  User   │
└────┬────┘
     │
     ├──────────────┐
     │              │
┌────▼───────┐  ┌───▼────┐
│Reservation │  │ Order  │
└────┬───────┘  └───┬────┘
     │              │
┌────▼────┐    ┌────▼──────┐
│ Table   │    │OrderItem  │
└─────────┘    └────┬──────┘
                    │
               ┌────▼────┐
               │  Menu   │
               └─────────┘

Order ───────── Payment
```

---

## 12. Database Integrity Rules

The database schema supports integrity through:

- Unique user email
- Required foreign key relationships
- User ownership validation
- Reservation-to-table relationship
- Order-to-payment relationship
- Order item subtotal calculation
- Enum-based status management

---

## 13. Prisma Usage

Prisma ORM is used to:

- Define database models
- Manage database migrations
- Generate Prisma Client
- Execute structured database queries
- Maintain relational database integrity

Common Prisma commands:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

---

## 14. Schema Goal

The database schema is designed to support:

- Secure user management
- Reservation-based cafe operation
- Afternoon tea package ordering
- Admin operational control
- Payment tracking
- Scalable backend development
