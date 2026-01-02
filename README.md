# CoreVPN

[![CI](https://github.com/pegasusheavy/corevpn/actions/workflows/ci.yml/badge.svg)](https://github.com/pegasusheavy/corevpn/actions/workflows/ci.yml)
[![Security](https://github.com/pegasusheavy/corevpn/actions/workflows/security.yml/badge.svg)](https://github.com/pegasusheavy/corevpn/actions/workflows/security.yml)
[![License](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue.svg)](LICENSE-MIT)

**Secure OpenVPN-compatible VPN server with OAuth2/SAML support, ghost mode logging, and modern TLS.**

CoreVPN is a modern, secure VPN server written in Rust that provides:

- 🔐 **OpenVPN Protocol Compatibility** - Works with existing OpenVPN clients
- 🔑 **OAuth2/OIDC/SAML Authentication** - Integrate with Google, Microsoft, Okta, or any OIDC provider
- 👻 **Ghost Mode** - Zero connection logging for privacy-focused deployments
- 🔒 **Modern Security** - TLS 1.3, ChaCha20-Poly1305, Ed25519
- 🌐 **Web Admin Interface** - Manage clients and monitor connections
- 🐳 **Container Ready** - Docker, Kubernetes, Helm support
- 📦 **Easy Deployment** - DEB, RPM, systemd, OpenRC packages

## Quick Start

### Docker

```bash
# Standard deployment
docker run -d \
  --name corevpn \
  --cap-add NET_ADMIN \
  --device /dev/net/tun \
  -p 1194:1194/udp \
  -e COREVPN_ADMIN_PASSWORD=your-secure-password \
  ghcr.io/pegasusheavy/corevpn:latest

# Ghost mode (zero logging)
docker run -d \
  --name corevpn-ghost \
  --cap-add NET_ADMIN \
  --device /dev/net/tun \
  -p 1194:1194/udp \
  ghcr.io/pegasusheavy/corevpn:latest run --ghost
```

### Kubernetes / Helm

```bash
helm install corevpn ./deploy/helm/corevpn \
  --namespace corevpn \
  --create-namespace \
  --set server.publicHost=vpn.example.com \
  --set secrets.adminPassword=$(openssl rand -base64 32)

# Ghost mode
helm install corevpn ./deploy/helm/corevpn \
  -f deploy/helm/corevpn/values-ghost.yaml
```

### From Source

```bash
# Build
cargo build --release

# Install with systemd
sudo make install

# Or install with OpenRC
sudo make install-openrc
```

## Ghost Mode 👻

For deployments requiring **zero connection logging**, CoreVPN offers ghost mode:

```bash
# CLI flag
corevpn-server run --ghost --config /etc/corevpn/config.toml

# Or in config.toml
[logging]
connection_mode = "none"
```

In ghost mode:
- ❌ No connection data stored
- ❌ No IPs logged
- ❌ No usernames recorded
- ❌ No timestamps saved
- ✅ Complete ephemeral operation

## Authentication

CoreVPN supports multiple authentication methods:

### OAuth2/OIDC

```toml
[oauth]
enabled = true
provider = "google"  # or: microsoft, okta, generic
client_id = "your-client-id"
client_secret = "your-client-secret"
allowed_domains = ["yourcompany.com"]
```

### Certificate-Based

Standard OpenVPN certificate authentication is supported out of the box.

## Configuration

Example `/etc/corevpn/config.toml`:

```toml
[server]
listen_addr = "0.0.0.0:1194"
public_host = "vpn.example.com"
max_clients = 100

[network]
subnet = "10.8.0.0/24"
dns = ["1.1.1.1", "1.0.0.1"]
redirect_gateway = true

[security]
cipher = "chacha20-poly1305"
tls_min_version = "1.3"
tls_auth = true

[logging]
level = "info"
connection_mode = "memory"  # or: none, file, database
```

## Privacy Features

| Feature | Description |
|---------|-------------|
| Ghost Mode | Complete disable of all connection logging |
| IP Hashing | HMAC-SHA256 with daily rotating salt |
| IP Truncation | Reduce to /24 (IPv4) or /48 (IPv6) |
| Username Hashing | Store only hashed identifiers |
| Timestamp Rounding | Round to nearest hour |
| Secure Deletion | 3-pass overwrite before file deletion |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Applications                   │
│              (OpenVPN, CoreVPN CLI, Mobile)             │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     CoreVPN Server                       │
├──────────────┬──────────────┬──────────────┬────────────┤
│   Protocol   │    Auth      │   Crypto     │  Logging   │
│   (OpenVPN)  │ (OAuth/Cert) │ (TLS 1.3)    │ (Ghost OK) │
└──────────────┴──────────────┴──────────────┴────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Network Layer                         │
│                  (TUN/TAP, Routing)                      │
└─────────────────────────────────────────────────────────┘
```

## Crate Structure

| Crate | Description |
|-------|-------------|
| `corevpn-server` | Main server binary |
| `corevpn-cli` | Command-line client |
| `corevpn-core` | Core VPN logic |
| `corevpn-protocol` | OpenVPN protocol implementation |
| `corevpn-crypto` | Cryptographic primitives |
| `corevpn-auth` | OAuth2/OIDC/SAML authentication |
| `corevpn-config` | Configuration management |

## Building

```bash
# Development
cargo build

# Release
cargo build --release

# Run tests
cargo test

# Run lints
cargo clippy

# Build packages
make deb  # Debian/Ubuntu
make rpm  # RHEL/Fedora
```

## Documentation

- [Configuration Guide](docs/configuration.md)
- [Deployment Guide](docs/deployment.md)
- [Security Guide](SECURITY.md)
- [Contributing](CONTRIBUTING.md)

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

---

Made with ❤️ by [Pegasus Heavy Industries](https://pegasusheavyindustries.com)
