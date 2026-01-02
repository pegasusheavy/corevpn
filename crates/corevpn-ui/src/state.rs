//! Application State Management
//!
//! Manages the global application state for the VPN client.

use std::sync::Arc;
use parking_lot::RwLock;
use chrono::{DateTime, Utc};

use corevpn_auth::ProviderType;
use openkit::prelude::{VpnConnectionStatus, VpnServer, ConnectionStats, AuthMethod};

/// Authentication state.
#[derive(Debug, Clone)]
pub enum AuthState {
    /// Not authenticated
    NotAuthenticated,
    /// Authenticating via OAuth2/SAML (browser opened)
    AwaitingSso {
        /// Provider type
        provider: ProviderType,
        /// State for CSRF protection
        state: String,
    },
    /// Authenticated with credentials
    Authenticated {
        /// User email
        email: String,
        /// User display name
        name: Option<String>,
        /// Token expiration
        expires_at: Option<DateTime<Utc>>,
    },
    /// Authentication failed
    Failed {
        /// Error message
        error: String,
    },
}

impl Default for AuthState {
    fn default() -> Self {
        Self::NotAuthenticated
    }
}

/// VPN Connection state.
#[derive(Debug, Clone)]
pub struct ConnectionState {
    /// Current status
    pub status: VpnConnectionStatus,
    /// Connected server (if any)
    pub server: Option<VpnServer>,
    /// Connection statistics
    pub stats: ConnectionStats,
    /// Connection start time
    pub connected_at: Option<DateTime<Utc>>,
    /// Last error message
    pub last_error: Option<String>,
}

impl Default for ConnectionState {
    fn default() -> Self {
        Self {
            status: VpnConnectionStatus::Disconnected,
            server: None,
            stats: ConnectionStats::default(),
            connected_at: None,
            last_error: None,
        }
    }
}

impl ConnectionState {
    /// Update connection duration.
    pub fn update_duration(&mut self) {
        if let Some(connected_at) = self.connected_at {
            let duration = Utc::now() - connected_at;
            self.stats.duration_secs = duration.num_seconds().max(0) as u64;
        }
    }
}

/// Main application state.
#[derive(Debug, Clone)]
pub struct AppState {
    /// Current view
    pub current_view: AppView,
    /// Authentication state
    pub auth: AuthState,
    /// Connection state
    pub connection: ConnectionState,
    /// Available servers
    pub servers: Vec<VpnServer>,
    /// Selected server ID
    pub selected_server_id: Option<String>,
    /// Saved profiles
    pub profiles: Vec<VpnProfile>,
    /// Active profile name
    pub active_profile: Option<String>,
    /// Authentication method for current profile
    pub auth_method: AuthMethod,
    /// Username (for username/password auth)
    pub username: String,
    /// Password (for username/password auth) - not persisted
    pub password: String,
    /// Remember credentials
    pub remember_credentials: bool,
    /// Auto-connect on startup
    pub auto_connect: bool,
    /// Show notifications
    pub show_notifications: bool,
}

/// VPN Profile (saved connection configuration).
#[derive(Debug, Clone)]
pub struct VpnProfile {
    /// Profile name
    pub name: String,
    /// Server configuration
    pub server: VpnServer,
    /// Authentication method
    pub auth_method: AuthMethod,
    /// Saved username (if any)
    pub username: Option<String>,
    /// OAuth2 provider type (if SSO)
    pub oauth_provider: Option<ProviderType>,
    /// Auto-connect this profile
    pub auto_connect: bool,
}

/// Application views.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum AppView {
    /// Main connection view
    #[default]
    Connection,
    /// Server selection list
    ServerList,
    /// Profile management
    Profiles,
    /// Settings
    Settings,
    /// Connection logs
    Logs,
    /// About/Help
    About,
}

