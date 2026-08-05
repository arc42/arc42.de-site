.DEFAULT_GOAL := help

.PHONY: help dev build stop site check-links test-theme clean install update shell logs

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

dev: ## Start the local Jekyll dev server with live reload (http://localhost:4000)
	@echo "==> Open http://localhost:4000  (NOT http://0.0.0.0:4000 — Firefox refuses to connect to 0.0.0.0)"
	@docker compose down --remove-orphans >/dev/null 2>&1 || true
	@holder=$$(docker ps --filter "publish=4000" --format '{{.Names}}'); \
	if [ -n "$$holder" ]; then \
		echo "==> Port 4000 is already in use by another container: $$holder"; \
		echo "==> That's likely a dev server from a sibling arc42 site repo. Stop it first, e.g.:"; \
		echo "==>   docker stop $$holder"; \
		exit 1; \
	fi
	docker compose up --build

build: ## Build the Docker dev image (arc42-site:latest) from the Gemfile-pinned gems
	docker compose build

stop: ## Stop and remove the running dev container
	docker compose down

site: build ## Generate the static site into _site/
	docker compose run --rm jekyll bundle exec jekyll build

check-links: site ## Validate internal links, images, and HTML in the built _site (html-proofer)
	docker compose run --rm jekyll bundle exec htmlproofer ./_site --disable-external --allow-hash-href

# Structural assertions about the GENERATED site — the things html-proofer does
# not look at: that the vendored theme is really self-sufficient, that permalinks
# stay directory-style, and that no absolute/stale host leaks into the output.
#
# It ran with `docker run --network none arc42-jekyll` before the build stack was
# unified with arc42.org-site. `docker compose run` has no --network flag, so the
# offline guarantee is now carried by the log grep below instead: a remote-theme
# fetch or a missing include/layout shows up in the Jekyll log either way.
test-theme: build ## Assert the generated _site uses local theme files and clean URLs
	@echo ">> Building and asserting structure of _site..."
	docker compose run --rm jekyll \
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
	           if grep -R -E "href=\"/(about|anmeldung|anmeldungEN|articles|books|canvas|consulting|contact|gallery|imprint|info-adoc|info-improve|info-msa|info-msa-EN|info-req4arc|license|method|more|overview|publikationen|recommendations|schulungen|search|status|talks|termine|terms|terms-en|videos)(#[^\"]*)?\"" _site; then \
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
	           if grep -E "<loc>https://arc42\.de/(about|anmeldung|anmeldungEN|articles|books|canvas|consulting|contact|gallery|imprint|info-adoc|info-improve|info-msa|info-msa-EN|info-req4arc|license|method|more|overview|publikationen|recommendations|schulungen|search|status|talks|termine|terms|terms-en|videos|articles/2022-11-requirements-overview)</loc>" _site/sitemap.xml; then \
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
	           test -f _site/publikationen/index.html; \
	           test -f _site/publikationen/arc42-in-aktion/index.html; \
	           test -f _site/sitemap.xml; \
	           test -f _site/assets/js/main.min.js'
	@echo ">> test-theme OK"

clean: ## Remove generated _site AND the Docker cache volumes (a true reset)
	rm -rf _site .sass-cache .jekyll-cache .jekyll-metadata
	@# .jekyll-cache/.sass-cache live in named Docker volumes, not on the host,
	@# so a host rm alone leaves them stale — wipe the volumes too.
	-docker compose down -v --remove-orphans

install: build ## Install/refresh gems into the dev image after editing the Gemfile
	docker compose run --rm jekyll bundle install

update: build ## Update gems to their latest allowed versions (rewrites Gemfile.lock)
	docker compose run --rm jekyll bundle update

shell: build ## Open a shell inside the dev container for debugging
	docker compose run --rm jekyll bash

logs: ## Tail logs from the running dev container
	docker compose logs -f jekyll
