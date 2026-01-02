# corevpn-config

[![Crates.io](https://img.shields.io/crates/v/corevpn-config.svg)](https://crates.io/crates/corevpn-config)
[![Documentation](https://docs.rs/corevpn-config/badge.svg)](https://docs.rs/corevpn-config)
[![License](https://img.shields.io/crates/l/corevpn-config.svg)](https://github.com/pegasusheavy/corevpn)

Configuration management for CoreVPN - server and client configuration.

## Features

- **Server Configuration**: Complete server settings management
- **Client Config Generation**: `.ovpn` file generation
- **TOML Format**: Human-readable configuration files
- **Validation**: Configuration validation and defaults
- **Ghost Mode**: Zero-logging privacy configuration

## Usage

```rust
use corevpn_config::{ServerConfig, ConfigGenerator};

// Load server configuration
let config = ServerConfig::load("config.toml")?;

// Generate client configuration
let generator = ConfigGenerator::new(config, ca, ta_key);
let client_config = generator.generate_client_config("user@example.com", Some("User"))?;

// Save .ovpn file
std::fs::write(&client_config.filename(), &client_config.ovpn_content)?;
```

## Configuration Example

```toml
[server]
listen_addr = "0.0.0.0:1194"
public_host = "vpn.example.com"

[network]
subnet = "10.8.0.0/24"
dns = ["1.1.1.1", "1.0.0.1"]

[security]
cipher = "chacha20-poly1305"
tls_min_version = "1.3"

[logging]
connection_mode = "memory"  # or "none" for ghost mode
```

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](../../LICENSE-APACHE))
- MIT license ([LICENSE-MIT](../../LICENSE-MIT))

at your option.
