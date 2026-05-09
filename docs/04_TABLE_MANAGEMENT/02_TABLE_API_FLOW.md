# Table API Flow

## 1. Overview

The Table API manages restaurant table data for Whisk & Wonder.

Table data is used by the reservation system to assign available tables automatically during reservation creation.

---

## 2. Table Endpoints

| Method | Endpoint      | Access | Description       |
| ------ | ------------- | ------ | ----------------- |
| POST   | `/tables`     | Admin  | Create new table  |
| GET    | `/tables`     | Admin  | Get all tables    |
| GET    | `/tables/:id` | Admin  | Get table by ID   |
| PATCH  | `/tables/:id` | Admin  | Update table      |
| DELETE | `/tables/:id` | Admin  | Soft delete table |

---

## 3. Create Table Flow

```txt
Admin sends create table request
→ Backend validates request body
→ Backend checks table data
→ Backend creates table
→ Backend returns created table
```

### Example Request

```http
POST /tables
```

```json
{
  "tableNumber": "T01",
  "capacity": 4,
  "status": "available"
}
```

### Example Response

```json
{
  "message": "Table created successfully",
  "data": {
    "id": "table-id",
    "tableNumber": "T01",
    "capacity": 4,
    "status": "available"
  }
}
```

---

## 4. Get All Tables Flow

```http
GET /tables
```

Expected result:

```txt
Backend returns all active table records.
```

---

## 5. Get Table by ID Flow

```http
GET /tables/:id
```

Expected result:

```txt
Backend returns one table record based on the requested table ID.
```

---

## 6. Update Table Flow

```http
PATCH /tables/:id
```

Example request:

```json
{
  "capacity": 6,
  "status": "available"
}
```

Expected result:

```txt
Backend updates the selected table data.
```

---

## 7. Soft Delete Table Flow

```http
DELETE /tables/:id
```

Expected result:

```txt
Backend marks the table as deleted or inactive without permanently removing the data.
```

---

## 8. Reservation Integration Flow

The reservation system uses table data during booking creation.

```txt
Customer creates reservation
→ Backend checks overlapping reservations
→ Backend excludes already reserved tables
→ Backend finds available tables
→ Backend selects best table combination
→ Backend creates reservation with assigned tables
```

---

## 9. Table Assignment Logic

The backend table assignment algorithm:

- Sorts available tables by capacity
- Finds the best matching capacity
- Minimizes unused seats
- Minimizes number of tables used
- Supports multiple tables for one reservation

---

## 10. Access Control

All table management endpoints are admin-only.

Required access:

```txt
Valid JWT token + ADMIN role
```

If a non-admin user accesses table management endpoints, the request should be rejected.

---

## 11. API Flow Goal

The Table API is designed to support admin table management and automatic reservation table assignment.
