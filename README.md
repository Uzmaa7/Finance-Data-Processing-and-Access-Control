# Backend README

## Project
`FINANCE-DATA-PROCESSING-AND-ACCESS-CONTROL`

A production-grade Node.js/Express backend for a Finance Dashboard. This system manages financial records, implements granular Role-Based Access Control (RBAC), and provides complex analytics via MongoDB Aggregation Pipelines.

---

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access & Refresh Tokens) with Cookie-Parser
- **Validation:** Express-Validator
- **Security:** Bcrypt (Password Hashing), CORS, Rate Limiting
- **Development:** Nodemon, Dotenv

---

---

## Quick Start

### Prerequisites
- Node.js v18 or higher
- MongoDB local or MongoDB Atlas connection string
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Uzmaa7/Finance-Data-Processing-and-Access-Control
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file with required variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:3000` with auto-reload enabled via nodemon.

5. **Server is ready when you see:**
   ```
   MONGODB connected !! DB HOST: ac---xyz--.mongodb.net
   Server is listening on port 3000
   ```
---

## Project Structure

```

Based on the Model-View-Controller (MVC) architecture with a dedicated Service layer:

```text
Backend/
├── src/
│   ├── controller/   # Request handlers (logic to bridge routes and services)
│   ├── db/           # MongoDB connection configuration
│   ├── middleware/   # Auth, Role-check, and Validation middlewares
│   ├── model/        # Mongoose Schemas (User, FinancialRecords)
│   ├── routes/       # API Route definitions
│   ├── service/      # Business logic & Complex Aggregation pipelines
│   ├── utils/        # ApiError, ApiResponse, asyncHandler, constants
│   ├── validator/    # Request body/param validation rules
│   └── app.js        # Express app setup (Middlewares & Route registration)
├── .env              # Environment variables (Private)
├── service.js        # Entry point (Server listener)
└── package.json      # Project dependencies and scripts
```
## Environment Variables

Create a `.env` file in the `Backend/` directory with the following configuration:

```env
# Server Configuration
PORT=3000


# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/revicode?retryWrites=true&w=majority

# JWT Configuration
ACCESS_TOKEN_SECRET=your_very_secret_access_token_string_at_least_32_chars_long
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_very_secret_refresh_token_string_at_least_32_chars_long
REFRESH_TOKEN_EXPIRY=10d

BASE_URL=http://127.0.0.1:3000

```

## API Documentation
See `Backend/API_DOCUMENTATION.md` for complete endpoint details.

---
## Assignment Alignment

### 1. Authentication
- Implemented with JWT tokens and refresh tokens in `src/service/auth.service.js`.
- Cookies are used to store `accessToken` and `refreshToken` securely.
- Routes:
  - `POST /api/v1/auth/` — register
  - `POST /api/v1/auth/login` — login
  - `POST /api/v1/auth/logout` — logout
  - `POST /api/v1/auth/refresh-token` — refresh session tokens
- Files:
  - `src/controller/auth.controller.js`
  - `src/validator/auth.validator.js`
  - `src/middleware/auth.middleware.js`

### 2. Role Based Access Control (RBAC)
- Roles defined in `src/utils/constants.js`:
  - `VIEWER`
  - `ANALYST`
  - `ADMIN`
- Middleware:
  - `src/middleware/auth.middleware.js` — verifies JWT and attaches the authenticated user.
  - `src/middleware/role.middleware.js` — enforces route-level role permissions.
- Permissions:
  - `ADMIN`:
    - Create/update/delete financial records and users
    - View dashboards and records 
    - admin allowed full management access
  - `ANALYST`:
    - View financial records
    - View dashboard summaries and insights
  - `VIEWER`:
    - Can only view dashboard data
    - View financial record listings
- Route mapping:
  - `src/routes/user.route.js` — Admin-only user management.
  - `src/routes/financialRecords.route.js` — Admin-only write operations, read allowed for Viewer/Analyst/Admin.
  - `src/routes/dashboard.route.js` — Protected summary endpoint accessible to Viewer/Analyst/Admin.

### 3. Financial Records Management
- Implemented in `src/model/financialRecords.model.js`.
- CRUD functionality available for records.
- Soft delete is implemented via `isDeleted` in the model.
- Filtering and record listing in `src/service/financialRecords.service.js`.
- Validation in `src/validator/financialRecords.validator.js`.

### 4. Dashboard Summary APIs
- Implemented in `src/routes/dashboard.route.js` and `src/service/dashboard.service.js`.
- Uses MongoDB aggregation pipelines to calculate:
  - Total income
  - Total expenses
  - Net balance
  - Category-wise totals
  - Trends
  - Recent activity
- Viewer access is intentionally limited to basic dashboard totals and recent activity.

### 5. Validation and Error Handling
- Input validation using `express-validator` across:
  - `src/validator/auth.validator.js`
  - `src/validator/user.validator.js`
  - `src/validator/financialRecords.validator.js`
- Validation middleware in `src/middleware/validator.middleware.js` returns structured `422` error responses.
- Standard API responses use `src/utils/ApiResponse.js`.
- Service errors use `src/utils/ApiError.js` for consistent failure handling.

### 6. Pagination and Search
- Pagination implemented for:
  - `GET /api/v1/users/`
  - `GET /api/v1/financialRecords/`
- Search support on financial records notes via MongoDB text index in `src/model/financialRecords.model.js`.
- The record listing service allows filtering by:
  - `type`
  - `category`
  - `search`
  - `startDate`
  - `endDate`

### 7. Data Persistence and Optimization
- MongoDB with Mongoose used for persistence.
- Optimized record schema with indexes and compound indexes for query performance.
- Dashboard aggregation uses MongoDB pipelines for efficient analytics.
- Soft delete allows records and users to be deactivated without permanent removal.

## Features Implemented
- JWT authentication and refresh tokens
- Role-based access control (RBAC)
- Pagination for listing endpoints
- Search support on financial records
- Soft delete for users and records
- Dashboard analytics via aggregation pipelines
- Validation and structured error responses
- Clear API documentation in `Backend/API_DOCUMENTATION.md`

## Directory Structure
- `src/app.js` — Express setup, CORS, body parsing, cookie parser, routes
- `src/routes/` — API route definitions
- `src/controller/` — request handlers
- `src/service/` — business logic and data access
- `src/model/` — Mongoose schemas
- `src/middleware/` — authentication, authorization, validation
- `src/validator/` — request validation rules
- `src/utils/` — shared response/error helpers and constants


## Assumptions and Tradeoffs
- Used MongoDB/Mongoose for document-based financial records since it fits flexible record fields and aggregation requirements.
- Authentication is implemented using JWT tokens and secure cookies to balance security and frontend integration.
- Soft delete is used instead of hard delete to preserve historical data.
- No dedicated global error handler currently exists in `src/app.js`; adding one is recommended for production.
- `secure: true` on cookies is best for production but may require adjustment for local HTTP development.

## Notes
- Frontend should use `withCredentials: true` for cookie-based auth.
- The backend is designed for clarity, maintainability, and evaluator transparency.
