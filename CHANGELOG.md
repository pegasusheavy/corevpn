# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-02

### Added

#### Core VPN Features
- Full OpenVPN protocol compatibility (UDP and TCP)
- TLS 1.3 with modern cipher suites (ChaCha20-Poly1305, AES-256-GCM)
- X25519 key exchange and Ed25519 signatures
- Certificate-based PKI with automatic CA management
- IPv4 and IPv6 dual-stack support
- Split tunneling configuration
- DNS leak protection

#### Authentication
- OAuth2/OIDC authentication (Google, Microsoft, Okta, Auth0, Keycloak)
- SAML 2.0 authentication for enterprise SSO
- Traditional username/password authentication
- Certificate-based authentication
- Multi-factor authentication support via identity providers

#### Ghost Mode (Privacy)
- Zero-logging operation mode
- Multiple logging levels: none, memory, file, database
- IP address anonymization (hashing)
- Username anonymization
- Timestamp rounding for privacy
- Secure log deletion with file shredding
- Configurable log retention policies

#### Audit Logging (Enterprise)
- AWS CloudWatch, S3, Security Hub, EventBridge integration
- Azure Monitor and Event Hub integration
- Oracle Cloud Logging and Streaming integration
- Elasticsearch integration
- Splunk HTTP Event Collector (HEC) integration
- Apache Kafka integration
- Syslog (UDP/TCP/TLS) with CEF/LEEF format support
- Generic webhook support
- OCSF (Open Cybersecurity Schema Framework) format support

#### Administration
- Web-based administration interface
- Client configuration generation (.ovpn export)
- Quick client generation with QR codes
- Real-time connection monitoring
- Server statistics dashboard
- Certificate management UI

#### Deployment
- Docker image (hardened Alpine-based)
- Docker Compose configurations (standard and ghost mode)
- Kubernetes manifests with Kustomize
- Helm chart with configurable values
- Debian/Ubuntu packages (.deb)
- RHEL/Fedora/CentOS packages (.rpm)
- Alpine Linux packages (.apk)
- Arch Linux packages (PKGBUILD)
- systemd service units
- OpenRC init scripts

#### Security
- Rust 2024 edition with strict safety guarantees
- Memory-safe cryptographic implementations
- Constant-time cryptographic comparisons
- Zeroize-on-drop for sensitive data
- Hardened container images
- Comprehensive security policy (SECURITY.md)

### Security

- All cryptographic operations use audited Rust crates
- No unsafe code in application logic
- TLS certificate validation enabled by default
- Admin password required for web interface
- Rate limiting on authentication endpoints

### Documentation

- Comprehensive README with quick start guide
- Angular-based documentation website
- SEO and AEO optimized documentation
- API reference documentation
- Deployment guides for all platforms
- Ghost mode privacy documentation

## [Unreleased]

### Planned
- Windows client support
- macOS client support
- Mobile client apps (iOS/Android)
- WireGuard protocol support
- Multi-server clustering
- Geographic load balancing
- Advanced traffic analysis protection

[0.1.0]: https://github.com/pegasusheavy/corevpn/releases/tag/v0.1.0
[Unreleased]: https://github.com/pegasusheavy/corevpn/compare/v0.1.0...HEAD
