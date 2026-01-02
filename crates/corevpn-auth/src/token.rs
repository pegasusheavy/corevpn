//! Token Management and Validation

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::{AuthError, Result};

/// OAuth2/OIDC Token Set
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenSet {
    /// Access token
    pub access_token: String,
    /// Refresh token (optional)
    pub refresh_token: Option<String>,
    /// ID token (for OIDC)
    pub id_token: Option<String>,
    /// Token expiration time
    pub expires_at: DateTime<Utc>,
    /// Token type (usually "Bearer")
    pub token_type: String,
    /// Granted scopes
    pub scopes: Vec<String>,
}

impl TokenSet {
    /// Check if access token is expired
    pub fn is_expired(&self) -> bool {
        Utc::now() > self.expires_at
    }

    /// Check if access token will expire within given duration
    pub fn expires_within(&self, duration: chrono::Duration) -> bool {
        Utc::now() + duration > self.expires_at
    }

    /// Get remaining lifetime
    pub fn remaining_lifetime(&self) -> chrono::Duration {
        self.expires_at - Utc::now()
    }
}

/// Claims extracted from ID token
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdTokenClaims {
    /// Issuer
    pub iss: String,
    /// Subject (user ID)
    pub sub: String,
    /// Audience
    pub aud: StringOrArray,
    /// Expiration time
    pub exp: i64,
    /// Issued at time
    pub iat: i64,
    /// Nonce
    #[serde(default)]
    pub nonce: Option<String>,
    /// Email
    #[serde(default)]
    pub email: Option<String>,
    /// Email verified
    #[serde(default)]
    pub email_verified: Option<bool>,
    /// Name
    #[serde(default)]
    pub name: Option<String>,
    /// Given name
    #[serde(default)]
    pub given_name: Option<String>,
    /// Family name
    #[serde(default)]
    pub family_name: Option<String>,
    /// Picture URL
    #[serde(default)]
    pub picture: Option<String>,
    /// Groups
    #[serde(default)]
    pub groups: Vec<String>,
    /// Additional claims
    #[serde(flatten)]
    pub additional: HashMap<String, serde_json::Value>,
}

/// String or array of strings (for audience claim)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum StringOrArray {
    /// Single string
    String(String),
    /// Array of strings
    Array(Vec<String>),
}

impl StringOrArray {
    /// Check if contains a value
    pub fn contains(&self, value: &str) -> bool {
        match self {
            StringOrArray::String(s) => s == value,
            StringOrArray::Array(arr) => arr.iter().any(|s| s == value),
        }
    }
}

/// Token validator
pub struct TokenValidator {
    /// Expected issuer
    issuer: String,
    /// Expected audience (client ID)
    audience: String,
    /// Clock skew tolerance (in seconds)
    clock_skew: i64,
}

impl TokenValidator {
    /// Create a new token validator
    pub fn new(issuer: &str, audience: &str) -> Self {
        Self {
            issuer: issuer.to_string(),
            audience: audience.to_string(),
            clock_skew: 60, // 1 minute tolerance
        }
    }

    /// Set clock skew tolerance
    pub fn with_clock_skew(mut self, seconds: i64) -> Self {
        self.clock_skew = seconds;
        self
    }

    /// Validate ID token claims (without cryptographic verification)
    ///
    /// Note: For production, you should also verify the JWT signature
    /// using the provider's JWKS.
    pub fn validate_claims(&self, claims: &IdTokenClaims, expected_nonce: Option<&str>) -> Result<()> {
        // Check issuer
        if claims.iss != self.issuer {
            return Err(AuthError::TokenValidationFailed(format!(
                "invalid issuer: expected {}, got {}",
                self.issuer, claims.iss
            )));
        }

        // Check audience
        if !claims.aud.contains(&self.audience) {
            return Err(AuthError::TokenValidationFailed(
                "token audience mismatch".into(),
            ));
        }

        // Check expiration
        let now = Utc::now().timestamp();
        if claims.exp < now - self.clock_skew {
            return Err(AuthError::TokenExpired);
        }

        // Check issued at (not in the future)
        if claims.iat > now + self.clock_skew {
            return Err(AuthError::TokenValidationFailed(
                "token issued in the future".into(),
            ));
        }

        // Check nonce if provided
        if let Some(expected) = expected_nonce {
            if claims.nonce.as_deref() != Some(expected) {
                return Err(AuthError::InvalidNonce);
            }
        }

        Ok(())
    }

