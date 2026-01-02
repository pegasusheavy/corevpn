//! Core error types

use thiserror::Error;

/// Result type for core operations
pub type Result<T> = std::result::Result<T, CoreError>;

/// Core errors
#[derive(Debug, Error)]
pub enum CoreError {
    /// Session not found
    #[error("session not found: {0}")]
    SessionNotFound(String),

    /// Session expired
    #[error("session expired")]
    SessionExpired,

    /// User not found
    #[error("user not found: {0}")]
    UserNotFound(String),

    /// User not authorized
    #[error("user not authorized: {0}")]
    Unauthorized(String),

    /// Address pool exhausted
    #[error("no available addresses in pool")]
    AddressPoolExhausted,

    /// Invalid address
    #[error("invalid address: {0}")]
    InvalidAddress(String),

    /// Configuration error
    #[error("configuration error: {0}")]
    ConfigError(String),

    /// Cryptographic error
    #[error("crypto error: {0}")]
    CryptoError(#[from] corevpn_crypto::CryptoError),

    /// IO error
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    /// Internal error
    #[error("internal error: {0}")]
    Internal(String),
}
