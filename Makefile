.PHONY: run build test clean install help zip package

# Variables
PROJECT_NAME := $(shell node -p "require('./package.json').name")
VERSION := $(shell node -p "require('./package.json').version")
TIMESTAMP := $(shell date +%Y%m%d-%H%M%S)
ZIP_NAME := $(PROJECT_NAME)-v$(VERSION)-$(TIMESTAMP).zip

# Default target
help:
	@echo "Available commands:"
	@echo "  run     - Start the development server"
	@echo "  build   - Build for production"
	@echo "  test    - Run tests"
	@echo "  install - Install dependencies"
	@echo "  clean   - Clean node_modules and build"
	@echo "  zip     - Create versioned zip of build directory"
	@echo "  package - Build and then create zip"
	@echo "  help    - Show this help message"

# Start development server
run:
	npm start

# Build for production
build:
	npm run build

# Run tests
test:
	npm test

# Install dependencies
install:
	npm install

# Clean build artifacts and dependencies
clean:
	rm -rf node_modules build

# Clean and reinstall
reinstall: clean install

# Create versioned zip of build directory
zip:
	@if [ ! -d "build" ]; then \
		echo "Error: build directory does not exist. Run 'make build' first."; \
		exit 1; \
	fi
	@mkdir -p dist
	@echo "Creating zip: dist/$(ZIP_NAME)"
	@cd build && zip -r ../dist/$(ZIP_NAME) .
	@echo "✅ Successfully created: dist/$(ZIP_NAME)"

# Build and then create zip
package: build zip