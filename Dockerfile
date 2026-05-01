# Jekyll dev image for arc42.de
#
# Strategy:
#   - Pin Ruby & Bundler in the image so every developer (and CI) builds the
#     exact same gem set, regardless of host OS / arch.
#   - Trust the official ruby:3.3-slim image's defaults for gem layout:
#         GEM_HOME=/usr/local/bundle      (gems land at /usr/local/bundle/gems)
#         BUNDLE_APP_CONFIG=/usr/local/bundle
#     Do NOT set BUNDLE_PATH — that would switch bundler to its "vendor"
#     layout (/usr/local/bundle/ruby/<ver>/gems) and the runtime would no
#     longer find what `bundle install` placed during build.
#   - The site source is bind-mounted at /site by docker-compose for live
#     edits; /site is *separate* from /usr/local/bundle so the host can
#     never shadow the installed gems.
#
# Rebuild only when Gemfile or Gemfile.lock changes:  `make build`
# Run the dev server:                                 `make dev`

FROM ruby:3.3-slim

# Native build deps. Most gems (incl. nokogiri) ship precompiled binaries for
# linux-gnu, but having a toolchain available makes the image robust against
# any pure-Ruby fallback.
RUN apt-get update -qq \
 && apt-get install -y --no-install-recommends \
        build-essential \
        git \
        ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Pin Bundler. 2.6+ understands the modern "<arch>-linux-gnu" platform tuples
# that newer rubygems-resolved lockfiles use; older bundlers choke on them
# with "Could not find <gem>-<ver>-aarch64-linux-gnu in locally installed gems".
ARG BUNDLER_VERSION=2.6.9
RUN gem install bundler -v "${BUNDLER_VERSION}" --no-document

# Frozen via env: takes effect at runtime too, and survives the .:/site mount
# (a project-local .bundle/config would be shadowed by the bind mount).
ENV BUNDLE_FROZEN=true

WORKDIR /site

# Copy only dependency manifests first so the bundle-install layer is cached.
COPY Gemfile Gemfile.lock ./

RUN bundle install --jobs 4 --retry 3

EXPOSE 4000
