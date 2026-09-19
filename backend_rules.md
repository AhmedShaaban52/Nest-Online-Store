# Backend Configuration and Strict Rules Summary

This document summarizes the models, validations, and rules defined in the NestJS backend workspace located at `c:\dev\nest_project\simple-store`.

## 1. Database Schema (Prisma)

### User Model
- **email**: String, unique. Must be a valid email format.
- **password**: String. Will be stored as a bcrypt hash (10 salt rounds). Minimum 6 characters required on registration.
- **role**: Enum `Role` with values:
  - `USER` (default)
  - `ADMIN`

### Product Model
- **name**: Required non-empty string.
- **price**: Float. Must be a positive number (> 0).
- **stock**: Integer. Must be a non-negative integer (>= 0).

### Order & OrderItem Models
- **Order**: Represents a purchase order. Belongs to a `User`.
- **OrderItem**: Represents a line item inside an `Order`. Connects a `Product` and specifies a `quantity` (must be an integer >= 1).

---

## 2. API Endpoints and Custom Behaviors

### Response Envelope Wrapper (Global Interceptor)
- Every successful HTTP response (2xx status codes) is automatically wrapped in a standardized envelope:
  ```json
  {
    "success": true,
    "data": ...,
    "timestamp": "2026-07-15T14:13:21.000Z"
  }
  ```
  *Note:* Error responses (4xx/5xx) are not wrapped by this interceptor and will follow the standard NestJS error response structure.

### Request Logging (Global Middleware)
- Every incoming request's HTTP method, URL, and response status code are logged in the console.

### Authentication Endpoints
- `POST /auth/register`:
  - Body: `RegisterDto` (email, password, optional role).
  - Validation: Email must be valid, password must be at least 6 characters.
- `POST /auth/login`:
  - Body: `LoginDto` (email, password).
  - Response: Returns a JSON object containing `{ access_token }`.

### Products Endpoints
- `GET /products`: Public (accessible without token).
- `GET /products/:id`: Public (accessible without token).
- `POST /products`: Protected by `JwtAuthGuard` & `RolesGuard`. Requires `ADMIN` role.
- `PATCH /products/:id`: Protected by `JwtAuthGuard` & `RolesGuard`. Requires `ADMIN` role.
- `DELETE /products/:id`: Protected by `JwtAuthGuard` & `RolesGuard`. Requires `ADMIN` role.

### Orders Endpoints
- `POST /orders`: Protected by `JwtAuthGuard`. The user ID is strictly extracted from the JWT token's `sub` claim. Body contains `{ items: [{ productId, quantity }] }`.
  - *Strict Rule:* Placed within a database transaction. Verifies that all products exist and that stock is sufficient. If verified, decrements product stock and registers the order. Otherwise, rolls back.
- `GET /orders`: Protected by `JwtAuthGuard`. Returns orders belonging only to the calling user.
- `GET /orders/:id`: Protected by `JwtAuthGuard`. Returns order details if and only if the order belongs to the calling user (otherwise returns `403 Forbidden`).

---

## 3. Required Backend Adjustments for Cookie Authentication & CORS
To support the frontend request for automatic cookie-based authentication (`credentials: 'include'`), we need to apply the following backend changes:
1. **Enable CORS with credentials:** Configure `main.ts` to allow cross-origin requests with credentials from the frontend origins.
2. **Support Cookie Parsing:** Add `cookie-parser` to NestJS and configure `main.ts`.
3. **Set Cookie on Login:** Modify `AuthController` and `AuthService` to set the `access_token` cookie on login.
4. **Read Cookie in Guard:** Modify `JwtAuthGuard` to read from `request.cookies.access_token` in addition to headers.
