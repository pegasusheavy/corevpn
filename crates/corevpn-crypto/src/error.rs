//! Cryptographic error types

use thiserror::Error;

/// Result type for cryptographic operations
pub type Result<T> = std::result::Result<T, CryptoError>;

/// Cryptographic errors
///
/// Uses `&'static str` for error messages on hot paths to avoid allocations.
#[derive(Debug, Error)]
pub enum CryptoError {
    /// Invalid key length
    #[error("invalid key length: expected {expected}, got {got}")]
    InvalidKeyLength {
        /// Expected key length
        expected: usize,
        /// Actual key length
        got: usize,
    },

    /// Invalid signature
    #[error("invalid signature")]
    InvalidSignature,

    /// Decryption failed (authentication tag mismatch)
    #[error("decryption failed: authentication tag mismatch")]
    DecryptionFailed,

    /// Encryption failed
    #[error("encryption failed: {0}")]
    EncryptionFailed(&'static str),

    /// Invalid nonce length
    #[error("invalid nonce length")]
    InvalidNonceLength,

    /// Key derivation failed
    #[error("key derivation failed: {0}")]
    KeyDerivationFailed(&'static str),

    /// Certificate error
    #[error("certificate error: {0}")]
    CertificateError(String),

    /// Invalid PEM format
    #[error("invalid PEM format: {0}")]
    InvalidPem(String),

    /// HMAC verification failed
    #[error("HMAC verification failed")]
    HmacVerificationFailed,

    /// Replay attack detected
    #[error("replay attack detected: packet ID already seen")]
    ReplayDetected,

    /// Key expired
    #[error("key has expired")]
    KeyExpired,

    /// Random number generation failed
    #[error("random number generation failed")]
    RngFailed,
}
