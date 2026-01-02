# CoreVPN - Secure OpenVPN-Compatible Server in Rust

## Project Overview

A highly secure, OpenVPN-compatible VPN server written in Rust with OAuth2 authentication support and automatic client configuration generation.

## Current Status: Phase 2 - Protocol Implementation (In Progress)

Last Updated: January 2026

---

## Completed Work ✅

### Phase 1.1: Project Structure Setup - COMPLETE ✅
- [x] Create modular crate structure:
  - `corevpn-core` - Core VPN logic
  - `corevpn-crypto` - Cryptographic operations
  - `corevpn-protocol` - OpenVPN protocol implementation
  - `corevpn-auth` - Authentication (OAuth2, certificates)
  - `corevpn-config` - Configuration management
  - `corevpn-server` - Main server binary
  - `corevpn-cli` - CLI management tool (merged with server)

### Phase 1.2: Cryptographic Foundation - COMPLETE ✅
- [x] Key management (`corevpn-crypto/src/keys.rs`):
  - X25519 static and ephemeral keys for key exchange
  - Ed25519 signing and verification keys
  - `ZeroizeOnDrop` on all secret material
  - Perfect Forward Secrecy via ephemeral keys
- [x] Symmetric ciphers (`corevpn-crypto/src/cipher.rs`):
  - ChaCha20-Poly1305 (preferred)
  - AES-256-GCM (fallback)
  - Replay protection with sliding window
  - Packet encryption with counter-based nonces
- [x] Key derivation (`corevpn-crypto/src/kdf.rs`):
  - HKDF-SHA256 implementation
- [x] HMAC authentication (`corevpn-crypto/src/hmac_auth.rs`)
- [x] Certificate management (`corevpn-crypto/src/cert.rs`):
  - Self-signed CA generation
  - Server certificate issuance
  - Client certificate issuance with configurable lifetime
  - tls-auth static key generation
- [x] Security hardening:
  - `#![forbid(unsafe_code)]` in all crypto modules
  - Using audited libraries only (ring, rustls, dalek crates)
  - No OpenSSL dependency
  - Secure random number generation via `getrandom`
  - `zeroize` for secure memory wiping

### Phase 1.3: Memory Safety & Security Hardening - COMPLETE ✅
- [x] Enable all Rust safety features:
  - `#![forbid(unsafe_code)]` where possible
- [x] Implement secure memory handling:
  - Use `secrecy` crate for sensitive data
  - Implement `Zeroize` on all key material

### Performance Benchmarking & Optimization - COMPLETE ✅
- [x] Criterion benchmark suite (see [BENCHMARK.md](./BENCHMARK.md))
- [x] Performance optimizations on hot paths

---

## In Progress 🔨

### Phase 2.1-2.2: OpenVPN Protocol - PARTIAL
- [x] Opcode definitions (`corevpn-protocol/src/opcode.rs`):
  - All P_CONTROL_* opcodes
  - All P_DATA_* opcodes
  - P_ACK_V1
  - Key ID handling
- [x] Packet parsing (`corevpn-protocol/src/packet.rs`):
  - Header parsing with tls-auth support
  - Control packet parsing (ACKs, message IDs, payloads)
  - Data packet parsing (V1 and V2 with peer-id)
  - Packet serialization
- [x] Reliable transport (`corevpn-protocol/src/reliable.rs`):
  - Packet acknowledgment system
  - Retransmission logic with exponential backoff
  - Sliding window implementation
  - RTT estimation (RFC 6298)
  - TLS record reassembler
- [x] Session management (`corevpn-protocol/src/session.rs`):
  - Session state machine
  - Session ID generation
  - Data channel management
  - Key installation and rotation
- [ ] **TLS integration with rustls** ⬅️ NEXT
  - TLS 1.3 handshake compatible with OpenVPN
  - Certificate-based mutual authentication
  - Cipher suite negotiation
