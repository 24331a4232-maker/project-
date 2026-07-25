# The Last Plate Project

A surplus food donation platform connecting hotels, restaurants, and event organizers with volunteers who collect and deliver surplus food to people in need.

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS (green & orange theme)
- **Icons:** Lucide React
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Routing:** React Router v6

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

The `.env` file is pre-configured with Supabase credentials. No additional setup needed.

### Development

```bash
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Lint & Type Check

```bash
npm run lint
npm run typecheck
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── DonationCard.tsx
│   ├── Footer.tsx
│   ├── LoaderScreen.tsx
│   ├── Navbar.tsx
│   ├── PageHeader.tsx
│   ├── ProtectedRoute.tsx
│   └── StatCard.tsx
├── context/            # React context providers
│   ├── AuthContext.tsx
│   └── useAuth.ts
├── lib/                # Utilities and config
│   └── supabase.ts
├── pages/              # Page components
│   ├── About.tsx
│   ├── AdminDashboard.tsx
│   ├── AvailableDonations.tsx
│   ├── Contact.tsx
│   ├── DonateFood.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── VolunteerDashboard.tsx
├── App.tsx             # Root component with routing
├── main.tsx            # Entry point
└── index.css           # Global styles + Tailwind
```

## Features

- **JWT Authentication** — Secure email/password auth with three roles: Donor, Volunteer, Admin
- **Image Upload** — Food photos and delivery proof uploaded to Supabase Storage
- **Real-Time Status Tracking** — Donations flow through: Available → Accepted → Picked Up → Delivered
- **Search & Filter** — Browse donations by food type, name, location, or donor
- **Role-Based Dashboards** — Tailored views for volunteers and admins
- **Analytics** — Admin dashboard with donation-by-status and food-type charts
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop

## User Roles

| Role       | Capabilities                                              |
| ---------- | -------------------------------------------------------- |
| Donor      | Post food donations, view own listings                   |
| Volunteer  | Browse & accept donations, update pickup/delivery status |
| Admin      | Full platform management, analytics, user management    |

## VS Code Setup

Open the project in VS Code. Recommended extensions will be prompted automatically (see `.vscode/extensions.json`):

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Next

Press `F5` or use the Run panel to launch the dev server with the "Run Dev Server" configuration.
