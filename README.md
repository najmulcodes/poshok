# Poshok (পোষক) - Health & Diet Chart Platform

Poshok is a production-grade, full-stack, bilingual (Bangla & English) diet chart platform. It provides users with daily nutrition plans based on declared health conditions (e.g., Diabetes, Cardiac) and includes a dedicated section for child nutrition.

This monorepo contains the three main parts of the Poshok ecosystem:
- **Mobile App**: The primary user-facing product, built with Expo (React Native).
- **Web App**: A Next.js app for the public marketing page and the internal admin panel.
- **API**: A Node.js/Express backend that serves both the mobile and web applications.

---

## Tech Stack

- **Monorepo**: npm Workspaces
- **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, BullMQ, Redis
- **Web App**: Next.js (App Router), TypeScript, Tailwind CSS, `next-intl`
- **Mobile App**: Expo (React Native), TypeScript, `i18n-js`, Expo Router
- **Shared**: Zod for validation, shared translation files.
- **Deployment**: Render (API, Worker, DB, Redis), Vercel (Web), EAS (Mobile).

## Monorepo Structure

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