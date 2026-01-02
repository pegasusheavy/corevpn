//! Event Anonymizer
//!
//! Applies anonymization transforms to connection events based on configuration.
//! Useful for privacy-conscious logging.

use std::net::{IpAddr, Ipv4Addr, Ipv6Addr, SocketAddr};

use chrono::{DateTime, Datelike, Timelike, Utc};
use corevpn_config::ConnectionLogAnonymization;

use super::events::{ConnectionEvent, TransferStats};

/// Anonymizes connection events based on configuration
pub struct Anonymizer {
    config: ConnectionLogAnonymization,
    /// Daily rotating salt for hashing (changes each day)
    daily_salt: [u8; 32],
    /// Current day (for salt rotation)
    current_day: u32,
}

impl Anonymizer {
    pub fn new(config: ConnectionLogAnonymization) -> Self {
        let now = Utc::now();
        let day = now.ordinal();

        Self {
            config,
            daily_salt: Self::generate_salt(day),
            current_day: day,
        }
    }

    fn generate_salt(day: u32) -> [u8; 32] {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};

        let mut hasher = DefaultHasher::new();
        day.hash(&mut hasher);
        "corevpn-anonymizer-salt".hash(&mut hasher);

        let hash = hasher.finish();
        let mut salt = [0u8; 32];

        // Fill salt from hash (repeated)
        for (i, byte) in salt.iter_mut().enumerate() {
            *byte = ((hash >> ((i % 8) * 8)) & 0xFF) as u8;
        }

