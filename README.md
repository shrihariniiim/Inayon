# TalentHire / Inayon 🚀

An end-to-end modern technical recruitment, candidate vetting, and hiring platform.

---

## 🌟 Overview

**TalentHire (Inayon)** connects vetted engineering talent with hiring companies through calibrated technical evaluations, stack passes, and automated shortlists.

The repository is organized as an **npm / TypeScript Monorepo** containing multiple applications and shared packages:

```
├── apps/
│   ├── admin-web/      # Superadmin & Operations Command Center (React, Vite, Tailwind/CSS)
│   ├── company-web/    # Corporate Hiring Portal (Requisitions, Shortlists, Candidate Review)
│   ├── server/         # Express.js REST API & Socket.IO Central Gateway (MongoDB Atlas)
│   └── talent-web/     # Candidate & Evaluator Portal (Profiles, StackPass, Live Interviews)
├── packages/
│   ├── api-client/     # Standardized Axios/Fetch API client wrappers
│   ├── auth/           # JWT creation, verification, RBAC permissions & roles
│   ├── config/         # Shared environment and build configurations
│   ├── types/          # Core TypeScript domain models and interfaces
│   ├── ui/             # Reusable UI component library
│   ├── utils/          # Cross-cutting utility functions
│   └── validation/     # Zod schema definitions and validation logic
└── docs/               # System documentation and architecture guides
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript, Socket.IO, Mongoose (MongoDB Atlas)
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS / Vanilla CSS, React Router v6
- **Architecture**: Monorepo with npm workspaces
- **Deployment**: Vercel Serverless / Node.js standalone server

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas**: An active connection URI

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/shrihariniiim/Inayon.git
cd Inayon/TalentHire
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in `apps/server` (or in the root) with the following parameters:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
VERCEL=false
```

### 3. Running in Development Mode

Run all workspaces concurrently:

```bash
npm run dev
```

Or start specific sub-applications:

```bash
# Central Server API
npm run dev:server

# Candidate & Evaluator Portal
npm run dev:talent

# Corporate Employer Portal
npm run dev:company

# Superadmin Command Center
npm run dev:admin
```

---

## 📦 Build & Deployment

To bundle all workspaces for production:

```bash
npm run build
```

To bundle the serverless entry points for Vercel:

```bash
npm run bundle:serverless
```

---

## 🛡️ License

Private & Proprietary. All rights reserved.