impl Default for AppState {
    fn default() -> Self {
        // Default demo servers for development
        let demo_servers = vec![
            VpnServer::new("us-east-1", "US East", "vpn-us-east.corevpn.io")
                .country("US")
                .city("New York")
                .port(1194)
                .load(35)
                .latency(25)
                .sso_enabled(true),
            VpnServer::new("us-west-1", "US West", "vpn-us-west.corevpn.io")
                .country("US")
                .city("San Francisco")
                .port(1194)
                .load(62)
                .latency(45)
                .sso_enabled(true),
            VpnServer::new("eu-west-1", "Europe West", "vpn-eu-west.corevpn.io")
                .country("DE")
                .city("Frankfurt")
                .port(1194)
                .load(48)
                .latency(120)
                .sso_enabled(true),
            VpnServer::new("eu-north-1", "Europe North", "vpn-eu-north.corevpn.io")
                .country("SE")
                .city("Stockholm")
                .port(1194)
                .load(22)
                .latency(135)
                .sso_enabled(true),
            VpnServer::new("ap-east-1", "Asia Pacific", "vpn-ap-east.corevpn.io")
                .country("JP")
                .city("Tokyo")
                .port(1194)
                .load(55)
                .latency(180)
                .sso_enabled(false),
            VpnServer::new("ap-south-1", "Asia South", "vpn-ap-south.corevpn.io")
                .country("SG")
                .city("Singapore")
                .port(1194)
                .load(41)
                .latency(200),
        ];

        Self {
            current_view: AppView::default(),
            auth: AuthState::default(),
            connection: ConnectionState::default(),
            servers: demo_servers,
            selected_server_id: Some("us-east-1".to_string()),
            profiles: Vec::new(),
            active_profile: None,
            auth_method: AuthMethod::OAuth2, // Default to SSO
            username: String::new(),
            password: String::new(),
            remember_credentials: false,
            auto_connect: false,
            show_notifications: true,
        }
    }
}

impl AppState {
    /// Create new application state.
    pub fn new() -> Self {
        Self::default()
    }

    /// Get the currently selected server.
    pub fn selected_server(&self) -> Option<&VpnServer> {
        self.selected_server_id
            .as_ref()
            .and_then(|id| self.servers.iter().find(|s| &s.id == id))
    }

    /// Check if we need to show password input.
    pub fn requires_password(&self) -> bool {
        self.auth_method.requires_password()
    }

    /// Check if using SSO authentication.
    pub fn is_sso(&self) -> bool {
        self.auth_method.is_sso()
    }

    /// Select a server by ID.
    pub fn select_server(&mut self, id: &str) {
        if self.servers.iter().any(|s| s.id == id) {
            self.selected_server_id = Some(id.to_string());

            // Update auth method based on server SSO support
            if let Some(server) = self.servers.iter().find(|s| s.id == id) {
                if server.sso_enabled {
                    self.auth_method = AuthMethod::OAuth2;
                }
            }
        }
    }

    /// Start connection process.
    pub fn start_connecting(&mut self) {
        self.connection.status = VpnConnectionStatus::Connecting;
        self.connection.last_error = None;
    }

    /// Set connection as authenticating.
    pub fn set_authenticating(&mut self) {
        self.connection.status = VpnConnectionStatus::Authenticating;
    }

    /// Set connection as connected.
    pub fn set_connected(&mut self) {
        self.connection.status = VpnConnectionStatus::Connected;
        self.connection.connected_at = Some(Utc::now());
        if let Some(server) = self.selected_server().cloned() {
            self.connection.server = Some(server);
        }
    }

    /// Start disconnection process.
    pub fn start_disconnecting(&mut self) {
        self.connection.status = VpnConnectionStatus::Disconnecting;
    }

    /// Set connection as disconnected.
    pub fn set_disconnected(&mut self) {
        self.connection.status = VpnConnectionStatus::Disconnected;
        self.connection.server = None;
        self.connection.connected_at = None;
        self.connection.stats = ConnectionStats::default();
    }

    /// Set connection error.
    pub fn set_error(&mut self, error: impl Into<String>) {
        self.connection.status = VpnConnectionStatus::Error;
        self.connection.last_error = Some(error.into());
    }

    /// Update connection statistics.
    pub fn update_stats(&mut self, bytes_rx: u64, bytes_tx: u64, speed_rx: u64, speed_tx: u64) {
        self.connection.stats.bytes_rx = bytes_rx;
        self.connection.stats.bytes_tx = bytes_tx;
        self.connection.stats.speed_rx = speed_rx;
        self.connection.stats.speed_tx = speed_tx;
        self.connection.update_duration();
    }
}

/// Thread-safe application state handle.
pub type SharedState = Arc<RwLock<AppState>>;

/// Create a new shared state.
pub fn create_shared_state() -> SharedState {
    Arc::new(RwLock::new(AppState::new()))
}
