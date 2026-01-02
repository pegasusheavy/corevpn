//! Protocol error types

use thiserror::Error;

/// Result type for protocol operations
pub type Result<T> = std::result::Result<T, ProtocolError>;

/// Protocol errors
#[derive(Debug, Error)]
pub enum ProtocolError {
    /// Invalid packet format
    #[error("invalid packet: {0}")]
    InvalidPacket(String),

    /// Unknown opcode
    #[error("unknown opcode: {0}")]
    UnknownOpcode(u8),

    /// Packet too short
    #[error("packet too short: expected at least {expected}, got {got}")]
    PacketTooShort {
        /// Expected minimum size
        expected: usize,
        /// Actual size received
        got: usize,
    },

    /// Invalid session ID
    #[error("invalid session ID")]
    InvalidSessionId,

    /// Session not found
    #[error("session not found")]
    SessionNotFound,

    /// Handshake failed
    #[error("handshake failed: {0}")]
    HandshakeFailed(String),

    /// TLS error
    #[error("TLS error: {0}")]
    TlsError(String),

    /// Authentication failed
    #[error("authentication failed: {0}")]
    AuthFailed(String),

    /// Replay attack detected
    #[error("replay attack detected")]
    ReplayDetected,

    /// Key not available
    #[error("key not available for key_id {0}")]
    KeyNotAvailable(u8),

    /// Cryptographic error
    #[error("crypto error: {0}")]
    CryptoError(#[from] corevpn_crypto::CryptoError),

    /// Core error
    #[error("core error: {0}")]
    CoreError(#[from] corevpn_core::CoreError),

    /// IO error
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    /// Timeout
    #[error("operation timed out")]
    Timeout,

    /// Connection reset
    #[error("connection reset by peer")]
    ConnectionReset,
}
