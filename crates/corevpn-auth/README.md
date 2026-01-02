# corevpn-auth

[![Crates.io](https://img.shields.io/crates/v/corevpn-auth.svg)](https://crates.io/crates/corevpn-auth)
[![Documentation](https://docs.rs/corevpn-auth/badge.svg)](https://docs.rs/corevpn-auth)
[![License](https://img.shields.io/crates/l/corevpn-auth.svg)](https://github.com/pegasusheavy/corevpn)

Authentication and authorization for CoreVPN - OAuth2, OIDC, and SAML support.

## Features

- **OAuth2/OIDC**: Integration with identity providers
- **SAML 2.0**: Enterprise SSO support
- **Certificate Auth**: X.509 client certificate authentication
- **Token Management**: Secure token storage and refresh
- **Provider Support**: Google, Microsoft, Okta, and generic OIDC

## Supported Providers

| Provider | Type | Features |
|----------|------|----------|
| Google | OIDC | Domain restriction, group claims |
| Microsoft | OIDC | Azure AD, tenant restriction |
| Okta | OIDC | Group-based access control |
| Generic | OIDC | Any OIDC-compliant IdP |
| SAML | SAML 2.0 | Enterprise IdP integration |

## Usage

```rust
use corevpn_auth::{OAuthProvider, OAuthConfig};

// Configure Google OAuth
let config = OAuthConfig::google(
    "client_id",
    "client_secret",
    vec!["example.com".to_string()], // allowed domains
);

// Create provider
let provider = OAuthProvider::new(config).await?;

// Get authorization URL
let (auth_url, state) = provider.authorization_url()?;

// Exchange code for tokens
let tokens = provider.exchange_code(code, state).await?;
```

## License

Licensed under either of:

- Apache License, Version 2.0 ([LICENSE-APACHE](../../LICENSE-APACHE))
- MIT license ([LICENSE-MIT](../../LICENSE-MIT))

at your option.
