# Environment Configuration

## 1. Overview

The Whisk & Wonder backend uses environment variables to manage sensitive configuration values.

Environment variables are stored inside:

```txt
.env
```

---

## 2. Required Environment Variables

| Variable     | Description                       |
| ------------ | --------------------------------- |
| DATABASE_URL | Prisma pooled database connection |
| DIRECT_URL   | Direct PostgreSQL connection      |
| JWT_SECRET   | JWT token secret                  |
| PORT         | Backend server port               |

---

## 3. Example Environment Configuration

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=3000
```

---

## 4. DATABASE_URL

Used for:

- Prisma queries
- Application runtime database connection

Recommended setup:

```txt
Supabase connection pooling
```

---

## 5. DIRECT_URL

Used for:

- Prisma migrations
- Direct database operations

Recommended setup:

```txt
Direct PostgreSQL connection
```

---

## 6. JWT_SECRET

Used for:

- JWT token generation
- JWT token validation
- Protected route authentication

Example:

```env
JWT_SECRET="super-secret-key"
```

---

## 7. PORT

Defines backend server port.

Example:

```env
PORT=3000
```

---

## 8. Environment Security Notes

Important security practices:

```txt
✔ Do not commit .env to GitHub
✔ Use strong JWT secrets
✔ Use production database credentials securely
✔ Configure Railway environment variables properly
```

---

## 9. Railway Environment Setup

Environment variables should also be configured in:

```txt
Railway Project Variables
```

This ensures production deployment works correctly.

---

## 10. Configuration Goal

The environment configuration setup is designed to support secure and flexible backend deployment across development and production environments.
