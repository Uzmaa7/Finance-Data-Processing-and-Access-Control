# FINANCE-DATA-PROCESSING-AND-ACCESS-CONTROL Backend API Documentation

## Overview

Base URL: `/api/v1`

This backend exposes user authentication, user management, financial record management, and dashboard summary endpoints.

---

## Authentication Endpoints

### 1. Register User
- Method: `POST`
- URL: `/api/v1/auth/`
- Auth: No
- Request Body:
  - `email` (string, required, valid email)
  - `username` (string, required, lowercase, 3-20 chars)
  - `fullname` (string, required)
  - `password` (string, required, min 6 chars)
  - `role` (string, optional, ignored for public registration; forced to `VIEWER`)
  - `status` (string, optional)
- Response:
  - `statusCode`: `201`
  - `success`: `true`
  - `data`: created user object without `password` or `refreshToken`
  - `message`: `User registered successfully`
- Errors:
  - `422` validation error with `extractedError`
  - `400` missing required fields
  - `409` duplicate user email or username
  - `500` internal server error

### 2. Login User
- Method: `POST`
- URL: `/api/v1/auth/login`
- Auth: No
- Request Body:
  - `email` (string, required)
  - `password` (string, required)
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`:
    - `user`: user object without `password` or `refreshToken`
    - `accessToken`: JWT access token
    - `refreshToken`: JWT refresh token
  - `message`: `User logged in successfully`
  - Cookies set:
    - `accessToken`
    - `refreshToken`
- Errors:
  - `422` validation error
  - `404` user not found
  - `401` invalid credentials
  - `500` internal server error

### 3. Logout User
- Method: `POST`
- URL: `/api/v1/auth/logout`
- Auth: Yes (`verifyJWT`)
- Request Body: none
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`: `{}`
  - `message`: `User logged out successfully`
  - Cookies cleared: `accessToken`, `refreshToken`
- Errors:
  - `401` unauthorized if token missing or invalid
  - `500` internal server error

### 4. Refresh Access Token
- Method: `POST`
- URL: `/api/v1/auth/refresh-token`
- Auth: No header auth required; reads `refreshToken` cookie
- Request Body: none
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`:
    - `accessToken`
    - `refreshToken`
    - `user`
  - `message`: `Access token refreshed`
  - Cookies set: `accessToken`, `refreshToken`
- Errors:
  - `401` refresh token missing/malformed
  - `401` invalid or expired refresh token

---

## User Management Endpoints

> All user management routes are protected by `verifyJWT` and require the `ADMIN` role.

### 5. Create User (Admin)
- Method: `POST`
- URL: `/api/v1/users/`
- Auth: Yes (`verifyJWT`, `authorizeRoles(ADMIN)`)
- Request Body:
  - `email` (string, required, valid email)
  - `username` (string, required, lowercase, 3-20 chars)
  - `fullname` (string, required)
  - `password` (string, required, min 6 chars)
  - `role` (string, optional)
  - `status` (string, optional)
- Response:
  - `statusCode`: `201`
  - `success`: `true`
  - `data`: created user object without `password` or `refreshToken`
  - `message`: `User created by ADMIN successfully`
- Errors:
  - `422` validation error
  - `400` missing required fields
  - `409` duplicate user
  - `401` unauthorized / insufficient role
  - `500` server error

### 6. Get Users
- Method: `GET`
- URL: `/api/v1/users/`
- Auth: Yes (`verifyJWT`, `authorizeRoles(ADMIN)`)
- Query Parameters:
  - `page` (number, optional)
  - `limit` (number, optional, max 10)
  - `role` (string, optional)
  - `status` (string, optional)
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`:
    - `users`: array of user objects without `password` or `refreshToken`
    - `total`
    - `totalPages`
    - `currentPage`
  - `message`: `Users fetched successfully`
- Errors:
  - `401` unauthorized / insufficient role
  - `500` server error

### 7. Update User
- Method: `PATCH`
- URL: `/api/v1/users/:id`
- Auth: Yes (`verifyJWT`, `authorizeRoles(ADMIN)`)
- URL Params:
  - `id` (MongoDB ObjectId, required)
- Request Body:
  - `role` (string, optional)
  - `status` (string, optional)
  - `fullname` (string, optional)
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`: updated user object without `password` or `refreshToken`
  - `message`: `User updated successfully`
- Errors:
  - `422` invalid `id` or payload
  - `404` user not found
  - `401` unauthorized / insufficient role

### 8. Delete User (Soft Delete)
- Method: `DELETE`
- URL: `/api/v1/users/:id`
- Auth: Yes (`verifyJWT`, `authorizeRoles(ADMIN)`)
- URL Params:
  - `id` (MongoDB ObjectId, required)
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`: `{}`
  - `message`: `User deleted (Soft Delete)`
- Errors:
  - `422` invalid `id`
  - `404` user not found or already deactivated
  - `401` unauthorized / insufficient role

---

## Financial Records Endpoints

