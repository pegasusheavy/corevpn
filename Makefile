# CoreVPN Makefile
# Build, test, and package CoreVPN

.PHONY: all build release test clean install uninstall deb rpm

VERSION ?= 0.1.0
PREFIX ?= /usr/local
CARGO ?= cargo

# Default target
all: build

# Development build
build:
	$(CARGO) build

# Release build
release:
	$(CARGO) build --release --locked

# Run tests
test:
	$(CARGO) test

# Run clippy
lint:
	$(CARGO) clippy -- -D warnings

# Format code
fmt:
	$(CARGO) fmt

# Check formatting
fmt-check:
	$(CARGO) fmt -- --check

# Clean build artifacts
clean:
	$(CARGO) clean
	rm -rf build/

# Install to system (requires root)
install: release
	@sudo packaging/scripts/install.sh --prefix $(PREFIX) --systemd

install-openrc: release
	@sudo packaging/scripts/install.sh --prefix $(PREFIX) --openrc

# Uninstall from system
uninstall:
	@sudo packaging/scripts/uninstall.sh --prefix $(PREFIX)

uninstall-purge:
	@sudo packaging/scripts/uninstall.sh --prefix $(PREFIX) --purge

# Build Debian package
deb: release
	@VERSION=$(VERSION) packaging/scripts/build-deb.sh

# Build RPM package
rpm: release
	@VERSION=$(VERSION) packaging/scripts/build-rpm.sh

# Build all packages
packages: deb rpm

# Run the server (development)
run:
	$(CARGO) run -p corevpn-server -- run --config packaging/config/config.toml.example

# Run with ghost mode (no logging)
run-ghost:
	$(CARGO) run -p corevpn-server -- run --ghost --config packaging/config/config.toml.example

# Generate documentation
docs:
	$(CARGO) doc --no-deps --open

# Run benchmarks
bench:
	$(CARGO) bench

# Security audit
audit:
	$(CARGO) audit

# Check for outdated dependencies
outdated:
	$(CARGO) outdated

# Help
help:
	@echo "CoreVPN Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  build          Development build"
	@echo "  release        Release build (optimized)"
	@echo "  test           Run tests"
	@echo "  lint           Run clippy"
	@echo "  fmt            Format code"
	@echo "  clean          Clean build artifacts"
	@echo ""
	@echo "  install        Install to system with systemd"
	@echo "  install-openrc Install to system with OpenRC"
	@echo "  uninstall      Uninstall from system"
	@echo "  uninstall-purge Uninstall and remove all data"
	@echo ""
	@echo "  deb            Build Debian package"
	@echo "  rpm            Build RPM package"
	@echo "  packages       Build all packages"
	@echo ""
	@echo "  run            Run server (development)"
	@echo "  run-ghost      Run server with ghost mode (no logging)"
	@echo ""
	@echo "Variables:"
	@echo "  VERSION        Package version (default: $(VERSION))"
	@echo "  PREFIX         Installation prefix (default: $(PREFIX))"
