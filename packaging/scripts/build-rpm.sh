#!/bin/bash
# Build RPM packages for CoreVPN
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BUILD_DIR="${PROJECT_ROOT}/build/rpm"
VERSION="${VERSION:-0.1.0}"

echo "=== Building CoreVPN RPM packages ==="
echo "Version: ${VERSION}"
echo "Build directory: ${BUILD_DIR}"

# Clean and create build directory structure
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"/{BUILD,RPMS,SOURCES,SPECS,SRPMS}

# Build release binaries
echo "Building release binaries..."
cd "${PROJECT_ROOT}"
cargo build --release --locked

# Create source tarball
echo "Creating source tarball..."
TARBALL_DIR="${BUILD_DIR}/corevpn-${VERSION}"
mkdir -p "${TARBALL_DIR}"

cp -r "${PROJECT_ROOT}/Cargo.toml" "${PROJECT_ROOT}/Cargo.lock" "${TARBALL_DIR}/"
cp -r "${PROJECT_ROOT}/crates" "${TARBALL_DIR}/"
cp -r "${PROJECT_ROOT}/packaging" "${TARBALL_DIR}/"
cp -r "${PROJECT_ROOT}/target" "${TARBALL_DIR}/" 2>/dev/null || true

# Create LICENSE files if they don't exist
if [ ! -f "${TARBALL_DIR}/LICENSE-MIT" ]; then
    echo "MIT License - see https://opensource.org/licenses/MIT" > "${TARBALL_DIR}/LICENSE-MIT"
fi
if [ ! -f "${TARBALL_DIR}/LICENSE-APACHE" ]; then
    echo "Apache License 2.0 - see https://www.apache.org/licenses/LICENSE-2.0" > "${TARBALL_DIR}/LICENSE-APACHE"
fi

cd "${BUILD_DIR}"
tar czf "SOURCES/corevpn-${VERSION}.tar.gz" "corevpn-${VERSION}"
rm -rf "corevpn-${VERSION}"

# Copy spec file
cp "${PROJECT_ROOT}/packaging/rpm/corevpn.spec" "${BUILD_DIR}/SPECS/"

# Update version in spec file
sed -i "s/^Version:.*/Version:        ${VERSION}/" "${BUILD_DIR}/SPECS/corevpn.spec"

# Build RPM
echo "Building RPM..."
if command -v rpmbuild &> /dev/null; then
    rpmbuild --define "_topdir ${BUILD_DIR}" -bb "${BUILD_DIR}/SPECS/corevpn.spec"
    echo "=== Package built successfully ==="
    echo "Packages available in: ${BUILD_DIR}/RPMS"
    find "${BUILD_DIR}/RPMS" -name "*.rpm" -ls 2>/dev/null || echo "No .rpm files found"
else
    echo "rpmbuild not found. Install with: dnf install rpm-build"
    echo "Spec file prepared in: ${BUILD_DIR}/SPECS/corevpn.spec"
    echo "Source tarball in: ${BUILD_DIR}/SOURCES/"
fi
