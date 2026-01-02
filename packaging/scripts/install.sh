#!/bin/bash
# Install CoreVPN from source
# Usage: ./install.sh [--prefix /usr/local] [--systemd] [--openrc]
set -e

PREFIX="/usr/local"
INSTALL_SYSTEMD=false
INSTALL_OPENRC=false
DATA_DIR="/var/lib/corevpn"
CONFIG_DIR="/etc/corevpn"
LOG_DIR="/var/log/corevpn"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --prefix)
            PREFIX="$2"
            shift 2
            ;;
        --systemd)
            INSTALL_SYSTEMD=true
            shift
            ;;
        --openrc)
            INSTALL_OPENRC=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --prefix DIR    Installation prefix (default: /usr/local)"
            echo "  --systemd       Install systemd service units"
            echo "  --openrc        Install OpenRC init scripts"
            echo "  --help          Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "=== Installing CoreVPN ==="
echo "Prefix: ${PREFIX}"
echo "Systemd: ${INSTALL_SYSTEMD}"
echo "OpenRC: ${INSTALL_OPENRC}"

# Check for root
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root"
    exit 1
fi

# Build if needed
if [[ ! -f "${PROJECT_ROOT}/target/release/corevpn-server" ]]; then
    echo "Building release binaries..."
    cd "${PROJECT_ROOT}"
    cargo build --release --locked
fi

# Create user and group
echo "Creating corevpn user and group..."
if ! getent group corevpn >/dev/null; then
    groupadd --system corevpn
fi

if ! getent passwd corevpn >/dev/null; then
    useradd --system --gid corevpn --home "${DATA_DIR}" \
            --shell /usr/sbin/nologin --comment "CoreVPN Server" corevpn
fi

# Install binaries
echo "Installing binaries..."
install -d -m 0755 "${PREFIX}/bin"
install -m 0755 "${PROJECT_ROOT}/target/release/corevpn-server" "${PREFIX}/bin/"
install -m 0755 "${PROJECT_ROOT}/target/release/corevpn-cli" "${PREFIX}/bin/" 2>/dev/null || true

# Create directories
echo "Creating directories..."
install -d -m 0750 -o corevpn -g corevpn "${DATA_DIR}"
install -d -m 0750 -o corevpn -g corevpn "${LOG_DIR}"
install -d -m 0750 -o root -g corevpn "${CONFIG_DIR}"

# Install configuration
echo "Installing configuration..."
if [[ ! -f "${CONFIG_DIR}/config.toml" ]]; then
    install -m 0640 -o root -g corevpn \
        "${PROJECT_ROOT}/packaging/config/config.toml.example" \
        "${CONFIG_DIR}/config.toml"
fi

if [[ ! -f "${CONFIG_DIR}/environment" ]]; then
    install -m 0600 -o root -g root \
        "${PROJECT_ROOT}/packaging/config/environment.example" \
        "${CONFIG_DIR}/environment"
fi

# Install systemd units
if [[ "${INSTALL_SYSTEMD}" == "true" ]]; then
    echo "Installing systemd units..."
    install -d -m 0755 /lib/systemd/system
    install -m 0644 "${PROJECT_ROOT}/packaging/systemd/corevpn-server.service" /lib/systemd/system/
    install -m 0644 "${PROJECT_ROOT}/packaging/systemd/corevpn-server@.service" /lib/systemd/system/
    install -m 0644 "${PROJECT_ROOT}/packaging/systemd/corevpn-web.service" /lib/systemd/system/

    # Update binary path if prefix is not /usr
    if [[ "${PREFIX}" != "/usr" ]]; then
        sed -i "s|/usr/bin/corevpn-server|${PREFIX}/bin/corevpn-server|g" \
            /lib/systemd/system/corevpn-server.service \
            /lib/systemd/system/corevpn-server@.service \
            /lib/systemd/system/corevpn-web.service
    fi

    systemctl daemon-reload
    echo "  Installed: corevpn-server.service"
    echo "  Installed: corevpn-server@.service"
    echo "  Installed: corevpn-web.service"
fi

# Install OpenRC scripts
if [[ "${INSTALL_OPENRC}" == "true" ]]; then
    echo "Installing OpenRC scripts..."
    install -d -m 0755 /etc/init.d
    install -d -m 0755 /etc/conf.d

    install -m 0755 "${PROJECT_ROOT}/packaging/openrc/corevpn-server" /etc/init.d/
    install -m 0755 "${PROJECT_ROOT}/packaging/openrc/corevpn-web" /etc/init.d/
    install -m 0644 "${PROJECT_ROOT}/packaging/openrc/conf.d/corevpn-server" /etc/conf.d/
    install -m 0644 "${PROJECT_ROOT}/packaging/openrc/conf.d/corevpn-web" /etc/conf.d/

    # Update binary path if prefix is not /usr
    if [[ "${PREFIX}" != "/usr" ]]; then
        sed -i "s|/usr/bin/corevpn-server|${PREFIX}/bin/corevpn-server|g" \
            /etc/init.d/corevpn-server /etc/init.d/corevpn-web
    fi

    echo "  Installed: /etc/init.d/corevpn-server"
    echo "  Installed: /etc/init.d/corevpn-web"
fi

# Ensure TUN device
echo "Checking TUN device..."
if [[ ! -c /dev/net/tun ]]; then
    modprobe tun 2>/dev/null || true
fi

echo ""
echo "=== Installation complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit ${CONFIG_DIR}/config.toml"
echo "     Set 'public_host' to your server's address"
echo ""
echo "  2. Initialize PKI:"
echo "     ${PREFIX}/bin/corevpn-server setup --data-dir ${DATA_DIR}"
echo ""
echo "  3. Set admin password:"
echo "     echo 'COREVPN_ADMIN_PASSWORD=\$(openssl rand -base64 32)' >> ${CONFIG_DIR}/environment"
echo ""
if [[ "${INSTALL_SYSTEMD}" == "true" ]]; then
    echo "  4. Start the server:"
    echo "     systemctl enable --now corevpn-server"
elif [[ "${INSTALL_OPENRC}" == "true" ]]; then
    echo "  4. Start the server:"
    echo "     rc-update add corevpn-server default"
    echo "     rc-service corevpn-server start"
else
    echo "  4. Start the server manually:"
    echo "     ${PREFIX}/bin/corevpn-server run --config ${CONFIG_DIR}/config.toml"
fi
echo ""
echo "For ghost mode (no logging):"
echo "  ${PREFIX}/bin/corevpn-server run --ghost --config ${CONFIG_DIR}/config.toml"