        salt
    }

    fn rotate_salt_if_needed(&mut self) {
        let now = Utc::now();
        let day = now.ordinal();

        if day != self.current_day {
            self.daily_salt = Self::generate_salt(day);
            self.current_day = day;
        }
    }

    /// Anonymize a connection event
    pub fn anonymize(&mut self, event: ConnectionEvent) -> ConnectionEvent {
        self.rotate_salt_if_needed();

        match event {
            ConnectionEvent::ConnectionAttempt {
                connection_id,
                timestamp,
                client_addr,
                protocol_version,
            } => ConnectionEvent::ConnectionAttempt {
                connection_id,
                timestamp: self.anonymize_timestamp(timestamp),
                client_addr: self.anonymize_socket_addr(client_addr),
                protocol_version,
            },

            ConnectionEvent::Authentication {
                connection_id,
                timestamp,
                client_addr,
                username,
                auth_method,
                result,
                details,
            } => ConnectionEvent::Authentication {
                connection_id,
                timestamp: self.anonymize_timestamp(timestamp),
                client_addr: self.anonymize_socket_addr(client_addr),
                username: self.anonymize_username(username),
                auth_method,
                result,
                details: None, // Remove potentially identifying details
            },

            ConnectionEvent::Connected {
                connection_id,
                timestamp,
                client_addr,
                username,
                vpn_ip,
                auth_method,
                client_info,
            } => ConnectionEvent::Connected {
                connection_id,
                timestamp: self.anonymize_timestamp(timestamp),
                client_addr: self.anonymize_socket_addr(client_addr),
                username: self.anonymize_username(username),
                vpn_ip, // VPN IP is internal, less sensitive
                auth_method,
                client_info: None, // Remove client info (fingerprinting risk)
            },

            ConnectionEvent::Disconnected {
                connection_id,
                timestamp,
                client_addr,
                username,
                reason,
                duration,
                stats,
            } => ConnectionEvent::Disconnected {
                connection_id,
                timestamp: self.anonymize_timestamp(timestamp),
                client_addr: self.anonymize_socket_addr(client_addr),
                username: self.anonymize_username(username),
                reason,
                duration,
                stats: self.anonymize_stats(stats),
            },

            ConnectionEvent::IpChange {
                connection_id,
                timestamp,
                old_addr,
                new_addr,
                username,
            } => ConnectionEvent::IpChange {
                connection_id,
                timestamp: self.anonymize_timestamp(timestamp),
                old_addr: self.anonymize_socket_addr(old_addr),
                new_addr: self.anonymize_socket_addr(new_addr),
                username: self.anonymize_username(username),
            },

            ConnectionEvent::Renegotiation {
                connection_id,
                timestamp,
                client_addr,
                success,
            } => ConnectionEvent::Renegotiation {
                connection_id,
                timestamp: self.anonymize_timestamp(timestamp),
                client_addr: self.anonymize_socket_addr(client_addr),
                success,
            },
        }
    }

    fn anonymize_timestamp(&self, timestamp: DateTime<Utc>) -> DateTime<Utc> {
        if self.config.round_timestamps {
            // Round to nearest hour
            timestamp
                .with_minute(0)
                .and_then(|t| t.with_second(0))
                .and_then(|t| t.with_nanosecond(0))
                .unwrap_or(timestamp)
        } else {
            timestamp
        }
    }

    fn anonymize_socket_addr(&self, addr: SocketAddr) -> SocketAddr {
        let ip = if self.config.hash_client_ips {
            self.hash_ip(addr.ip())
        } else if self.config.truncate_client_ips {
            self.truncate_ip(addr.ip())
        } else {
            addr.ip()
        };

        // Always anonymize the port (not useful for logging, potential fingerprint)
        SocketAddr::new(ip, 0)
    }

    fn hash_ip(&self, ip: IpAddr) -> IpAddr {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};

        let mut hasher = DefaultHasher::new();
        ip.hash(&mut hasher);
        self.daily_salt.hash(&mut hasher);

        let hash = hasher.finish();

        match ip {
            IpAddr::V4(_) => {
                // Use hash to generate a deterministic but unlinkable IPv4
                // Use reserved range 0.0.0.0/8 to indicate hashed
                let bytes = [
                    0u8, // Reserved prefix
                    ((hash >> 8) & 0xFF) as u8,
                    ((hash >> 16) & 0xFF) as u8,
                    ((hash >> 24) & 0xFF) as u8,
                ];
                IpAddr::V4(Ipv4Addr::from(bytes))
            }
            IpAddr::V6(_) => {
                // Use hash for IPv6 as well, using documentation prefix
                let bytes: [u8; 16] = [
                    0x20, 0x01, 0x0d, 0xb8, // 2001:db8::/32 documentation prefix
                    ((hash >> 32) & 0xFF) as u8,
                    ((hash >> 40) & 0xFF) as u8,
                    ((hash >> 48) & 0xFF) as u8,
                    ((hash >> 56) & 0xFF) as u8,
                    (hash & 0xFF) as u8,
                    ((hash >> 8) & 0xFF) as u8,
                    ((hash >> 16) & 0xFF) as u8,
                    ((hash >> 24) & 0xFF) as u8,
                    0, 0, 0, 0,
                ];
                IpAddr::V6(Ipv6Addr::from(bytes))
            }
        }
    }

    fn truncate_ip(&self, ip: IpAddr) -> IpAddr {
        match ip {
            IpAddr::V4(v4) => {
                // Truncate to /24
                let octets = v4.octets();
                IpAddr::V4(Ipv4Addr::new(octets[0], octets[1], octets[2], 0))
            }
            IpAddr::V6(v6) => {
                // Truncate to /48
                let segments = v6.segments();
                IpAddr::V6(Ipv6Addr::new(
                    segments[0],
                    segments[1],
                    segments[2],
                    0,
                    0,
                    0,
                    0,
                    0,
                ))
            }
        }
    }

    fn anonymize_username(&self, username: Option<String>) -> Option<String> {
        if !self.config.hash_usernames {
            return username;
        }

        username.map(|u| {
            use std::collections::hash_map::DefaultHasher;
            use std::hash::{Hash, Hasher};

            let mut hasher = DefaultHasher::new();
            u.hash(&mut hasher);
            self.daily_salt.hash(&mut hasher);

            let hash = hasher.finish();
            format!("user_{:016x}", hash)
        })
    }

    fn anonymize_stats(&self, stats: Option<TransferStats>) -> Option<TransferStats> {
        if !self.config.aggregate_transfer_stats {
            return stats;
        }

        stats.map(|s| {
            // Aggregate into buckets: <1KB, <10KB, <100KB, <1MB, <10MB, <100MB, <1GB, >1GB
            fn bucket(bytes: u64) -> u64 {
                match bytes {
                    0..=1023 => 512,                    // ~1KB bucket
                    1024..=10239 => 5 * 1024,           // ~10KB bucket
                    10240..=102399 => 50 * 1024,        // ~100KB bucket
                    102400..=1048575 => 500 * 1024,     // ~1MB bucket
                    1048576..=10485759 => 5 * 1024 * 1024, // ~10MB bucket
                    10485760..=104857599 => 50 * 1024 * 1024, // ~100MB bucket
                    104857600..=1073741823 => 500 * 1024 * 1024, // ~1GB bucket
                    _ => 1024 * 1024 * 1024,            // >1GB bucket
                }
            }

            TransferStats {
                bytes_rx: bucket(s.bytes_rx),
                bytes_tx: bucket(s.bytes_tx),
                packets_rx: 0, // Don't log packets in aggregated mode
                packets_tx: 0,
            }
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::connection_log::events::ConnectionEventBuilder;
    use std::net::{IpAddr, Ipv4Addr, SocketAddr};

    #[test]
    fn test_ip_truncation() {
        let config = ConnectionLogAnonymization {
            truncate_client_ips: true,
            ..Default::default()
        };

        let mut anonymizer = Anonymizer::new(config);

        let addr = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(192, 168, 1, 100)), 12345);
        let result = anonymizer.anonymize_socket_addr(addr);

        assert_eq!(result.ip(), IpAddr::V4(Ipv4Addr::new(192, 168, 1, 0)));
        assert_eq!(result.port(), 0); // Port always anonymized
    }

    #[test]
    fn test_ip_hashing() {
        let config = ConnectionLogAnonymization {
            hash_client_ips: true,
            ..Default::default()
        };

        let mut anonymizer = Anonymizer::new(config);

        let addr1 = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(192, 168, 1, 100)), 12345);
        let addr2 = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(192, 168, 1, 101)), 12345);

        let result1 = anonymizer.anonymize_socket_addr(addr1);
        let result2 = anonymizer.anonymize_socket_addr(addr2);

        // Different IPs should hash to different values
        assert_ne!(result1.ip(), result2.ip());

        // Same IP should hash to same value
        let result1_again = anonymizer.anonymize_socket_addr(addr1);
        assert_eq!(result1.ip(), result1_again.ip());
    }

    #[test]
    fn test_username_hashing() {
        let config = ConnectionLogAnonymization {
            hash_usernames: true,
            ..Default::default()
        };

        let mut anonymizer = Anonymizer::new(config);

        let username = Some("john.doe@example.com".to_string());
        let result = anonymizer.anonymize_username(username);

        assert!(result.is_some());
        assert!(result.unwrap().starts_with("user_"));
    }

    #[test]
    fn test_transfer_stats_aggregation() {
        let config = ConnectionLogAnonymization {
            aggregate_transfer_stats: true,
            ..Default::default()
        };

        let anonymizer = Anonymizer::new(config);

        let stats = Some(TransferStats {
            bytes_rx: 5_000_000, // ~5MB
            bytes_tx: 100,       // ~100 bytes
            packets_rx: 1000,
            packets_tx: 50,
        });

        let result = anonymizer.anonymize_stats(stats).unwrap();

        // Should be bucketed, not exact
        assert_eq!(result.bytes_rx, 5 * 1024 * 1024); // 5MB bucket
        assert_eq!(result.bytes_tx, 512);              // 1KB bucket
        assert_eq!(result.packets_rx, 0);              // Packets not logged
        assert_eq!(result.packets_tx, 0);
    }
}
