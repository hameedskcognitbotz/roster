# ShiftMaster - Team Roster & Shift Scheduling

A modern, full-stack web application for managing team schedules, shifts, availability, and time-off requests.

![ShiftMaster Dashboard](https://via.placeholder.com/800x400?text=ShiftMaster+Dashboard)

## 🚀 Features

- **Dashboard** - Overview with stats, today's schedule, and pending requests
- **Schedule Builder** - Weekly calendar grid with drag-and-drop shift creation
- **Team Management** - View and manage team members across departments
- **Time-Off Requests** - Submit and approve vacation/sick leave requests
- **Notifications** - Real-time alerts for schedule changes
- **Role-based Access** - Admin, Manager, and Employee roles

## 🛠️ Tech Stack

### Frontend
- React 19 + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Zustand for state management
- Lucide Icons

### Backend
- Bun runtime
- Hono framework (Express-like, ultra-fast)
- MongoDB for data storage
- JWT authentication
- Zod for validation

### Infrastructure
- Docker & Docker Compose
- Nginx for production serving
- Health checks for all services

## 📦 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Bun (for backend development)

### Production Deployment

1. **Clone and configure**
   ```bash
   git clone <repository>
   cd shift-master
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Build and start all services**
   ```bash
   docker compose up -d --build
   ```

3. **Seed the database with mock data**
   ```bash
   docker compose run --rm seeder
   ```

4. **Access the application**
   - Frontend: http://localhost
   - API: http://localhost:3000

### Development Setup

1. **Start MongoDB**
   ```bash
   docker compose up -d mongodb
   ```

2. **Install & run backend**
   ```bash
   cd backend
   bun install
   bun run seed  # Seed mock data
   bun run dev   # Start dev server
   ```

3. **Install & run frontend**
   ```bash
   # In project root
   npm install
   npm run dev
   ```

## 🔐 Default Credentials

After seeding, use these accounts to log in:

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@shiftmaster.com    | password123 |
| Manager  | sarah@shiftmaster.com    | password123 |
| Employee | john@shiftmaster.com     | password123 |

## 📁 Project Structure

```
shift-master/
├── src/                    # Frontend source
│   ├── components/         # Reusable UI components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Route pages
│   ├── store/              # Zustand store
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── backend/                # Backend source
│   ├── src/
│   │   ├── models/         # Zod schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── utils/          # Database utils
│   │   └── seed/           # Mock data seeder
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # All services
├── Dockerfile              # Frontend container
├── nginx.conf              # Production nginx
└── .env.example            # Environment template
```

## 🔌 API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | /api/auth/login           | User login               |
| POST   | /api/auth/register        | User registration        |
| GET    | /api/auth/me              | Current user info        |
| GET    | /api/users                | List all users           |
| GET    | /api/teams                | List all teams           |
| GET    | /api/shifts               | List shifts (filterable) |
| POST   | /api/shifts               | Create shift             |
| GET    | /api/timeoff              | List time-off requests   |
| POST   | /api/timeoff              | Submit time-off request  |
| GET    | /api/notifications        | List notifications       |
| GET    | /api/dashboard/stats      | Dashboard statistics     |

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild and restart
docker compose up -d --build

# Seed database
docker compose run --rm seeder

# Access MongoDB shell
docker exec -it shiftmaster-mongodb mongosh
```

## 🔧 Environment Variables

| Variable             | Description                    | Default                |
|----------------------|--------------------------------|------------------------|
| MONGO_ROOT_USERNAME  | MongoDB admin username         | admin                  |
| MONGO_ROOT_PASSWORD  | MongoDB admin password         | password               |
| JWT_SECRET           | JWT signing secret             | (required in prod)     |
| CORS_ORIGIN          | Allowed CORS origins           | *                      |
| NODE_ENV             | Environment mode               | development            |

## 📄 License

MIT License - feel free to use for personal or commercial projects.
