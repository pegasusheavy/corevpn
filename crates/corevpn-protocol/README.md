# corevpn-protocol

[![Crates.io](https://img.shields.io/crates/v/corevpn-protocol.svg)](https://crates.io/crates/corevpn-protocol)
[![Documentation](https://docs.rs/corevpn-protocol/badge.svg)](https://docs.rs/corevpn-protocol)
[![License](https://img.shields.io/crates/l/corevpn-protocol.svg)](https://github.com/pegasusheavy/corevpn)

OpenVPN-compatible protocol implementation for CoreVPN.

## Features

- **Full OpenVPN Compatibility**: Works with standard OpenVPN clients
- **Control Channel**: TLS 1.3 for control channel security
- **Data Channel**: ChaCha20-Poly1305 or AES-256-GCM encryption
- **Reliable Transport**: Reliable UDP with acknowledgments and retransmission
- **Packet Parsing**: Complete OpenVPN packet format support
- **Session Negotiation**: Key exchange and session establishment

## Protocol Support

- UDP and TCP transport
- TLS 1.3 control channel
- tls-auth HMAC authentication
- tls-crypt encryption
- Data channel encryption (chacha20-poly1305, aes-256-gcm)
- Key renegotiation
- Ping/keepalive

## Usage

```rust
use corevpn_protocol::{Packet, ControlPacket, DataPacket};

// Parse incoming packet
let packet = Packet::parse(&data)?;

match packet {
    Packet::Control(ctrl) => {
        // Handle control channel packet
    }
    Packet::Data(data) => {
        // Handle encrypted data
    }
}
```

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](../../LICENSE-APACHE))
- MIT license ([LICENSE-MIT](../../LICENSE-MIT))

at your option.
