.DEFAULT_GOAL := help

.PHONY: help clean dev down

PORT ?= 4000

help:
	@echo "Available targets:"
	@echo "  help        Show this help (default)"
	@echo "  dev         Start local Jekyll via Docker Compose (PORT=4000 by default)"
	@echo "  down        Stop and remove Docker Compose services"
	@echo "  clean       Remove generated Jekyll output (_site)"

clean:
	rm -rf _site

dev:
	JEKYLL_PORT=$(PORT) docker compose up

down:
	docker compose down
