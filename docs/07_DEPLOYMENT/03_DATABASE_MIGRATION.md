# Database Migration

## 1. Overview

The Whisk & Wonder backend uses Prisma ORM migrations for database schema management.

Database migrations are used to:

- Create database tables
- Update schema structure
- Maintain schema consistency
- Synchronize Prisma models with PostgreSQL

---

## 2. Prisma Commands

### Generate Prisma Client

```bash
npx prisma generate
```

---

### Create Migration

```bash
npx prisma migrate dev --name migration_name
```

---

### Apply Existing Migrations

```bash
npx prisma migrate deploy
```

---

### Push Schema Without Migration

```bash
npx prisma db push
```

---

## 3. Migration Workflow

Typical workflow:

```txt
Update Prisma schema
→ Generate migration
→ Apply migration
→ Generate Prisma client
→ Test backend
```

---

## 4. Prisma Schema Location

Prisma schema file:

```txt
prisma/schema.prisma
```

---

## 5. Database Provider

Database provider used:

```txt
PostgreSQL
```

Hosted using:

```txt
Supabase
```

---

## 6. Migration Purpose

Database migrations are used to maintain:

- User schema
- Reservation schema
- Table schema
- Menu schema
- Order schema
- Payment schema

---

## 7. Production Migration

Production deployments should use:

```bash
npx prisma migrate deploy
```

This safely applies existing migrations without modifying migration history.

---

## 8. Common Migration Issues

### Prisma Client Outdated

Fix:

```bash
npx prisma generate
```

---

### Database Connection Error

Check:

```txt
DATABASE_URL
DIRECT_URL
Supabase connection settings
```

---

### Schema Mismatch

Fix:

```bash
npx prisma migrate dev
```

or

```bash
npx prisma db push
```

depending on workflow.

---

## 9. Migration Goal

The migration system is designed to maintain database consistency and support scalable backend development.
