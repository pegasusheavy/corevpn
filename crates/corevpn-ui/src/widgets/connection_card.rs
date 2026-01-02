//! Connection Card Widget
//!
//! Main connection control card with status, stats, and connect/disconnect buttons.

use openkit::prelude::*;
use crate::types::{AuthMethod, ConnectionStats, VpnConnectionStatus};

/// Connection card widget for the main VPN interface.
pub struct ConnectionCard {
    status: VpnConnectionStatus,
    server_name: String,
    auth_method: AuthMethod,
    stats: ConnectionStats,
    show_stats: bool,
    on_connect: Option<Box<dyn Fn() + Send + Sync + 'static>>,
    on_disconnect: Option<Box<dyn Fn() + Send + Sync + 'static>>,
}

impl Default for ConnectionCard {
    fn default() -> Self {
        Self {
            status: VpnConnectionStatus::Disconnected,
            server_name: String::new(),
            auth_method: AuthMethod::OAuth2,
            stats: ConnectionStats::default(),
            show_stats: true,
            on_connect: None,
            on_disconnect: None,
        }
    }
}

impl ConnectionCard {
    /// Create a new connection card.
    pub fn new() -> Self {
        Self::default()
    }

    /// Set the connection status.
    pub fn status(mut self, status: VpnConnectionStatus) -> Self {
        self.status = status;
        self
    }

    /// Set the server name.
    pub fn server_name(mut self, name: &str) -> Self {
        self.server_name = name.to_string();
        self
    }

    /// Set the authentication method.
    pub fn auth_method(mut self, method: AuthMethod) -> Self {
        self.auth_method = method;
        self
    }

    /// Set connection statistics.
    pub fn stats(mut self, stats: ConnectionStats) -> Self {
        self.stats = stats;
        self
    }

    /// Show/hide statistics.
    pub fn show_stats(mut self, show: bool) -> Self {
        self.show_stats = show;
        self
    }

    /// Set connect callback.
    pub fn on_connect<F>(mut self, callback: F) -> Self
    where
        F: Fn() + Send + Sync + 'static,
    {
        self.on_connect = Some(Box::new(callback));
        self
    }

    /// Set disconnect callback.
    pub fn on_disconnect<F>(mut self, callback: F) -> Self
    where
        F: Fn() + Send + Sync + 'static,
    {
        self.on_disconnect = Some(Box::new(callback));
        self
    }

    fn build_status_section(&self) -> Column {
        let status_icon = match self.status {
            VpnConnectionStatus::Disconnected => "🔓",
            VpnConnectionStatus::Connecting | VpnConnectionStatus::Authenticating => "⏳",
            VpnConnectionStatus::Connected => "🔒",
            VpnConnectionStatus::Disconnecting | VpnConnectionStatus::Reconnecting => "⏳",
            VpnConnectionStatus::Error => "⚠️",
        };

        Column::new()
            .gap(8.0)
            .align(Alignment::Center)
            .child(Label::new(status_icon).class("status-icon-large"))
            .child(Label::new(self.status.as_str()).class("status-text"))
            .child(Label::new(&self.server_name).class("server-name"))
    }

    fn build_stats_section(&self) -> Column {
        if !self.show_stats || !self.status.is_connected() {
            return Column::new();
        }

        Column::new()
            .gap(12.0)
            .child(
                Row::new()
                    .gap(24.0)
                    .justify(Alignment::SpaceEvenly)
                    .child(
                        Column::new()
                            .gap(4.0)
                            .align(Alignment::Center)
                            .child(Label::new("↓ Download").class("stat-label"))
                            .child(Label::new(ConnectionStats::format_bytes(self.stats.bytes_rx)).class("stat-value"))
                            .child(Label::new(ConnectionStats::format_speed(self.stats.speed_rx)).class("stat-speed"))
                    )
                    .child(
                        Column::new()
                            .gap(4.0)
                            .align(Alignment::Center)
                            .child(Label::new("↑ Upload").class("stat-label"))
                            .child(Label::new(ConnectionStats::format_bytes(self.stats.bytes_tx)).class("stat-value"))
                            .child(Label::new(ConnectionStats::format_speed(self.stats.speed_tx)).class("stat-speed"))
                    )
            )
            .child(
                Row::new()
                    .justify(Alignment::Center)
                    .child(Label::new("⏱️").class("duration-icon"))
                    .child(Label::new(ConnectionStats::format_duration(self.stats.duration_secs)).class("duration-value"))
            )
            .class("stats-section")
    }

    fn build_action_button(&self) -> Button {
        match self.status {
            VpnConnectionStatus::Disconnected | VpnConnectionStatus::Error => {
                let mut btn = Button::new("Connect")
                    .variant(ButtonVariant::Primary)
                    .class("connect-btn");

                if let Some(ref callback) = self.on_connect {
                    // Clone the callback for the closure
                    let cb = callback.as_ref();
                    // Note: This is a simplified version - actual implementation
                    // would need to handle the callback properly
                    btn = btn.class("has-callback");
                }
                btn
            }
            VpnConnectionStatus::Connected => {
                let mut btn = Button::new("Disconnect")
                    .variant(ButtonVariant::Danger)
                    .class("disconnect-btn");

                if let Some(ref callback) = self.on_disconnect {
                    btn = btn.class("has-callback");
                }
                btn
            }
            _ => {
                Button::new("...")
                    .variant(ButtonVariant::Ghost)
                    .disabled(true)
                    .class("action-btn-disabled")
            }
        }
    }
}

impl Widget for ConnectionCard {
    fn build(&self) -> Element {
        let mut card = Column::new()
            .gap(24.0)
            .align(Alignment::Center)
            .padding(EdgeInsets::all(24.0))
            .child(self.build_status_section())
            .child(self.build_stats_section())
            .child(self.build_action_button())
            .class("connection-card");

        // Add auth method indicator
        if self.auth_method.is_sso() {
            card = card.class("sso-enabled");
        }

        card.build()
    }
}
