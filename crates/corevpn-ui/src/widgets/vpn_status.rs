//! VPN Status Indicator Widget
//!
//! Displays the current VPN connection status with visual indicators.

use openkit::prelude::*;
use crate::types::VpnConnectionStatus;

/// Size variants for the VPN status indicator.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum VpnStatusSize {
    /// Compact indicator for headers
    Compact,
    /// Standard size
    #[default]
    Normal,
    /// Large display for main view
    Large,
}

/// VPN status indicator widget.
#[derive(Default)]
pub struct VpnStatus {
    status: VpnConnectionStatus,
    size: VpnStatusSize,
    pulse: bool,
}

impl VpnStatus {
    /// Create a new VPN status widget.
    pub fn new() -> Self {
        Self::default()
    }

    /// Set the connection status.
    pub fn status(mut self, status: VpnConnectionStatus) -> Self {
        self.status = status;
        self
    }

    /// Set the size variant.
    pub fn size(mut self, size: VpnStatusSize) -> Self {
        self.size = size;
        self
    }

    /// Enable pulsing animation for transitional states.
    pub fn pulse(mut self, pulse: bool) -> Self {
        self.pulse = pulse;
        self
    }

    fn status_icon(&self) -> &'static str {
        match self.status {
            VpnConnectionStatus::Disconnected => "⚪",
            VpnConnectionStatus::Connecting | VpnConnectionStatus::Authenticating => "🟡",
            VpnConnectionStatus::Connected => "🟢",
            VpnConnectionStatus::Disconnecting | VpnConnectionStatus::Reconnecting => "🟠",
            VpnConnectionStatus::Error => "🔴",
        }
    }

    fn status_class(&self) -> &'static str {
        match self.status {
            VpnConnectionStatus::Disconnected => "status-disconnected",
            VpnConnectionStatus::Connecting | VpnConnectionStatus::Authenticating => "status-connecting",
            VpnConnectionStatus::Connected => "status-connected",
            VpnConnectionStatus::Disconnecting | VpnConnectionStatus::Reconnecting => "status-disconnecting",
            VpnConnectionStatus::Error => "status-error",
        }
    }
}

impl Widget for VpnStatus {
    fn build(&self) -> Element {
        let size_class = match self.size {
            VpnStatusSize::Compact => "vpn-status-compact",
            VpnStatusSize::Normal => "vpn-status-normal",
            VpnStatusSize::Large => "vpn-status-large",
        };

        let pulse_class = if self.pulse && self.status.is_transitioning() {
            "status-pulse"
        } else {
            ""
        };

        Row::new()
            .gap(8.0)
            .align(Alignment::Center)
            .child(Label::new(self.status_icon()))
            .child(Label::new(self.status.as_str()))
            .class(size_class)
            .class(self.status_class())
            .class(pulse_class)
            .build()
    }
}
