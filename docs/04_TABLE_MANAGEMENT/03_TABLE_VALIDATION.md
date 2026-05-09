# Table Validation

## 1. Overview

Table validation ensures that table data is accurate, usable, and safe for the reservation system.

Validation is applied when creating, updating, and assigning tables.

---

## 2. Table Data Validation

| Field       | Validation Rule             |
| ----------- | --------------------------- |
| tableNumber | Required                    |
| capacity    | Required number             |
| status      | Must use valid table status |

---

## 3. Table Number Validation

The table number identifies each restaurant table.

Example:

```txt
T01
T02
T03
```

Validation rules:

- Table number must not be empty
- Table number should be unique
- Table number should be easy to identify

---

## 4. Capacity Validation

Capacity defines how many guests a table can seat.

Validation rules:

- Capacity must be a number
- Capacity must be greater than 0
- Capacity is used for reservation assignment

Example:

```txt
2 guests → table capacity 2 or more
4 guests → table capacity 4 or more
6 guests → table combination may be used
```

---

## 5. Table Status Validation

Valid table status values:

```txt
available
reserved
occupied
maintenance
deleted
```

Status usage:

| Status      | Meaning                           |
| ----------- | --------------------------------- |
| available   | Table can be used for reservation |
| reserved    | Table is already reserved         |
| occupied    | Table is currently in use         |
| maintenance | Table is temporarily unavailable  |
| deleted     | Table is soft deleted or inactive |

---

## 6. Reservation Assignment Validation

During reservation creation, the backend validates:

- Requested guest count
- Reservation date
- Reservation start time
- Reservation end time
- Available tables
- Existing overlapping reservations
- Table capacity combination

---

## 7. Overlap Validation

The backend prevents double booking by checking overlapping reservations.

Overlap logic:

```txt
Existing start time < New end time
AND
Existing end time > New start time
```

If a table is already used by an overlapping reservation, that table is excluded from available table selection.

---

## 8. Available Table Query

The backend only selects tables with:

```txt
status: available
```

Already reserved table IDs from overlapping reservations are excluded.

---

## 9. Best Table Combination Validation

The backend finds the best table combination by:

- Sorting available tables
- Matching guest count
- Minimizing unused seats
- Minimizing number of tables used

Example:

```txt
Guest count: 6

Available tables:
- T01 capacity 2
- T02 capacity 4
- T03 capacity 8

Best result:
T01 + T02

Reason:
Capacity 6 exactly matches guest count.
```

---

## 10. Validation Error Examples

### Invalid Capacity

```json
{
  "statusCode": 400,
  "message": "Capacity must be greater than 0",
  "error": "Bad Request"
}
```

### No Available Table

```json
{
  "statusCode": 400,
  "message": "No available table for the selected guest count",
  "error": "Bad Request"
}
```

### Unauthorized Access

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
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

## 11. Validation Goal

Table validation is designed to:

- Prevent invalid table data
- Support accurate reservation assignment
- Prevent double booking
- Maintain operational table integrity
- Support flexible table combination logic
