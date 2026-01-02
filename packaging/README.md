# CoreVPN Packaging

This directory contains packaging files for various Linux distributions.

## Supported Distributions

| Distribution | Init System | Package Format | Build Tool |
|--------------|-------------|----------------|------------|
| Debian/Ubuntu | systemd | .deb | dpkg-buildpackage |
| RHEL/Fedora/CentOS | systemd | .rpm | rpmbuild |
| Alpine Linux | OpenRC | .apk | abuild |
| Arch Linux | systemd | .pkg.tar.zst | makepkg |

## Quick Build

Use the Makefile from the project root:

```bash
# Build all packages
make packages

# Build individual packages
make deb      # Debian/Ubuntu
make rpm      # RHEL/Fedora/CentOS
make alpine   # Alpine Linux
make arch     # Arch Linux
```

## Directory Structure

```
packaging/
├── alpine/           # Alpine Linux APKBUILD and support files
├── archlinux/        # Arch Linux PKGBUILD and support files
├── config/           # Default configuration files
├── debian/           # Debian packaging files
├── openrc/           # OpenRC init scripts (Alpine, Gentoo)
├── rpm/              # RPM spec file
├── scripts/          # Build scripts
└── systemd/          # systemd unit files
```

## Building Packages

### Debian/Ubuntu

Requirements:
- `devscripts`
- `build-essential`
- `cargo` and `rust`

```bash
# Install build dependencies
sudo apt-get install devscripts build-essential cargo

# Build packages
make deb

# Or manually
./packaging/scripts/build-deb.sh
```

### RHEL/Fedora/CentOS

Requirements:
- `rpm-build`
- `cargo` and `rust`

```bash
# Install build dependencies
sudo dnf install rpm-build cargo rust

# Build packages
make rpm

# Or manually
./packaging/scripts/build-rpm.sh
```

### Alpine Linux

Requirements:
- `alpine-sdk`
- `cargo` and `rust`

```bash
# Install build dependencies
apk add alpine-sdk cargo rust

# Set up abuild
abuild-keygen -a -i

# Build packages
make alpine

# Or manually
./packaging/scripts/build-alpine.sh
cd build/alpine
abuild checksum
abuild -r
```

### Arch Linux

Requirements:
- `base-devel`
- `cargo` and `rust`

```bash
# Install build dependencies
pacman -S base-devel cargo rust

# Build packages
make arch

# Or manually
./packaging/scripts/build-arch.sh
cd build/archlinux
updpkgsums
makepkg -si
```

## Service Management

### systemd (Debian, RHEL, Arch)

```bash
# Enable and start the server
sudo systemctl enable --now corevpn-server

# Start the web admin interface
sudo systemctl enable --now corevpn-web

# View logs
journalctl -u corevpn-server -f
```

### OpenRC (Alpine)

```bash
# Enable and start the server
sudo rc-update add corevpn-server default
sudo rc-service corevpn-server start

# Start the web admin interface
sudo rc-update add corevpn-web default
sudo rc-service corevpn-web start

# View logs
tail -f /var/log/corevpn/server.log
```

## Ghost Mode

To run CoreVPN with zero connection logging (ghost mode):

**systemd:**
Edit `/etc/corevpn/environment`:
```
COREVPN_GHOST_MODE=yes
```

Or add to config.toml:
```toml
[logging]
connection_log_mode = "none"
```

**OpenRC:**
Edit `/etc/conf.d/corevpn-server`:
```
COREVPN_GHOST_MODE="yes"
```

## Configuration Files

| File | Description |
|------|-------------|
| `/etc/corevpn/config.toml` | Main configuration |
| `/etc/corevpn/environment` | Environment variables (secrets) |

## Data Directories

| Directory | Description |
|-----------|-------------|
| `/var/lib/corevpn` | State data (certificates, database) |
| `/var/log/corevpn` | Log files |
| `/run/corevpn` | Runtime files (PID, sockets) |

## Security Notes

1. The `environment` file should be mode 0600 (owner-only read)
2. Set `COREVPN_ADMIN_PASSWORD` for web admin access
3. TLS certificates are stored in `/var/lib/corevpn/certs/`
4. By default, the web interface listens on 127.0.0.1:8080 (use a reverse proxy for external access)
