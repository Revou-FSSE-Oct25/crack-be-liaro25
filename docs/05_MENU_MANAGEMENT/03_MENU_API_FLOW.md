# Menu API Flow

## 1. Overview

The Menu API manages menu items and menu packages for Whisk & Wonder.

The API supports both public menu browsing and admin-only menu management operations.

---

## 2. Menu Item Endpoints

| Method | Endpoint           | Access | Description           |
| ------ | ------------------ | ------ | --------------------- |
| GET    | `/menus/items`     | Public | Get all menu items    |
| GET    | `/menus/items/:id` | Public | Get menu item by ID   |
| POST   | `/menus/items`     | Admin  | Create menu item      |
| PATCH  | `/menus/items/:id` | Admin  | Update menu item      |
| DELETE | `/menus/items/:id` | Admin  | Soft delete menu item |

---

## 3. Menu Package Endpoints

| Method | Endpoint              | Access | Description              |
| ------ | --------------------- | ------ | ------------------------ |
| GET    | `/menus/packages`     | Public | Get all menu packages    |
| GET    | `/menus/packages/:id` | Public | Get package by ID        |
| POST   | `/menus/packages`     | Admin  | Create menu package      |
| PATCH  | `/menus/packages/:id` | Admin  | Update menu package      |
| DELETE | `/menus/packages/:id` | Admin  | Soft delete menu package |

---

## 4. Public Menu Browsing Flow

```txt
Customer requests menu data
→ Backend retrieves active menu items
→ Backend returns menu list
```

### Example Endpoint

```http
GET /menus/items
```

### Expected Result

```txt
Backend returns all active menu items for public browsing.
```

---

## 5. Create Menu Item Flow

```txt
Admin sends create menu request
→ Backend validates request body
→ Backend creates menu item
→ Backend returns created menu item
```

### Example Request

```http
POST /menus/items
```

```json
{
  "name": "Matcha Cheesecake",
  "description": "Japanese style matcha cheesecake",
  "category": "sweet",
  "price": 1200
}
```

### Example Response

```json
{
  "message": "Menu item created successfully",
  "data": {
    "id": "menu-id",
    "name": "Matcha Cheesecake",
    "category": "sweet",
    "price": 1200
  }
}
```

---

## 6. Update Menu Item Flow

```http
PATCH /menus/items/:id
```

### Example Request

```json
{
  "price": 1400
}
```

### Expected Result

```txt
Menu item data is updated successfully.
```

---

## 7. Soft Delete Menu Item Flow

```http
DELETE /menus/items/:id
```

### Expected Result

```txt
Menu item is marked inactive or soft deleted without permanently removing database data.
```

---

## 8. Menu Package Flow

The backend supports grouped menu packages.

Example package:

```txt
Afternoon Tea Set
→ Sweet items
→ Savoury items
→ Tea selection
```

Packages are prepared for future integration with:

- Order system
- Payment system
- Reservation pre-order flow

---

## 9. Access Control

| Access Type | Permission                     |
| ----------- | ------------------------------ |
| Public      | Browse menu items and packages |
| CUSTOMER    | Browse menu items and packages |
| ADMIN       | Full menu management           |

---

## 10. Protection Used

Protected admin endpoints use:

```txt
✔ JwtAuthGuard
✔ RolesGuard
✔ ADMIN role validation
```

---

## 11. API Flow Goal

The Menu API is designed to support organized menu management and public menu browsing for the Whisk & Wonder platform.
