# Presentation Flow

## 1. Introduction (30 seconds)

### Project Name

```txt
Whisk & Wonder
```

### Project Type

```txt
Afternoon Tea Reservation & Ordering System
```

### Project Goal

Develop a fullstack restaurant reservation platform that supports:

- Reservation management
- Automatic table assignment
- Menu browsing
- Order management
- Payment tracking
- Admin management

---

# 2. Problem Background (45 seconds)

Many restaurants still manage reservations manually.

Common problems:

- Double booking
- Difficult table management
- Manual reservation tracking
- No centralized ordering system
- Difficult payment tracking

Whisk & Wonder was designed to solve these operational problems through a modern reservation backend system.

---

# 3. Technology Stack (45 seconds)

## Frontend

```txt
Next.js
TypeScript
Tailwind CSS
```

## Backend

```txt
NestJS
Prisma ORM
PostgreSQL
```

## Deployment

```txt
Railway
Supabase
Swagger
```

---

# 4. Frontend Demonstration (2 minutes)

## Landing Page

Demonstrate:

- Restaurant branding
- Afternoon tea concept
- Reservation CTA
- Responsive design

---

## Reservation Flow

Demonstrate:

```txt
Select reservation date
→ Select time slot
→ Input guest information
→ Submit reservation
```

Explain:

- Reservation validation
- User-friendly reservation flow

---

## Menu Browsing

Demonstrate:

- Menu categories
- Afternoon tea packages
- Dessert and drink menus

Explain:

```txt
Public users can browse menus before creating reservations.
```

---

## Admin Dashboard (If Available)

Demonstrate:

- Reservation management
- Table management
- Menu management
- Order monitoring

---

# 5. Backend Demonstration (3 minutes)

## Swagger API Documentation

Open:

```txt
/api
```

Demonstrate:

- Endpoint structure
- Request body examples
- Protected routes
- JWT authorization

---

## Authentication Flow

Demonstrate:

```txt
Register
→ Login
→ Receive JWT token
→ Access protected routes
```

Explain:

- JWT authentication
- Role-based authorization

---

## Reservation Logic

Demonstrate:

```txt
Create reservation
→ Validate operating hours
→ Prevent overlapping reservations
→ Automatically assign tables
```

Explain:

- Automatic table assignment
- Reservation conflict prevention
- Reservation ownership filtering

---

## Order & Payment Flow

Demonstrate:

```txt
Create order
→ Calculate totals
→ Create payment
→ Prevent overpayment
```

Explain:

- Order calculation logic
- Payment validation
- Customer ownership protection

---

# 6. Technical Challenges (45 seconds)

Explain key backend challenges solved:

## Reservation Overlap Prevention

Implemented overlap validation to prevent double booking.

---

## Automatic Table Assignment

Implemented table combination logic to optimize seating allocation.

---

## Ownership Authorization

Customers can only access their own:

- Reservations
- Orders
- Payments

---

# 7. Deployment Demonstration (30 seconds)

Explain deployment setup:

```txt
Railway
Supabase PostgreSQL
Environment Variables
Prisma Migration
```

Show:

- Production backend URL
- Swagger production access

---

# 8. Closing (45 seconds)

## Final Result

```txt
✔ Fullstack restaurant reservation platform completed
✔ Reservation system implemented
✔ Automatic table assignment implemented
✔ Order & payment flow implemented
✔ Authentication & authorization implemented
✔ Backend deployed and documented
```

## Final Goal

Build a scalable and production-like reservation management backend using modern fullstack technologies.
