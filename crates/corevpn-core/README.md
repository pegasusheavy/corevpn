# corevpn-core

[![Crates.io](https://img.shields.io/crates/v/corevpn-core.svg)](https://crates.io/crates/corevpn-core)
[![Documentation](https://docs.rs/corevpn-core/badge.svg)](https://docs.rs/corevpn-core)
[![License](https://img.shields.io/crates/l/corevpn-core.svg)](https://github.com/pegasusheavy/corevpn)

Core types, session management, and utilities for CoreVPN.

## Features

- **Session Management**: Client session lifecycle and state tracking
- **IP Address Pool**: Dynamic IP allocation for VPN clients
- **Network Utilities**: Subnet handling and routing
- **Connection Tracking**: Active connection management
- **Statistics**: Connection and transfer statistics

## Usage

```rust
use corevpn_core::{SessionManager, IpPool};
use std::net::Ipv4Addr;

// Create session manager
let session_manager = SessionManager::new(100, chrono::Duration::hours(24));

// Create IP pool for client addresses
let pool = IpPool::new("10.8.0.0/24".parse()?)?;

// Allocate IP for a client
let client_ip = pool.allocate()?;
```

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](../../LICENSE-APACHE))
- MIT license ([LICENSE-MIT](../../LICENSE-MIT))

at your option.
