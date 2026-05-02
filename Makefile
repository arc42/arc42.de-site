.DEFAULT_GOAL := help

.PHONY: help lock build dev down clean test-theme rebuild

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
	@echo "  test-theme"
	@echo "           Build the site offline and assert local theme files are used"
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

test-theme:
	@echo ">> Building with Docker networking disabled..."
	docker run --rm --network none \
	    -v "$(CURDIR):/site" \
	    -w /site \
	    arc42-jekyll \
	    sh -c 'set -e; \
	           bundle exec jekyll build --trace > /tmp/jekyll-build.log 2>&1; \
	           cat /tmp/jekyll-build.log; \
	           if grep -E "Remote Theme|remote_theme|GitHub fetch|Liquid Exception|Could not locate" /tmp/jekyll-build.log; then \
	               echo "Unexpected remote theme fetch or missing theme file"; \
	               exit 1; \
	           fi; \
	           if find _site -maxdepth 1 -name "*.html" ! -name "index.html" ! -name "404.html" ! -name "google5890aff093735c50.html" | grep .; then \
	               echo "Unexpected top-level .html page output; use directory-style permalinks ending in /"; \
	               exit 1; \
	           fi; \
	           if grep -R -E "href=\"/(about|anmeldung|anmeldungEN|articles|books|canvas|consulting|contact|gallery|imprint|info-adoc|info-improve|info-msa|info-msa-EN|info-req4arc|license|method|more|overview|recommendations|schulungen|search|status|talks|termine|terms|terms-en|videos)(#[^\"]*)?\"" _site; then \
	               echo "Unexpected internal page link without trailing slash"; \
	               exit 1; \
	           fi; \
	           if grep -R -E "https://www\.arc42\.de|http://0\.0\.0\.0:4000" _site; then \
	               echo "Unexpected generated link host; use https://arc42.de for production and localhost-relative links for navigation"; \
	               exit 1; \
	           fi; \
	           if grep -R -E "<a [^>]*href=\"https://arc42\.de/" _site; then \
	               echo "Unexpected absolute same-site anchor link; use relative_url/root-relative links for internal navigation"; \
	               exit 1; \
	           fi; \
	           if grep -E "https://www\.arc42\.de|/anmeldungen|/info-msa-en|/_pages/" _site/sitemap.xml; then \
	               echo "Unexpected stale sitemap URL"; \
	               exit 1; \
	           fi; \
	           if grep -E "<loc>https://arc42\.de/(about|anmeldung|anmeldungEN|articles|books|canvas|consulting|contact|gallery|imprint|info-adoc|info-improve|info-msa|info-msa-EN|info-req4arc|license|method|more|overview|recommendations|schulungen|search|status|talks|termine|terms|terms-en|videos|articles/2022-11-requirements-overview)</loc>" _site/sitemap.xml; then \
	               echo "Unexpected sitemap page URL without trailing slash"; \
	               exit 1; \
	           fi; \
	           test -f _site/index.html; \
	           test -f _site/imprint/index.html; \
	           test -f _site/overview/index.html; \
	           test -f _site/termine/index.html; \
	           test -f _site/anmeldung/index.html; \
	           test -f _site/about/index.html; \
	           test -f _site/articles/index.html; \
	           test -f _site/recommendations/index.html; \
	           test -f _site/gallery/index.html; \
	           test -f _site/videos/index.html; \
	           test -f _site/sitemap.xml; \
	           test -f _site/assets/js/main.min.js'

rebuild: clean build dev
