# corevpn-cli

[![Crates.io](https://img.shields.io/crates/v/corevpn-cli.svg)](https://crates.io/crates/corevpn-cli)
[![Documentation](https://docs.rs/corevpn-cli/badge.svg)](https://docs.rs/corevpn-cli)
[![License](https://img.shields.io/crates/l/corevpn-cli.svg)](https://github.com/pegasusheavy/corevpn)

CoreVPN command-line interface - VPN client with OAuth2 support.

## Features

- **Interactive TUI**: Terminal user interface for connection management
- **OAuth2 Authentication**: Browser-based authentication flow
- **Profile Management**: Save and manage multiple VPN profiles
- **Connection Status**: Real-time connection monitoring
- **Cross-Platform**: Linux, macOS, and Windows support

## Installation

```bash
cargo install corevpn-cli
```

## Usage

```bash
# Connect to VPN
corevpn connect --config client.ovpn

# List saved profiles
corevpn profiles list

# Add new profile
corevpn profiles add --name work --config work.ovpn

# Connect using profile
corevpn connect --profile work

# Show connection status
corevpn status

# Disconnect
corevpn disconnect
```

## Commands

| Command | Description |
|---------|-------------|
| `connect` | Connect to VPN server |
| `disconnect` | Disconnect from VPN |
| `status` | Show connection status |
| `profiles` | Manage VPN profiles |
| `logs` | View connection logs |
| `tui` | Launch interactive TUI |

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](../../LICENSE-APACHE))
- MIT license ([LICENSE-MIT](../../LICENSE-MIT))

at your option.
