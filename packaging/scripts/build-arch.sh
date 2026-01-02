#!/bin/bash
# Build Arch Linux packages for CoreVPN
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BUILD_DIR="${PROJECT_ROOT}/build/archlinux"
VERSION="${VERSION:-0.1.0}"

echo "=== Building CoreVPN Arch Linux packages ==="
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

# Copy PKGBUILD and support files
echo "Copying packaging files..."
cp "${PROJECT_ROOT}/packaging/archlinux/PKGBUILD" "${BUILD_DIR}/"
cp "${PROJECT_ROOT}/packaging/archlinux/"*.service "${BUILD_DIR}/"
cp "${PROJECT_ROOT}/packaging/archlinux/"*.sysusers "${BUILD_DIR}/"
cp "${PROJECT_ROOT}/packaging/archlinux/"*.tmpfiles "${BUILD_DIR}/"
cp "${PROJECT_ROOT}/packaging/archlinux/"*.install "${BUILD_DIR}/" 2>/dev/null || true

# Update version in PKGBUILD
sed -i "s/^pkgver=.*/pkgver=${VERSION}/" "${BUILD_DIR}/PKGBUILD"

# Generate checksums
echo "Generating checksums..."
cd "${BUILD_DIR}"

# Calculate SHA256 sums
echo "SHA256 checksums:"
sha256sum "${TARBALL_NAME}" *.service *.sysusers *.tmpfiles | tee checksums.txt

echo ""
echo "=== Arch Linux package source prepared ==="
echo "Build directory: ${BUILD_DIR}"
echo ""
echo "To build the package:"
echo "  1. Install base-devel: pacman -S base-devel"
echo "  2. cd ${BUILD_DIR}"
echo "  3. Update sha256sums in PKGBUILD with values from checksums.txt"
echo "  4. Run: makepkg -si"
echo ""
echo "Or with automatic checksum update:"
echo "  cd ${BUILD_DIR} && updpkgsums && makepkg -si"
echo ""
echo "To build in a clean chroot (recommended for distributing):"
echo "  cd ${BUILD_DIR} && updpkgsums && makechrootpkg -c -r /path/to/chroot"
echo ""
