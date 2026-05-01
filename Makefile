.DEFAULT_GOAL := help

.PHONY: help lock build dev down clean rebuild

PORT ?= 4000

# Ruby + Bundler versions used to regenerate Gemfile.lock from scratch.
# Keep these in sync with the Dockerfile.
RUBY_IMAGE     ?= ruby:3.3-slim
BUNDLER_VERSION ?= 2.6.9

help:
	@echo "Available targets:"
	@echo "  help     Show this help (default)"
	@echo "  lock     Regenerate Gemfile.lock from scratch in a clean Ruby container"
	@echo "           (run after editing Gemfile, or once to fix a broken lock)"
	@echo "  build    Build the Docker image with all gems baked in"
	@echo "           (run once, and after Gemfile / Gemfile.lock changes)"
	@echo "  dev      Start the Jekyll dev server          (PORT=$(PORT) by default)"
	@echo "  down     Stop and remove the Compose services"
	@echo "  clean    Remove generated Jekyll output (_site)"
	@echo "  rebuild  clean + build + dev (full reset)"

# Regenerate Gemfile.lock from scratch so platforms (aarch64-linux + x86_64-linux)
# and BUNDLED WITH always agree with the image. Runs in a one-shot container so
# nothing is installed on the host.
lock:
	@echo ">> Regenerating Gemfile.lock with Bundler $(BUNDLER_VERSION) in $(RUBY_IMAGE)..."
	rm -f Gemfile.lock
	docker run --rm \
	    -v "$(CURDIR):/site" \
	    -w /site \
	    $(RUBY_IMAGE) \
	    bash -c "set -e; \
	             apt-get update -qq && \
	             apt-get install -y --no-install-recommends git build-essential ca-certificates >/dev/null && \
	             gem install bundler -v $(BUNDLER_VERSION) --no-document && \
	             bundle _$(BUNDLER_VERSION)_ config set --local path /tmp/bundle && \
	             bundle _$(BUNDLER_VERSION)_ install --jobs 4 --retry 3 && \
	             bundle _$(BUNDLER_VERSION)_ lock --add-platform x86_64-linux aarch64-linux && \
	             rm -rf .bundle"
	@echo ">> Gemfile.lock regenerated. Run 'make build' next."

build:
	docker compose build

dev:
	JEKYLL_PORT=$(PORT) docker compose up

down:
	docker compose down

clean:
	rm -rf _site

rebuild: clean build dev
