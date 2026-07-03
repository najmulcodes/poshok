<div align="center">
  <h1>Poshok (পোষক) - Health & Diet Chart Platform</h1>
  <p>
    <strong>A production-grade, full-stack, bilingual (Bangla & English) diet chart platform.</strong>
  </p>
  <p>Poshok provides users with daily nutrition plans based on declared health conditions and includes a dedicated section for child nutrition. It is designed as a complete ecosystem, including a mobile app, a web-based admin panel, and a backend API.</p>
</div>

---

## ✨ Features

- **Condition-Specific Diet Plans**: Plans for Diabetes, Cardiac, General Wellness, and Child Nutrition.
- **Bilingual Support**: Fully localized for both English (`en`) and Bangla (`bn`).
- **User-Facing Mobile App**: Dashboard with active plan, meal tracking, plan discovery, and user profile management.
- **Admin Panel**: Secure web interface for admins to perform full CRUD (Create, Read, Update, Delete) operations on diet plans.
- **Reliable Notifications**: Background job system using BullMQ and Redis ensures users receive meal reminders reliably.
- **Secure Authentication**: Robust auth system with JWT (access/refresh tokens) and Role-Based Access Control (RBAC).
- **Shared Codebase**: A central `shared` package for Zod schemas, types, and translations ensures consistency across the entire stack.

---

## Tech Stack

- **Monorepo**: npm Workspaces
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, BullMQ, Redis
- **Web App**: Next.js (App Router), TypeScript, Tailwind CSS, `next-intl`
- **Mobile App**: Expo (React Native), TypeScript, `i18n-js`, Expo Router
- **Shared**: Zod for validation, shared translation files.

---

## 🚀 Getting Started: Local Development

This guide will walk you through setting up the entire Poshok platform on your local machine.

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **PostgreSQL**: A running instance (e.g., via Docker)
- **Redis**: A running instance (e.g., via Docker)
- **Windows Users**: You must enable "Developer Mode" in Windows Settings or run your terminal as an Administrator. This is required for `npm install` to create the symbolic links used by npm workspaces.

### 1. Clone & Install

First, clone the repository and install all dependencies from the root directory.

```bash
git clone https://github.com/your-username/poshok.git
cd poshok
npm install
```

### 2. Backend API (`apps/api`)

The API is the heart of the application.

1.  **Navigate to the API directory**: `cd apps/api`
2.  **Set up environment variables**: Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
3.  **Configure `.env`**: Open the new `.env` file and fill in the values for `DATABASE_URL` and `REDIS_URL` to point to your local PostgreSQL and Redis instances.
4.  **Run database migrations**: This will set up the database schema.
    ```bash
    npm run db:migrate
    ```
5.  **Seed the database**: This populates the database with an admin user and sample diet plans.
    ```bash
    npm run db:seed
    # Default Admin: admin@poshok.com / admin-password
    ```
6.  **Start the API server**: In one terminal, run:
    ```bash
    npm run dev
    # API will be running on http://localhost:3001
    ```
7.  **Start the Notification Worker**: In a *second* terminal, run:
    ```bash
    npm run worker:dev
    # The worker connects to Redis and processes background jobs.
    ```

### 3. Web App (`apps/web`)

The web app contains the marketing page and admin panel.

1.  **Navigate to the web directory**: `cd apps/web`
2.  **Set up environment variables**: Create a `.env.local` file with the URL of your local API:
    ```
    NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    # Web app will be running on http://localhost:3000
    ```
    - **Landing Page**: Visit `http://localhost:3000/en`
    - **Admin Panel**: Visit `http://localhost:3000/en/login`

### 4. Mobile App (`apps/mobile`)

The mobile app is the primary product for end-users.

1.  **Navigate to the mobile directory**: `cd apps/mobile`
2.  **Set up environment variables**: Create a `.env` file with the API URL. **This URL is specific to your mobile development environment**:
    - For an **Android Emulator**, use: `EXPO_PUBLIC_API_URL="http://10.0.2.2:3001/api/v1"`
    - For an **iOS Simulator** or a **physical device** on the same Wi-Fi, use your computer's local network IP address (e.g., `http://192.168.1.100:3001/api/v1`).
3.  **Start the Expo server**:
    ```bash
    npm start
    ```
4.  Scan the QR code with the Expo Go app on your device, or press `a` or `i` to open in an emulator/simulator.

---

## ☁️ Deployment

The project is architected for production deployment. The following sections describe the recommended path for deploying with the current codebase and how to adapt it for a Supabase backend.

### Recommended Deployment (as-is)

