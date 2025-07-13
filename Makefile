.PHONY: run build test clean install help

# Default target
help:
	@echo "Available commands:"
	@echo "  run     - Start the development server"
	@echo "  build   - Build for production"
	@echo "  test    - Run tests"
	@echo "  install - Install dependencies"
	@echo "  clean   - Clean node_modules and build"
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