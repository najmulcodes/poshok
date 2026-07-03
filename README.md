# Poshok - Health-Condition Diet Chart App

This is a full-stack application for providing diet charts based on health conditions.

## Phase 1: Initial Setup

This phase scaffolds the monorepo, sets up the database schema, and seeds it with initial data.

### Prerequisites

- Node.js (v18 or higher)
- npm
- PostgreSQL database

### Setup Instructions

1.  **Install Dependencies**: Run `npm install` from the root directory (`c:\poshok`).
    > **Windows Users**: npm workspaces use symlinks. You must either enable "Developer Mode" in Windows settings or run your terminal as an Administrator for `npm install` to succeed.

2.  **Configure Database**: Navigate to `c:\poshok\apps\api`, create a `.env` file, and add your PostgreSQL connection string:
    ```
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
    ```

3.  **Run Database Migrations**: From the `c:\poshok\apps\api` directory, run `npm run db:migrate`. This will apply the Prisma schema to your database.

4.  **Seed the Database**: After migration, run `npm run db:seed` from `c:\poshok\apps\api` to populate the database with an admin user and sample diet plans.

After these steps, the database will be ready for the next phase of development.

## Phase 2: Auth End-to-End

This phase implements the complete authentication and authorization system for the API.

### New Environment Variables

The following variables must be added to your `.env` file in `apps/api`:

```
# You can generate these with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET="your-super-secret-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
PORT=3001
```

### Running the API Server

1.  Navigate to the API directory: `cd apps/api`
2.  Run the development server: `npm run dev`

The API will be running on `http://localhost:3001`.

### Testing with cURL

You can test the new auth endpoints using a tool like cURL or Postman.

**Register a new user:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register -H "Content-Type: application/json" -d '{"email":"test@example.com", "password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com", "password":"password123"}' -c cookies.txt
```

**Get user profile (requires auth):**
```bash
# Replace YOUR_ACCESS_TOKEN with the token from the login response
curl http://localhost:3001/api/v1/users/me -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Refresh token:**
```bash
## Phase 7: Web App (Landing Page)

This phase implements the public-facing marketing and landing page for the Poshok web application.

### How to View

1.  Ensure the web app is running (`cd apps/web` and `npm run dev`).
2.  Navigate to `http://localhost:3000/bn` or `http://localhost:3000/en` in your browser to see the new landing page.

curl -X POST http://localhost:3001/api/v1/auth/refresh -b cookies.txt
```