- [ ] Control channel message handling:
  - Key method v2 exchange
  - Push/pull config options
  - INFO and AUTH packets

### Phase 3: OAuth2 Authentication - PARTIAL
- [x] Provider support (`corevpn-auth/src/provider.rs`, `lib.rs`):
  - Google Workspace
  - Microsoft Entra ID (Azure AD)
  - Okta
  - Generic OIDC
- [x] Auth flows (`corevpn-auth/src/flow.rs`):
  - Authorization Code flow with PKCE
  - Device Authorization flow for CLI/headless
  - Token exchange and refresh
- [x] Auth state management with CSRF protection
- [x] VPN auth challenge generation for OpenVPN auth-user-pass integration
- [ ] Bind VPN sessions to OAuth2 tokens
- [ ] Auto-disconnect on token revocation
- [ ] Token validation via webhook/polling
- [ ] RBAC/ABAC implementation

### Phase 4: Client Configuration - PARTIAL
- [x] .ovpn file generation (`corevpn-config/src/generator.rs`):
  - Standard client config generation
  - Mobile-optimized config generation
  - Inline certificates and keys
- [x] PKI initialization (CA, server cert, ta.key)
- [x] Server configuration model (`corevpn-config/src/server.rs`)
- [x] Client configuration builder (`corevpn-config/src/client.rs`)

### Phase 6: CLI/Server - PARTIAL
- [x] Server binary with commands (`corevpn-server/src/main.rs`):
  - `setup` - Interactive and web-based setup wizard
  - `run` - Start server (structure only)
  - `client` - Generate client configs
  - `status` - Show server status
  - `doctor` - Diagnose issues
- [x] Logging setup with JSON and pretty formats
- [x] Setup wizard structure (`corevpn-server/src/setup.rs`)

---

## Immediate Priorities

1. **Complete TLS handshake integration** - Connect rustls with the OpenVPN control channel
2. **Implement session storage** - Store and lookup sessions by peer address
3. **Add TUN device support** - Start with Linux implementation
4. **Wire up the server** - Actually accept connections and process packets end-to-end
5. **End-to-end test** - Connect with a real OpenVPN client

---

## Pending Phases

### Phase 2.3 - Network Interface
- [ ] TUN device management:
  - Linux `/dev/net/tun` support
  - macOS `utun` support (future)
  - Windows Wintun (future)
- [ ] IP address management:
  - IP pool allocation
  - Client IP assignment
- [ ] Routing:
  - Route pushing to clients
  - Split tunnel support

### Phase 5: Server Security Hardening
- [ ] DDoS protection:
  - Connection rate limiting per IP
  - SYN cookie equivalent for UDP
  - Proof-of-work challenge for connections
- [ ] Port knocking / SPA (Single Packet Authorization)
- [ ] IP reputation integration
- [ ] Privilege separation:
  - Unprivileged worker processes
  - Privileged controller with minimal code
  - seccomp-bpf syscall filtering
- [ ] Sandboxing:
  - Linux namespaces isolation
  - Landlock LSM support
  - Capability dropping
- [ ] Secure logging:
  - No sensitive data in logs
  - Log encryption option
  - Remote logging with TLS

### Phase 7: Testing & Auditing
- [ ] Unit tests for all modules
- [ ] Integration tests with OpenVPN client
- [ ] Fuzzing with cargo-fuzz
- [ ] Memory safety verification with Miri
- [ ] Static analysis with cargo-audit
- [ ] Security audit preparation

### Phase 8: Dead-Simple Setup
- [ ] One-command installation script
- [ ] Docker one-liner deployment
- [ ] Cloud marketplace images
- [ ] Self-service client portal
- [ ] Email onboarding with invite links

### Phase 9: Documentation & Deployment
- [ ] User documentation
- [ ] Administrator guides
- [ ] Container images (Docker, Kubernetes Helm)
- [ ] Package distribution (.deb, .rpm, Homebrew)
- [ ] Terraform modules, Ansible playbooks

---

