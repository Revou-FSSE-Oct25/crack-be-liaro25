# Backend Foundation

## 1. Foundation Overview

Whisk & Wonder Backend API is built using NestJS as the main backend framework.

The backend foundation focuses on creating a modular, secure, and scalable RESTful API structure that supports authentication, reservations, table management, menu management, order processing, payment tracking, and admin operations.

---

## 2. Backend Framework

This project uses:

```txt
NestJS
```

NestJS was chosen because it provides:

- Modular architecture
- Controller and service separation
- Dependency injection
- Built-in support for guards and decorators
- TypeScript-first development
- Scalable backend project structure

---

## 3. Project Architecture

The backend follows a modular architecture.

Each main feature is separated into its own module.

Example structure:

```txt
src/
├── auth/
├── users/
├── reservations/
├── tables/
├── menus/
├── orders/
├── payments/
├── prisma/
└── common/
```

Each module usually contains:

```txt
module.ts
controller.ts
service.ts
dto/
```

---

## 4. Architecture Flow

The backend uses the following request flow:

```txt
Client Request
→ Controller
→ Service
→ Prisma
→ PostgreSQL Database
→ Response
```

### Explanation

| Layer      | Responsibility                   |
| ---------- | -------------------------------- |
| Controller | Handles HTTP requests and routes |
| Service    | Handles business logic           |
| Prisma     | Handles database queries         |
| Database   | Stores application data          |

---

## 5. Controller Layer

Controllers are responsible for receiving HTTP requests.

Example responsibilities:

- Define API endpoints
- Receive request body
- Read route parameters
- Apply route guards
- Call service methods
- Return API responses

Example:

```ts
@Get()
findAll() {
  return this.service.findAll();
}
```

---

## 6. Service Layer

Services contain the main business logic.

Example responsibilities:

- Validate business rules
- Communicate with Prisma
- Process reservation logic
- Handle order and payment flow
- Throw proper exceptions when needed

Example:

```ts
async findAll() {
  return this.prisma.resource.findMany();
}
```

---

## 7. Prisma Layer

Prisma is used as the ORM to communicate with the PostgreSQL database.

Prisma is responsible for:

- Database model definition
- Query execution
- Relationship handling
- Migration management
- Prisma Client generation

Common Prisma commands:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

---

## 8. Database Layer

The database stores all application data, including:

- Users
- Reservations
- Tables
- Menus
- Orders
- Payments

The database uses relational structure to maintain data consistency and relationships between resources.

---

## 9. Environment Configuration

The backend uses environment variables for sensitive configuration.

Example `.env`:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
PORT=
```

Environment variables are used to keep credentials secure and avoid hardcoding sensitive data in the source code.

---

## 10. API Validation Foundation

The backend uses DTO validation to validate incoming request data.

DTO validation helps ensure:

- Required fields are provided
- Data types are correct
- Email format is valid
- Enum values are valid
- Invalid requests are rejected before reaching business logic

---

## 11. Authentication Foundation

Authentication is handled using JWT.

Basic authentication flow:

```txt
Register
→ Login
→ Receive JWT token
→ Send token in Authorization header
→ Access protected route
```

Protected routes require:

```http
Authorization: Bearer <access_token>
```

---

## 12. Authorization Foundation

Authorization is handled using role-based access control.

Supported roles:

| Role     | Access                |
| -------- | --------------------- |
| CUSTOMER | Customer-level access |
| ADMIN    | Admin-level access    |

Admin-only operations are protected using guards and role decorators.

---

## 13. Error Handling Foundation

The backend uses NestJS exception handling to return controlled error responses.

Common errors include:

| Error                 | Meaning                                 |
| --------------------- | --------------------------------------- |
| BadRequestException   | Invalid request or validation error     |
| UnauthorizedException | Missing or invalid authentication token |
| ForbiddenException    | User does not have required role        |
| NotFoundException     | Requested resource does not exist       |
| ConflictException     | Resource conflict or duplicate data     |

---

## 14. Swagger Foundation

Swagger is used to document and test the API.

Swagger helps with:

- Endpoint visibility
- Request body examples
- Response examples
- Authentication testing
- Frontend integration reference

Swagger documentation is available at:

```txt
/api
```

---

## 15. Backend Foundation Goal

The backend foundation is designed to support:

- Clean modular architecture
- Secure route access
- Reliable database operations
- Clear API structure
- Frontend integration readiness
- Portfolio-ready backend documentation
