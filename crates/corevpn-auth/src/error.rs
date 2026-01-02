//! Authentication error types

use thiserror::Error;

/// Result type for authentication operations
pub type Result<T> = std::result::Result<T, AuthError>;

/// Authentication errors
#[derive(Debug, Error)]
pub enum AuthError {
    /// OAuth2 error
    #[error("OAuth2 error: {0}")]
    OAuth2Error(String),

    /// Token validation failed
    #[error("token validation failed: {0}")]
    TokenValidationFailed(String),

    /// Token expired
    #[error("token expired")]
    TokenExpired,

    /// Token refresh failed
    #[error("token refresh failed: {0}")]
    TokenRefreshFailed(String),

    /// Invalid state parameter
    #[error("invalid state parameter")]
    InvalidState,

    /// Invalid nonce
    #[error("invalid nonce")]
    InvalidNonce,

    /// Provider not configured
    #[error("provider not configured: {0}")]
    ProviderNotConfigured(String),

    /// Provider discovery failed
    #[error("OIDC discovery failed: {0}")]
    DiscoveryFailed(String),

    /// Unauthorized domain
    #[error("domain not allowed: {0}")]
    UnauthorizedDomain(String),

    /// User not in allowed group
    #[error("user not in required group")]
    NotInRequiredGroup,

    /// User disabled
    #[error("user account is disabled")]
    UserDisabled,

    /// Session not found
    #[error("auth session not found")]
    SessionNotFound,

    /// Session expired
    #[error("auth session expired")]
    SessionExpired,

    /// Device authorization pending
    #[error("authorization pending")]
    AuthorizationPending,

    /// Device authorization expired
    #[error("device authorization expired")]
    DeviceAuthExpired,

    /// HTTP error
    #[error("HTTP error: {0}")]
    HttpError(String),

    /// Serialization error
    #[error("serialization error: {0}")]
    SerializationError(String),

    /// Configuration error
    #[error("configuration error: {0}")]
    ConfigError(String),
}

impl From<reqwest::Error> for AuthError {
    fn from(err: reqwest::Error) -> Self {
        AuthError::HttpError(err.to_string())
    }
}

impl From<serde_json::Error> for AuthError {
    fn from(err: serde_json::Error) -> Self {
        AuthError::SerializationError(err.to_string())
    }
}