## Key Files Reference

| Component | Key Files |
|-----------|-----------|
| Crypto | `crates/corevpn-crypto/src/{keys,cipher,cert,kdf}.rs` |
| Protocol | `crates/corevpn-protocol/src/{opcode,packet,control,data,reliable,session}.rs` |
| Auth | `crates/corevpn-auth/src/{flow,provider,token}.rs` |
| Config | `crates/corevpn-config/src/{server,client,generator}.rs` |
| Server | `crates/corevpn-server/src/{main,server,setup}.rs` |
| Core | `crates/corevpn-core/src/{session,network,user}.rs` |
| Web UI | `crates/corevpn-server/src/webui/{mod,routes,templates,state}.rs` |
| Benchmarks | `crates/corevpn-{crypto,protocol}/benches/*.rs` |

---

## Build & Test

```bash
# Build all crates
cargo build

# Build optimized release
cargo build --release

# Run tests
cargo test

# Run benchmarks (see BENCHMARK.md for details)
cargo bench

# Run server setup
cargo run -p corevpn-server -- setup --data-dir ./data

# Generate client config
cargo run -p corevpn-server -- client --config ./config.toml --user test@example.com

# Start server
cargo run -p corevpn-server -- run --config ./config.toml

# Start web UI
cargo run -p corevpn-server -- web --config ./config.toml
```

---

## Security Architecture Summary

### Encryption Standards
| Layer | Algorithm | Key Size | Notes |
|-------|-----------|----------|-------|
| Control Channel | TLS 1.3 | N/A | ChaCha20-Poly1305 or AES-256-GCM |
| Data Channel | ChaCha20-Poly1305 | 256-bit | With Poly1305 MAC |
| Key Exchange | X25519 | 256-bit | ECDH with Curve25519 |
| Signatures | Ed25519 | 256-bit | For certificates |
| Hashing | SHA-512/256 | 256-bit | For integrity |
| KDF | HKDF-SHA256 | N/A | Key derivation |

### Defense in Depth Layers
1. **Network Layer**: Rate limiting, geo-blocking (planned)
2. **Protocol Layer**: TLS 1.3 only, strong ciphers, PFS
3. **Authentication Layer**: OAuth2 + certificates, MFA via IdP
4. **Authorization Layer**: RBAC/ABAC (planned)
5. **Process Layer**: Privilege separation, sandboxing (planned)
6. **Data Layer**: Encryption at rest, secure memory handling
7. **Audit Layer**: Comprehensive logging (planned)

### Zero Trust Principles
- Never trust, always verify
- Least privilege access
- Assume breach mentality
- Continuous verification
- Micro-segmentation ready

---

## Dependencies

```toml
[dependencies]
# Async runtime
tokio = { version = "1", features = ["full"] }

# Cryptography - audited, pure-Rust
ring = "0.17"
rustls = "0.23"
x25519-dalek = "2"
ed25519-dalek = "2"
chacha20poly1305 = "0.10"
aes-gcm = "0.10"
zeroize = { version = "1", features = ["derive"] }
secrecy = "0.8"

# Networking
socket2 = "0.5"
tun = "0.6"
tokio-rustls = "0.26"

# OAuth2/OIDC
openidconnect = "3"
oauth2 = "4"

# HTTP/Web
axum = "0.7"
tower = "0.4"
reqwest = "0.12"

# Serialization
serde = { version = "1", features = ["derive"] }
toml = "0.8"

# CLI
clap = { version = "4", features = ["derive"] }

# Logging
tracing = "0.1"
tracing-subscriber = "0.3"
```

---

## Success Criteria

- [ ] Pass OpenVPN client compatibility tests
- [ ] Pass cryptographic security audit
- [ ] Support 10,000+ concurrent connections
- [ ] Sub-100ms authentication latency
- [ ] Zero critical vulnerabilities in production
- [ ] Full OAuth2 flow completion < 30 seconds
- [ ] Config generation < 1 second