- **Backend (API & Worker)**: Deploy to **Render** using the provided `render.yaml` file. This file defines the API server, the background worker, the PostgreSQL database, and the Redis instance as a cohesive unit.
- **Web App**: Deploy to **Vercel**. Set the root directory to `apps/web` and add the `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed Render API.
- **Mobile App**: Build and submit using **Expo Application Services (EAS)**. The `eas.json` file is pre-configured to use the production API URL during the build process.

### Migrating to a Supabase Backend

If you wish to use Supabase for the backend, you will need to make significant architectural changes. The current Express API is **not** directly compatible with Supabase Edge Functions.

Here is the recommended migration path:

1.  **Database**:
    - Create a new project on Supabase.
    - In your Supabase project, run the SQL generated by Prisma migrations to replicate the schema. You can generate this by running `npx prisma migrate diff`.
    - Update the `DATABASE_URL` in your API's `.env` file to point to your Supabase database connection string.

2.  **Authentication**:
    - The current API uses `bcrypt` and generates its own JWTs. This must be replaced to use Supabase Auth.
    - **Action**: Modify the `/auth/register` and `/auth/login` endpoints in `apps/api` to use the `supabase-js` client library (e.g., `supabase.auth.signUp`, `supabase.auth.signInWithPassword`).
    - **Action**: In the API's `protect` middleware, validate the JWT against your Supabase project's `JWT_SECRET` instead of the custom one.

3.  **API Host**:
    - **Option A (Hybrid - Recommended)**: Continue to deploy the Node.js/Express API to a service like **Render** or **Fly.io**. This is the simplest path as it requires no logic rewrite, only changes to the database and auth configuration.
    - **Option B (Full Migration)**: Rewrite the entire Express API from `apps/api` into Deno-based TypeScript functions compatible with **Supabase Edge Functions**. This is a major undertaking.

4.  **Background Jobs (Notifications)**:
    - Supabase does not offer a Redis service, so the BullMQ/Redis system will no longer work.
    - **Action**: You must replace this system. A common pattern is to use Supabase's built-in scheduler (`pg_cron`) to call a database function, which in turn triggers a serverless function (e.g., a Supabase Edge Function or a Vercel Serverless Function) to send the push notifications.

---

## 📂 Project Structure
```
poshok/
├── apps/
│   ├── api/      # Express backend
│   ├── mobile/   # Expo (React Native) user app
│   └── web/      # Next.js marketing + admin app
├── packages/
│   └── shared/   # Shared Zod schemas, types, translations
├── package.json  # Root package.json with workspaces config
└── render.yaml   # Infrastructure-as-Code for Render
```

## Local Development Setup

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **PostgreSQL**: A running instance (e.g., via Docker or a local installation)
- **Redis**: A running instance (e.g., via Docker or a local installation)
- **Windows Users**: Enable "Developer Mode" or run your terminal as an Administrator to allow `npm install` to create symlinks for workspaces.

### 1. Root Setup

Clone the repository and install all dependencies from the root directory.

```bash
npm install
```

### 2. Backend API (`apps/api`)

1.  Navigate to the API directory: `cd apps/api`
2.  Create a `.env` file by copying `.env.example`.
3.  Fill in the environment variables, especially `DATABASE_URL` and `REDIS_URL`.
4.  Apply database migrations:
    ```bash
    npm run db:migrate
    ```
5.  Seed the database with an admin user and sample diet plans:
    ```bash
    npm run db:seed
    # Admin credentials: admin@poshok.com / admin-password
    ```
6.  In one terminal, start the API server:
    ```bash
    npm run dev
    # API will be running on http://localhost:3001
    ```
7.  In a second terminal, start the notification worker:
    ```bash
    npm run worker:dev
    # The worker will connect to Redis and listen for jobs.
    ```

### 3. Web App (`apps/web`)

1.  Navigate to the web app directory: `cd apps/web`
2.  Create a `.env.local` file.
3.  Add the API URL:
    ```
    NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
    ```
4.  Start the development server:
    ```bash
    npm run dev
    # Web app will be running on http://localhost:3000
    ```
5.  - **Landing Page**: Visit `http://localhost:3000/en` or `http://localhost:3000/bn`.
    - **Admin Panel**: Visit `http://localhost:3000/en/login` to log in.

### 4. Mobile App (`apps/mobile`)

1.  Navigate to the mobile app directory: `cd apps/mobile`
2.  Create a `.env` file.
3.  Add the API URL. This URL depends on your development environment:
    - **For Android Emulator**: `EXPO_PUBLIC_API_URL="http://10.0.2.2:3001/api/v1"`
    - **For iOS Simulator/Physical Device**: Use your computer's local network IP address (e.g., `http://192.168.1.100:3001/api/v1`).
4.  Start the Expo development server:
    ```bash
    npm start
    ```
5.  Scan the QR code with the Expo Go app on your physical device, or press `a` or `i` to open it in an Android or iOS simulator.

---

## Deployment

This project is configured for a seamless deployment experience.

### Backend (Render)

The entire backend infrastructure is defined in the `render.yaml` file. To deploy:
1.  Create a new "Blueprint" on Render.
2.  Connect your Git repository.
3.  Render will automatically detect and parse the `render.yaml` file.
4.  Create an `envVarGroup` named `poshok-secrets` in the Render dashboard and let Render generate the secret values.
5.  Click "Apply". Render will provision the PostgreSQL database, Redis instance, API server, and background worker, and set up the cron job.

### Web App (Vercel)

1.  Create a new project on [Vercel](https://vercel.com/).
2.  Connect your Git repository.
3.  Set the "Root Directory" to `apps/web`.
4.  Add the following environment variable:
    - `NEXT_PUBLIC_API_URL`: The URL of your deployed Render API (e.g., `https://poshok-api.onrender.com/api/v1`).
5.  Deploy.

### Mobile App (EAS)

The mobile app is configured for builds and submissions using Expo Application Services (EAS).

1.  Install the EAS CLI: `npm install -g eas-cli`.
2.  Log in: `eas login`.
3.  From the `apps/mobile` directory, run a build:
    ```bash
    eas build --profile production --platform android
    ```
4.  Once the build is complete, you can download the APK/AAB and submit it to the Google Play Console. The `eas.json` file is pre-configured with the production API URL.