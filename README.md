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