    /// Decode JWT without verification (for extracting claims)
    ///
    /// WARNING: This does not verify the signature. For production use,
    /// you should use a proper JWT library that verifies signatures.
    pub fn decode_jwt_claims(token: &str) -> Result<IdTokenClaims> {
        use base64::Engine;

        let parts: Vec<&str> = token.split('.').collect();
        if parts.len() != 3 {
            return Err(AuthError::TokenValidationFailed("invalid JWT format".into()));
        }

        let payload = base64::engine::general_purpose::URL_SAFE_NO_PAD
            .decode(parts[1])
            .map_err(|e| AuthError::TokenValidationFailed(format!("base64 decode error: {}", e)))?;

        let claims: IdTokenClaims = serde_json::from_slice(&payload)?;

        Ok(claims)
    }
}

/// User information extracted from tokens
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserInfo {
    /// Subject (user ID from provider)
    pub sub: String,
    /// Email
    pub email: Option<String>,
    /// Email verified
    pub email_verified: bool,
    /// Display name
    pub name: Option<String>,
    /// Given name
    pub given_name: Option<String>,
    /// Family name
    pub family_name: Option<String>,
    /// Picture URL
    pub picture: Option<String>,
    /// Groups
    pub groups: Vec<String>,
    /// Provider type
    pub provider: String,
}

impl UserInfo {
    /// Extract from ID token claims
    pub fn from_claims(claims: &IdTokenClaims, provider: &str) -> Self {
        Self {
            sub: claims.sub.clone(),
            email: claims.email.clone(),
            email_verified: claims.email_verified.unwrap_or(false),
            name: claims.name.clone(),
            given_name: claims.given_name.clone(),
            family_name: claims.family_name.clone(),
            picture: claims.picture.clone(),
            groups: claims.groups.clone(),
            provider: provider.to_string(),
        }
    }

    /// Get email domain
    pub fn email_domain(&self) -> Option<&str> {
        self.email.as_ref().and_then(|e| e.split('@').nth(1))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_token_expiration() {
        let token = TokenSet {
            access_token: "test".to_string(),
            refresh_token: None,
            id_token: None,
            expires_at: Utc::now() + chrono::Duration::hours(1),
            token_type: "Bearer".to_string(),
            scopes: vec![],
        };

        assert!(!token.is_expired());
        assert!(!token.expires_within(chrono::Duration::minutes(30)));
        assert!(token.expires_within(chrono::Duration::hours(2)));
    }

    #[test]
    fn test_string_or_array() {
        let single = StringOrArray::String("test".to_string());
        assert!(single.contains("test"));
        assert!(!single.contains("other"));

        let array = StringOrArray::Array(vec!["one".to_string(), "two".to_string()]);
        assert!(array.contains("one"));
        assert!(array.contains("two"));
        assert!(!array.contains("three"));
    }

    #[test]
    fn test_claim_validation() {
        let validator = TokenValidator::new("https://accounts.google.com", "client-id");

        let claims = IdTokenClaims {
            iss: "https://accounts.google.com".to_string(),
            sub: "user123".to_string(),
            aud: StringOrArray::String("client-id".to_string()),
            exp: Utc::now().timestamp() + 3600,
            iat: Utc::now().timestamp(),
            nonce: Some("test-nonce".to_string()),
            email: Some("user@example.com".to_string()),
            email_verified: Some(true),
            name: Some("Test User".to_string()),
            given_name: None,
            family_name: None,
            picture: None,
            groups: vec![],
            additional: HashMap::new(),
        };

        assert!(validator.validate_claims(&claims, Some("test-nonce")).is_ok());
        assert!(validator.validate_claims(&claims, Some("wrong-nonce")).is_err());
    }
}
