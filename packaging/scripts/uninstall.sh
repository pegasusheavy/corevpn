#!/bin/bash
# Uninstall CoreVPN
set -e

PREFIX="/usr/local"
PURGE=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --prefix)
            PREFIX="$2"
            shift 2
            ;;
        --purge)
            PURGE=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --prefix DIR    Installation prefix (default: /usr/local)"
            echo "  --purge         Remove all data including certificates and logs"
            echo "  --help          Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "=== Uninstalling CoreVPN ==="
echo "Prefix: ${PREFIX}"
echo "Purge data: ${PURGE}"

# Check for root
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root"
    exit 1
fi

# Stop services
echo "Stopping services..."
if command -v systemctl &> /dev/null; then
    systemctl stop corevpn-server corevpn-web 2>/dev/null || true
    systemctl disable corevpn-server corevpn-web 2>/dev/null || true
fi

if command -v rc-service &> /dev/null; then
    rc-service corevpn-server stop 2>/dev/null || true
    rc-service corevpn-web stop 2>/dev/null || true
    rc-update del corevpn-server 2>/dev/null || true
    rc-update del corevpn-web 2>/dev/null || true
fi

# Remove binaries
echo "Removing binaries..."
rm -f "${PREFIX}/bin/corevpn-server"
rm -f "${PREFIX}/bin/corevpn-cli"

# Remove systemd units
echo "Removing systemd units..."
rm -f /lib/systemd/system/corevpn-server.service
rm -f /lib/systemd/system/corevpn-server@.service
rm -f /lib/systemd/system/corevpn-web.service
if command -v systemctl &> /dev/null; then
    systemctl daemon-reload
fi

# Remove OpenRC scripts
echo "Removing OpenRC scripts..."
rm -f /etc/init.d/corevpn-server
rm -f /etc/init.d/corevpn-web
rm -f /etc/conf.d/corevpn-server
rm -f /etc/conf.d/corevpn-web

# Purge data if requested
if [[ "${PURGE}" == "true" ]]; then
    echo "Purging data..."
    rm -rf /var/lib/corevpn
    rm -rf /var/log/corevpn
    rm -rf /etc/corevpn

    # Remove user and group
    if getent passwd corevpn >/dev/null; then
        userdel corevpn 2>/dev/null || true
    fi
    if getent group corevpn >/dev/null; then
        groupdel corevpn 2>/dev/null || true
    fi

    echo "All data purged."
else
    echo ""
    echo "Data directories preserved:"
    echo "  /var/lib/corevpn (certificates, state)"
    echo "  /var/log/corevpn (logs)"
    echo "  /etc/corevpn (configuration)"
    echo ""
    echo "To completely remove, run: $0 --purge"
fi

echo ""
echo "=== Uninstall complete ==="
