.PHONY: help install dev build test clean lint format

help:
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make dev        - Start all development services"
	@echo "  make build      - Build all packages and apps"
	@echo "  make test       - Run all tests"
	@echo "  make clean      - Clean all node_modules and build artifacts"
	@echo "  make lint       - Run linter on all packages"
	@echo "  make format     - Format all code with Prettier"
	@echo "  make typecheck  - Run TypeScript type checking"
	@echo "  make docker-up  - Start Docker Compose services"
	@echo "  make docker-down- Stop Docker Compose services"

install:
	npm install

dev:
	npm run dev

dev:dashboard:
	npm run dev:dashboard

dev:api:
	npm run dev:api

dev:worker:
	npm run dev:worker

build:
	npm run build

test:
	npm run test

clean:
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf services/*/node_modules
	rm -rf apps/*/dist
	rm -rf packages/*/dist
	rm -rf services/*/dist
	rm -rf apps/*/.next
	rm -rf apps/*/build

lint:
	npm run lint

format:
	npm run format

typecheck:
	npm run typecheck

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

setup:
	make install
	cp .env.example .env
	@echo "Setup complete! Please edit .env with your API keys."

agent:create:
	@if [ -z "$(name)" ]; then echo "Usage: make agent:create name=AgentName"; exit 1; fi
	@echo "Creating agent: $(name)"
	@mkdir -p packages/agents/src/agents/$(shell echo $(name) | tr '[:upper:]' '[:lower:]')
	@echo "Agent created: packages/agents/src/agents/$(shell echo $(name) | tr '[:upper:]' '[:lower:])"
