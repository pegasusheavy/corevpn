#!/bin/bash
# Build Alpine APK packages for CoreVPN
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BUILD_DIR="${PROJECT_ROOT}/build/alpine"
VERSION="${VERSION:-0.1.0}"

echo "=== Building CoreVPN Alpine packages ==="
echo "Version: ${VERSION}"
echo "Build directory: ${BUILD_DIR}"

# Clean and create build directory
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Create source tarball
echo "Creating source tarball..."
cd "${PROJECT_ROOT}"
TARBALL_NAME="corevpn-${VERSION}.tar.gz"
tar --exclude='./build' \
    --exclude='./target' \
    --exclude='./.git' \
    --transform "s,^\.,corevpn-${VERSION}," \
    -czf "${BUILD_DIR}/${TARBALL_NAME}" .

# Copy APKBUILD and support files
echo "Copying packaging files..."
cp "${PROJECT_ROOT}/packaging/alpine/APKBUILD" "${BUILD_DIR}/"
cp "${PROJECT_ROOT}/packaging/alpine/"*.initd "${BUILD_DIR}/"
cp "${PROJECT_ROOT}/packaging/alpine/"*.confd "${BUILD_DIR}/"
cp "${PROJECT_ROOT}/packaging/alpine/"*.pre-install "${BUILD_DIR}/" 2>/dev/null || true
cp "${PROJECT_ROOT}/packaging/alpine/"*.post-install "${BUILD_DIR}/" 2>/dev/null || true
cp "${PROJECT_ROOT}/packaging/alpine/"*.pre-deinstall "${BUILD_DIR}/" 2>/dev/null || true

# Update version in APKBUILD
sed -i "s/^pkgver=.*/pkgver=${VERSION}/" "${BUILD_DIR}/APKBUILD"

# Generate checksums
echo "Generating checksums..."
cd "${BUILD_DIR}"
sha512sum "${TARBALL_NAME}" *.initd *.confd > checksums.txt

# Update checksums in APKBUILD
cat checksums.txt

echo ""
echo "=== Alpine package source prepared ==="
echo "Build directory: ${BUILD_DIR}"
echo ""
echo "To build the package:"
echo "  1. Install Alpine SDK: apk add alpine-sdk"
echo "  2. Set up abuild: abuild-keygen -a -i"
echo "  3. cd ${BUILD_DIR}"
echo "  4. Update sha512sums in APKBUILD with values from checksums.txt"
echo "  5. Run: abuild -r"
echo ""
echo "Or on an Alpine system with proper setup:"
echo "  cd ${BUILD_DIR} && abuild checksum && abuild -r"
echo ""
