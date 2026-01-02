//! Memory-Only Logger
//!
//! Keeps connection events in memory for real-time monitoring,
//! but never persists them to disk. Data is lost on restart.

use std::collections::VecDeque;
use std::sync::atomic::{AtomicU64, Ordering};

use anyhow::Result;
use async_trait::async_trait;
use chrono::{DateTime, Utc};
use parking_lot::RwLock;

use super::events::{ConnectionEvent, ConnectionId};
use super::logger::{ConnectionLogger, LoggerStats};

/// In-memory connection logger
///
/// Useful for real-time monitoring without leaving any persistent trace.
/// All data is lost when the server restarts.
pub struct MemoryConnectionLogger {
    /// Maximum number of events to keep
    max_events: usize,
    /// Event buffer (circular)
    events: RwLock<VecDeque<ConnectionEvent>>,
    /// Total events ever logged
    total_logged: AtomicU64,
    /// First event timestamp
    first_event: RwLock<Option<DateTime<Utc>>>,
    /// Last event timestamp
    last_event: RwLock<Option<DateTime<Utc>>>,
}

impl MemoryConnectionLogger {
    pub fn new(max_events: usize) -> Self {
        Self {
            max_events: max_events.max(100), // Minimum 100 events
            events: RwLock::new(VecDeque::with_capacity(max_events.min(10000))),
            total_logged: AtomicU64::new(0),
            first_event: RwLock::new(None),
            last_event: RwLock::new(None),
        }
    }
}

#[async_trait]
impl ConnectionLogger for MemoryConnectionLogger {
    async fn log(&self, event: ConnectionEvent) -> Result<()> {
        let timestamp = event.timestamp();

        {
            let mut events = self.events.write();

            // Update first event if this is the first
            {
                let mut first = self.first_event.write();
                if first.is_none() {
                    *first = Some(timestamp);
                }
            }

            // Update last event
            {
                let mut last = self.last_event.write();
                *last = Some(timestamp);
            }

            // Add event, removing oldest if at capacity
            if events.len() >= self.max_events {
                events.pop_front();
            }
            events.push_back(event);
        }

        self.total_logged.fetch_add(1, Ordering::Relaxed);

        Ok(())
    }

    async fn query_recent(&self, limit: usize) -> Result<Option<Vec<ConnectionEvent>>> {
        let events = self.events.read();
        let result: Vec<_> = events.iter().rev().take(limit).cloned().collect();
        Ok(Some(result))
    }

    async fn query_connection(&self, id: ConnectionId) -> Result<Option<Vec<ConnectionEvent>>> {
        let events = self.events.read();
        let result: Vec<_> = events
            .iter()
            .filter(|e| e.connection_id() == id)
            .cloned()
            .collect();
        Ok(Some(result))
    }

    async fn flush(&self) -> Result<()> {
        // Nothing to flush - all in memory
        Ok(())
    }

    async fn cleanup(&self) -> Result<()> {
        // Optionally clear old events based on time
        // For now, we just rely on the circular buffer
        Ok(())
    }

    fn stats(&self) -> LoggerStats {
        let events = self.events.read();
        let first = self.first_event.read();
        let last = self.last_event.read();

        LoggerStats {
            events_logged: self.total_logged.load(Ordering::Relaxed),
            pending_events: events.len() as u64,
            storage_bytes: Some(events.len() as u64 * 256), // Rough estimate
            oldest_event: *first,
            newest_event: *last,
        }
    }

    fn logger_type(&self) -> &'static str {
        "memory"
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::connection_log::events::ConnectionEventBuilder;
    use std::net::{IpAddr, Ipv4Addr, SocketAddr};

    #[tokio::test]
    async fn test_memory_logger() {
        let logger = MemoryConnectionLogger::new(10);

        let addr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(192, 168, 1, 1)), 12345);

        // Log some events
        for _ in 0..5 {
            let event = ConnectionEventBuilder::new().attempt(addr);
            logger.log(event).await.unwrap();
        }

        // Query recent
        let recent = logger.query_recent(3).await.unwrap().unwrap();
        assert_eq!(recent.len(), 3);

        // Check stats
        let stats = logger.stats();
        assert_eq!(stats.events_logged, 5);
    }

    #[tokio::test]
    async fn test_memory_logger_circular() {
        // Note: MemoryConnectionLogger has a minimum capacity of 100
        let logger = MemoryConnectionLogger::new(100);

        let addr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(192, 168, 1, 1)), 12345);

        // Log more than capacity
        for _ in 0..150 {
            let event = ConnectionEventBuilder::new().attempt(addr);
            logger.log(event).await.unwrap();
        }

        // Should only have 100 events (max capacity)
        let recent = logger.query_recent(200).await.unwrap().unwrap();
        assert_eq!(recent.len(), 100);

        // But total logged should be 150
        let stats = logger.stats();
        assert_eq!(stats.events_logged, 150);
    }
}
