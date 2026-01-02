//! Server List Widget
//!
//! Displays a list of VPN servers with selection capability.

use openkit::prelude::*;
use crate::types::VpnServer;

/// Server list widget for server selection.
pub struct ServerList {
    servers: Vec<VpnServer>,
    selected_id: Option<String>,
    on_select: Option<Box<dyn Fn(&str) + Send + Sync + 'static>>,
    show_load: bool,
    show_latency: bool,
}

impl Default for ServerList {
    fn default() -> Self {
        Self {
            servers: Vec::new(),
            selected_id: None,
            on_select: None,
            show_load: true,
            show_latency: true,
        }
    }
}

impl ServerList {
    /// Create a new server list.
    pub fn new() -> Self {
        Self::default()
    }

    /// Set the list of servers.
    pub fn servers(mut self, servers: Vec<VpnServer>) -> Self {
        self.servers = servers;
        self
    }

    /// Set the selected server ID.
    pub fn selected(mut self, id: Option<String>) -> Self {
        self.selected_id = id;
        self
    }

    /// Set select callback.
    pub fn on_select<F>(mut self, callback: F) -> Self
    where
        F: Fn(&str) + Send + Sync + 'static,
    {
        self.on_select = Some(Box::new(callback));
        self
    }

    /// Show/hide load indicators.
    pub fn show_load(mut self, show: bool) -> Self {
        self.show_load = show;
        self
    }

    /// Show/hide latency indicators.
    pub fn show_latency(mut self, show: bool) -> Self {
        self.show_latency = show;
        self
    }

    fn build_server_row(&self, server: &VpnServer) -> Row {
        let is_selected = self.selected_id.as_ref() == Some(&server.id);
        let country_flag = server.country.as_ref()
            .map(|c| country_to_flag(c))
            .unwrap_or("🌍");

        let mut row = Row::new()
            .gap(12.0)
            .align(Alignment::Center)
            .padding(EdgeInsets::new(12.0, 16.0, 12.0, 16.0))
            .child(Label::new(country_flag).class("server-flag"))
            .child(
                Column::new()
                    .gap(4.0)
                    .child(Label::new(&server.name).class("server-name"))
                    .child(Label::new(server.location()).class("server-location"))
            );

        // Add load indicator
        if self.show_load {
            if let Some(load) = server.load {
                let load_class = if load > 80 {
                    "load-high"
                } else if load > 50 {
                    "load-medium"
                } else {
                    "load-low"
                };
                row = row.child(
                    Label::new(format!("{}%", load))
                        .class("server-load")
                        .class(load_class)
                );
            }
        }

        // Add latency indicator
        if self.show_latency {
            if let Some(latency) = server.latency {
                let latency_class = if latency > 150 {
                    "latency-high"
                } else if latency > 75 {
                    "latency-medium"
                } else {
                    "latency-low"
                };
                row = row.child(
                    Label::new(format!("{}ms", latency))
                        .class("server-latency")
                        .class(latency_class)
                );
            }
        }

        // Add SSO badge if supported
        if server.sso_enabled {
            row = row.child(Label::new("🔐").class("sso-badge"));
        }

        // Selection indicator
        if is_selected {
            row = row.child(Label::new("✓").class("selected-indicator"));
            row = row.class("server-row-selected");
        }

        row.class("server-row")
    }
}

impl Widget for ServerList {
    fn build(&self) -> Element {
        let mut list = Column::new()
            .gap(4.0)
            .class("server-list");

        for server in &self.servers {
            list = list.child(self.build_server_row(server));
        }

        if self.servers.is_empty() {
            list = list.child(
                Label::new("No servers available")
                    .class("no-servers-message")
            );
        }

        list.build()
    }
}

/// Convert ISO country code to flag emoji.
fn country_to_flag(code: &str) -> &'static str {
    match code.to_uppercase().as_str() {
        "US" => "🇺🇸",
        "GB" | "UK" => "🇬🇧",
        "DE" => "🇩🇪",
        "FR" => "🇫🇷",
        "NL" => "🇳🇱",
        "SE" => "🇸🇪",
        "CH" => "🇨🇭",
        "JP" => "🇯🇵",
        "SG" => "🇸🇬",
        "AU" => "🇦🇺",
        "CA" => "🇨🇦",
        "BR" => "🇧🇷",
        "IN" => "🇮🇳",
        "KR" => "🇰🇷",
        "HK" => "🇭🇰",
        _ => "🌍",
    }
}
