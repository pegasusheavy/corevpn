#!/bin/bash
# Build Debian packages for CoreVPN
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BUILD_DIR="${PROJECT_ROOT}/build/deb"
VERSION="${VERSION:-0.1.0}"

echo "=== Building CoreVPN Debian packages ==="
echo "Version: ${VERSION}"
echo "Build directory: ${BUILD_DIR}"

# Clean and create build directory
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Build release binaries
echo "Building release binaries..."
cd "${PROJECT_ROOT}"
cargo build --release --locked

# Create package structure
echo "Creating package structure..."
PKG_ROOT="${BUILD_DIR}/corevpn-${VERSION}"
mkdir -p "${PKG_ROOT}"

# Copy debian files
cp -r "${PROJECT_ROOT}/packaging/debian" "${PKG_ROOT}/"

# Copy source
cp -r "${PROJECT_ROOT}/Cargo.toml" "${PROJECT_ROOT}/Cargo.lock" "${PKG_ROOT}/"
cp -r "${PROJECT_ROOT}/crates" "${PKG_ROOT}/"
cp -r "${PROJECT_ROOT}/packaging" "${PKG_ROOT}/"

# Create tarball
cd "${BUILD_DIR}"
tar czf "corevpn_${VERSION}.orig.tar.gz" "corevpn-${VERSION}"

# Build package
cd "${PKG_ROOT}"
if command -v debuild &> /dev/null; then
    debuild -us -uc -b
    echo "=== Package built successfully ==="
    echo "Packages available in: ${BUILD_DIR}"
    ls -la "${BUILD_DIR}"/*.deb 2>/dev/null || echo "No .deb files found"
else
    echo "debuild not found. Install with: apt-get install devscripts"
    echo "Package source prepared in: ${PKG_ROOT}"
    echo "Run 'dpkg-buildpackage -us -uc -b' to build"
fi
