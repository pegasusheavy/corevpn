# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously at Pegasus Heavy Industries. If you discover a security vulnerability in CoreVPN, please report it responsibly.

### For Critical Vulnerabilities

**DO NOT** create a public GitHub issue for critical security vulnerabilities.

Instead, please email: **security@pegasusheavyindustries.com**

Include:
- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes (if available)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 7 days
- **Resolution Timeline**: We aim to resolve critical issues within 30 days
- **Credit**: We will credit you in our security advisory (unless you prefer anonymity)

### For Non-Critical Issues

For lower-severity security issues that can be discussed publicly, you may use our [Security Issue Template](https://github.com/pegasusheavy/corevpn/issues/new?template=security_vulnerability.yml).

## Security Best Practices

When deploying CoreVPN:

### Ghost Mode
For maximum privacy, enable ghost mode to disable all connection logging:
```bash
corevpn-server run --ghost --config /etc/corevpn/config.toml
```

Or in config.toml:
```toml
[logging]
connection_mode = "none"
```

### TLS Configuration
- Always use TLS 1.3 (`tls_min_version = "1.3"`)
- Enable `tls_auth` or `tls_crypt` for additional protection
- Use strong cipher suites (`chacha20-poly1305` or `aes-256-gcm`)

### Certificate Management
- Use short-lived client certificates (`client_cert_lifetime_days = 30`)
- Regularly rotate the CA certificate
- Store private keys with restrictive permissions (0600)

### Network Security
- Run the server behind a firewall
- Use network policies in Kubernetes
- Consider using a separate network namespace

### Secrets Management
- Never commit secrets to version control
- Use environment variables or secret management tools
- Rotate the admin password regularly

## Security Features

CoreVPN includes several security features:

- **Zero-Knowledge Mode**: Ghost mode leaves no connection traces
- **Anonymization**: Hash IPs, usernames, and timestamps in logs
- **Secure Deletion**: 3-pass overwrite before log deletion
- **Memory Safety**: Written in Rust with no unsafe code in core paths
- **Modern Cryptography**: TLS 1.3, ChaCha20-Poly1305, Ed25519

## Vulnerability Disclosure

We follow coordinated disclosure practices:

1. Researcher reports vulnerability privately
2. We acknowledge and assess the issue
3. We develop and test a fix
4. We release the fix and publish a security advisory
5. Researcher may publish their findings after the fix is released

## Bug Bounty

We currently do not have a formal bug bounty program, but we appreciate security research and will acknowledge contributors in our security advisories.

## Contact

- Security issues: security@pegasusheavyindustries.com
- General questions: support@pegasusheavyindustries.com
- PGP Key: Available upon request
