# Table Feature

## 1. Overview

The table feature manages restaurant table data and supports automatic table assignment for the Whisk & Wonder reservation system.

This feature allows the backend to assign the best available table combination based on guest count, reservation time, and table availability.

---

## 2. Feature Goals

The table feature is designed to:

- Manage restaurant table records
- Support admin table CRUD operations
- Prevent double booking
- Support automatic table assignment
- Support many-to-many reservation and table relationships
- Improve reservation capacity management

---

## 3. Table Management Scope

Admin users can manage table data through CRUD operations.

The table management system includes:

- Create table
- Get all tables
- Get table by ID
- Update table
- Soft delete table
- Manage table status

---

## 4. Table Assignment Scope

The reservation system uses table data to automatically assign suitable tables during reservation creation.

The backend checks:

- Available tables
- Table capacity
- Reservation date
- Reservation start time
- Reservation end time
- Existing overlapping reservations

---

## 5. Table Combination Logic

The backend supports selecting one or more tables for a reservation.

This allows the system to handle larger guest groups by combining tables when needed.

Example:

```txt
Guest count: 6

Available tables:
- Table A: capacity 2
- Table B: capacity 4

Result:
Table A + Table B can be assigned together.
```

---

## 6. Reservation Relationship

The system supports a many-to-many relationship between reservations and tables.

```txt
One reservation can use multiple tables.
One table can be used by many reservations at different times.
```

This structure makes table allocation more flexible and realistic for restaurant operations.

---

## 7. Admin Access

Table management is restricted to admin users.

Required access:

```txt
Valid JWT token + ADMIN role
```

---

## 8. Related Documentation

More detailed documentation is separated into:

```txt
02_TABLE_API_FLOW.md
03_TABLE_VALIDATION.md
04_TABLE_TESTING.md
```

---

## 9. Feature Goal

The table feature is designed to support accurate table allocation, prevent double booking, and improve reservation management for Whisk & Wonder.
