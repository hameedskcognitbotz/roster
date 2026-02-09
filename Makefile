.PHONY: dev prod build seed logs clean help

# Development
dev:
	@echo "🚀 Starting development environment..."
	docker compose up -d mongodb
	@echo "⏳ Waiting for MongoDB..."
	@sleep 3
	@echo "🌱 Seeding database..."
	cd backend && bun run seed
	@echo "✅ MongoDB ready at localhost:27017"
	@echo ""
	@echo "Run these in separate terminals:"
	@echo "  Backend:  cd backend && bun run dev"
	@echo "  Frontend: npm run dev"

# Production
prod:
	@echo "🏭 Starting production environment..."
	docker compose up -d --build
	@echo "✅ Production stack started!"
	@echo "   Frontend: http://localhost"
	@echo "   API: http://localhost:3000"

# Build only
build:
	@echo "🔨 Building containers..."
	docker compose build

# Seed database
seed:
	@echo "🌱 Seeding database..."
	docker compose run --rm seeder

# View logs
logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

# Stop all containers
stop:
	docker compose down

# Clean everything
clean:
	@echo "🧹 Cleaning up..."
	docker compose down -v --rmi local
	@echo "✅ Cleaned!"

# Status
status:
	docker compose ps

# Help
help:
	@echo "ShiftMaster - Available Commands"
	@echo ""
	@echo "  make dev      - Start development environment (MongoDB only)"
	@echo "  make prod     - Start production environment (all services)"
	@echo "  make build    - Build all containers"
	@echo "  make seed     - Seed database with mock data"
	@echo "  make logs     - View all container logs"
	@echo "  make stop     - Stop all containers"
	@echo "  make clean    - Stop & remove containers, volumes, images"
	@echo "  make status   - Show container status"
	@echo ""
