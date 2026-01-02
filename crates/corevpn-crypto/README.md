# corevpn-crypto

[![Crates.io](https://img.shields.io/crates/v/corevpn-crypto.svg)](https://crates.io/crates/corevpn-crypto)
[![Documentation](https://docs.rs/corevpn-crypto/badge.svg)](https://docs.rs/corevpn-crypto)
[![License](https://img.shields.io/crates/l/corevpn-crypto.svg)](https://github.com/pegasusheavy/corevpn)

Cryptographic primitives for CoreVPN - secure key exchange, encryption, and certificate handling.

## Features

- **Key Exchange**: X25519 Diffie-Hellman for perfect forward secrecy
- **Encryption**: ChaCha20-Poly1305 and AES-256-GCM AEAD ciphers
- **Signatures**: Ed25519 digital signatures
- **Certificates**: X.509 certificate generation and validation
- **Key Derivation**: HKDF-based key derivation
- **HMAC Authentication**: OpenVPN-compatible tls-auth
- **Secure Memory**: Zeroization of sensitive data

## Usage

```rust
use corevpn_crypto::{CipherSuite, KeyMaterial, CertificateAuthority};

// Generate a Certificate Authority
let ca = CertificateAuthority::generate("My VPN CA", 3650)?;

// Generate server certificate
let (server_cert, server_key) = ca.generate_server_cert("vpn.example.com", 365)?;

// Generate client certificate
let (client_cert, client_key) = ca.generate_client_cert("user@example.com", 90)?;

// Create cipher suite for data channel
let cipher = CipherSuite::new_chacha20_poly1305(&key_material)?;
let encrypted = cipher.encrypt(&plaintext)?;
```

## Security

This crate uses only audited, pure-Rust cryptographic implementations:

- `x25519-dalek` / `ed25519-dalek` for Curve25519 operations
- `chacha20poly1305` / `aes-gcm` for AEAD encryption
- `ring` for additional cryptographic primitives
- `zeroize` for secure memory handling

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](../../LICENSE-APACHE))
- MIT license ([LICENSE-MIT](../../LICENSE-MIT))

at your option.
