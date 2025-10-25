# Makefile for Murray Irrigation Dashboard

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make install   - Install dependencies"
	@echo "  make dev       - Start development server"
	@echo "  make build     - Build project for production"
	@echo "  make preview   - Preview production build"
	@echo "  make clean     - Remove node_modules and dist folders"

.PHONY: install
install:
	@echo "Installing dependencies..."
	npm install

.PHONY: dev
dev:
	@echo "Starting Vite development server..."
	npm run dev

.PHONY: build
build:
	@echo "Building production bundle..."
	npm run build

.PHONY: preview
preview:
	@echo "Previewing production build..."
	npm run preview

.PHONY: clean
clean:
	@echo "Cleaning project..."
	rm -rf node_modules dist
