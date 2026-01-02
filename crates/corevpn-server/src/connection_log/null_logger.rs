//! Null/Ghost Logger
//!
//! A logger that does absolutely nothing - for complete anonymity.
//! No events are stored, no traces are left.

use anyhow::Result;
use async_trait::async_trait;

use super::events::{ConnectionEvent, ConnectionId};
use super::logger::{ConnectionLogger, LoggerStats};

/// A logger that does nothing - ghost mode
///
/// Use this when you want zero logging - no connection data is ever
/// stored, tracked, or persisted in any way.
pub struct NullConnectionLogger {
    // Intentionally empty - we store nothing
}

impl NullConnectionLogger {
    pub fn new() -> Self {
        Self {}
    }
}

impl Default for NullConnectionLogger {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl ConnectionLogger for NullConnectionLogger {
    async fn log(&self, _event: ConnectionEvent) -> Result<()> {
        // Do nothing - ghost mode
        Ok(())
    }

    async fn query_recent(&self, _limit: usize) -> Result<Option<Vec<ConnectionEvent>>> {
        // No data to query
        Ok(None)
    }

    async fn query_connection(&self, _id: ConnectionId) -> Result<Option<Vec<ConnectionEvent>>> {
        // No data to query
        Ok(None)
    }

    async fn flush(&self) -> Result<()> {
        // Nothing to flush
        Ok(())
    }

    async fn cleanup(&self) -> Result<()> {
        // Nothing to clean
        Ok(())
    }

    fn stats(&self) -> LoggerStats {
        // All zeros - we track nothing
        LoggerStats::default()
    }

    fn is_null(&self) -> bool {
        true
    }

    fn logger_type(&self) -> &'static str {
        "null"
    }
}