> All financial record routes are protected by `verifyJWT`.

### 9. Get Financial Records
- Method: `GET`
- URL: `/api/v1/financialRecords/`
- Auth: Yes (`verifyJWT`)
- Query Parameters:
  - `page` (number, optional)
  - `limit` (number, optional, max 10)
  - `type` (`INCOME` or `EXPENSE`, optional)
  - `category` (string, optional)
  - `search` (string, optional, text search on `notes`)
  - `startDate` (ISO date string, optional)
  - `endDate` (ISO date string, optional)
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`:
    - `records`: array of financial records
    - `total`
    - `currentPage`
    - `totalPages`
  - `message`: `Records fetched successfully`
- Errors:
  - `401` unauthorized
  - `500` server error

### 10. Create Financial Record
- Method: `POST`
- URL: `/api/v1/financialRecords/`
- Auth: Yes (`verifyJWT`, `authorizeRoles(ADMIN)`)
- Request Body:
  - `amount` (number, required, > 0)
  - `type` (string, required, `INCOME` or `EXPENSE`)
  - `category` (string, required)
  - `date` (ISO date string, optional)
  - `notes` (string, optional, max 200 chars)
- Response:
  - `statusCode`: `201`
  - `success`: `true`
  - `data`: created record
  - `message`: `Record created successfully`
- Errors:
  - `422` validation error
  - `401` unauthorized / insufficient role
  - `500` server error

### 11. Update Financial Record
- Method: `PATCH`
- URL: `/api/v1/financialRecords/:id`
- Auth: Yes (`verifyJWT`, `authorizeRoles(ADMIN)`)
- URL Params:
  - `id` (MongoDB ObjectId, required)
- Request Body: any of
  - `amount` (number, > 0)
  - `type` (`INCOME` or `EXPENSE`)
  - `category` (string)
  - `date` (ISO date string)
  - `notes` (string, max 200 chars)
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`: updated record
  - `message`: `Record updated successfully`
- Errors:
  - `422` invalid ID or payload
  - `404` record not found or already deleted
  - `401` unauthorized / insufficient role

### 12. Delete Financial Record
- Method: `DELETE`
- URL: `/api/v1/financialRecords/:id`
- Auth: Yes (`verifyJWT`, `authorizeRoles(ADMIN)`)
- URL Params:
  - `id` (MongoDB ObjectId, required)
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`: `{}`
  - `message`: `Record deleted successfully`
- Errors:
  - `422` invalid ID
  - `404` record not found or already deleted
  - `401` unauthorized / insufficient role

---

## Dashboard Endpoint

> Dashboard endpoints are protected by `verifyJWT`.

### 13. Get Dashboard Summary
- Method: `GET`
- URL: `/api/v1/dashboards/summary`
- Auth: Yes (`verifyJWT`, `authorizeRoles(VIEWER, ANALYST, ADMIN)`)
- Response:
  - `statusCode`: `200`
  - `success`: `true`
  - `data`: dashboard summary object
  - `message`: `Dashboard summary retrieved successfully` or `Basic Dashboard retrieved (Insights restricted for Viewer role)`
- Dashboard response fields for Analysts/Admins:
  - `totalIncome`
  - `totalExpense`
  - `netBalance`
  - `categoryTotals`
  - `trends`
  - `recentActivity`
- Dashboard response fields for Viewers:
  - `totalIncome`
  - `totalExpense`
  - `netBalance`
  - `recentActivity`
- Errors:
  - `401` unauthorized
  - `403` insufficient role
  - `500` server error

---

## Response Format

All successful responses use the `ApiResponse` shape:

```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "...",
  "success": true
}
```

Validation failures use:

```json
{
  "success": false,
  "message": "recieved data is not valid",
  "extractedError": [
    { "field": "error message" }
  ]
}
```

API error responses from `ApiError` should include:

```json
{
  "statusCode": 401,
  "data": null,
  "message": "...",
  "success": false,
  "errors": []
}
```

> Note: The project currently does not show a global error-handling middleware in `src/app.js`. Add one to guarantee consistent JSON error responses for thrown `ApiError` instances.



## Notes for Frontend Integration

- Use `withCredentials: true` when calling endpoints from browser clients, because authentication depends on cookies.
- Store the returned access token in memory only if needed; refresh is handled through HTTP-only cookies.
- Always send `Authorization: Bearer <token>` if your client uses header-based JWT instead of cookies.
- Use `/api/v1/auth/refresh-token` to renew tokens when the access token expires.

---

## Base Routes

- `POST /api/v1/auth/`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh-token`
- `GET /api/v1/users/`
- `POST /api/v1/users/`
- `PATCH /api/v1/users/:id`
- `DELETE /api/v1/users/:id`
- `GET /api/v1/financialRecords/`
- `POST /api/v1/financialRecords/`
- `PATCH /api/v1/financialRecords/:id`
- `DELETE /api/v1/financialRecords/:id`
- `GET /api/v1/dashboards/summary`
