# Environment Setup

## 1. Overview

Whisk & Wonder Backend API uses environment variables to manage sensitive configuration and deployment settings.

Environment variables are used to keep credentials, database connection strings, JWT secrets, and runtime configuration outside the source code.

---

## 2. Required Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
PORT=
```

---

## 3. Environment Variable Description

| Variable     | Description                                          |
| ------------ | ---------------------------------------------------- |
| DATABASE_URL | Main database connection URL used by the application |
| DIRECT_URL   | Direct database connection URL used for migrations   |
| JWT_SECRET   | Secret key used to sign and verify JWT tokens        |
| PORT         | Application port                                     |

---

## 4. Example Local Configuration

Example `.env` format:

```env
DATABASE_URL="postgresql://username:password@host:6543/database?pgbouncer=true"
DIRECT_URL="postgresql://username:password@host:5432/database"
JWT_SECRET="your-secret-key"
PORT=3000
```

Do not commit real credentials to GitHub.

---

## 5. Database Configuration

This project uses PostgreSQL / Supabase with Prisma ORM.

Prisma uses environment variables to connect to the database.

Common database setup:

```txt
DATABASE_URL → Used by Prisma Client during application runtime
DIRECT_URL   → Used for direct database migration connection
```

---

## 6. Prisma Setup

After configuring `.env`, generate Prisma Client:

```bash
npx prisma generate
```

Run database migration:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

## 7. JWT Configuration

The `JWT_SECRET` value is used to sign authentication tokens.

Example:

```env
JWT_SECRET="super-secure-secret-key"
```

For production, use a stronger secret value and avoid using simple or predictable strings.

---

## 8. Local Development Setup

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run start:dev
```

Default local server:

```txt
http://localhost:3000
```

Swagger documentation:

```txt
http://localhost:3000/api
```

---

## 9. Production Environment Notes

For production deployment, environment variables should be configured in the hosting platform.

Examples:

- Railway Variables
- Render Environment
- Supabase Project Settings
- Vercel / Cloud Provider Environment Settings

Production environment should include:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
PORT=
```

---

## 10. Environment Security Rules

Follow these rules:

- Do not commit `.env` to GitHub
- Store secrets only in environment variables
- Use strong JWT secret in production
- Use separate local and production database URLs
- Keep database credentials private
- Rotate secrets if they are exposed

---

## 11. `.gitignore` Requirement

Make sure `.env` is included in `.gitignore`.

Example:

```txt
.env
node_modules/
dist/
```

---

## 12. Environment Setup Goal

The environment setup is designed to support:

- Secure configuration management
- Local development
- Database connection stability
- Prisma migration workflow
- Deployment readiness
- Production-oriented backend practices
