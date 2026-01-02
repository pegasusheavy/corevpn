# corevpn-ui

CoreVPN Desktop UI - OpenVPN-style VPN client interface.

> **Note**: This crate is not published to crates.io as it depends on the `openkit` UI framework which is not yet published.

## Features

- **Native Desktop UI**: Cross-platform GUI application
- **OpenVPN-Style**: Familiar interface for OpenVPN users
- **OAuth2 Integration**: Browser-based authentication
- **Profile Management**: Save and organize VPN profiles
- **System Tray**: Background operation with tray icon
- **Real-time Status**: Connection status and statistics

## Building

```bash
# From the corevpn repository root
cargo build --package corevpn-ui
```

## Running

```bash
cargo run --package corevpn-ui
```

## Screenshots

The UI provides:

- Server list with status indicators
- One-click connect/disconnect
- Settings management
- Connection logs viewer
- OAuth2 login flow

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](../../LICENSE-APACHE))
- MIT license ([LICENSE-MIT](../../LICENSE-MIT))

at your option.
