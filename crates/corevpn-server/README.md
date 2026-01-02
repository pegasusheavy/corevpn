# corevpn-server

[![Crates.io](https://img.shields.io/crates/v/corevpn-server.svg)](https://crates.io/crates/corevpn-server)
[![Documentation](https://docs.rs/corevpn-server/badge.svg)](https://docs.rs/corevpn-server)
[![License](https://img.shields.io/crates/l/corevpn-server.svg)](https://github.com/pegasusheavy/corevpn)

CoreVPN server binary - secure OpenVPN-compatible VPN server with OAuth2 and ghost mode.

## Features

- **OpenVPN Compatible**: Works with standard OpenVPN clients
- **OAuth2/SAML**: Enterprise authentication support
- **Ghost Mode**: Zero-logging for maximum privacy
- **Admin Web UI**: Web-based management interface
- **Audit Logging**: SIEM and cloud integration
- **Modern TLS**: TLS 1.3 with strong ciphers

## Installation

```bash
cargo install corevpn-server
```

Or with Docker:

```bash
docker run -d -p 1194:1194/udp ghcr.io/pegasusheavy/corevpn:latest
```

## Quick Start

```bash
# Initialize server
corevpn-server setup

# Start server
corevpn-server run --config /etc/corevpn/config.toml

# Ghost mode (zero logging)
corevpn-server run --ghost --config /etc/corevpn/config.toml

# Start admin UI
corevpn-server web --listen 127.0.0.1:8080
```

## Commands

| Command | Description |
|---------|-------------|
| `setup` | Interactive setup wizard |
| `run` | Start VPN server |
| `client` | Generate client configuration |
| `web` | Start admin web interface |
| `status` | Show server status |
| `doctor` | Diagnose configuration issues |

## Ghost Mode

When privacy is paramount, use ghost mode to disable all connection logging:

```bash
corevpn-server run --ghost
```

Or in configuration:

```toml
[logging]
connection_mode = "none"
```

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](../../LICENSE-APACHE))
- MIT license ([LICENSE-MIT](../../LICENSE-MIT))

at your option.
