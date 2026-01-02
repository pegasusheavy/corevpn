//! Main Application Logic
//!
//! Contains the core application struct and UI building logic.

use openkit::prelude::*;

use crate::state::{AppView, SharedState, create_shared_state};
use crate::views;

/// CoreVPN Desktop Application.
pub struct CoreVpnApp {
    state: SharedState,
}

impl CoreVpnApp {
    /// Create a new CoreVPN application instance.
    pub fn new() -> Self {
        Self {
            state: create_shared_state(),
        }
    }

    /// Create with existing state (for testing).
    pub fn with_state(state: SharedState) -> Self {
        Self { state }
    }

    /// Get a reference to the application state.
    pub fn state(&self) -> &SharedState {
        &self.state
    }

    /// Build the main UI.
    pub fn build_ui(&self) -> impl Widget {
        let state = self.state.clone();
        let current_view = state.read().current_view;

        // Main container with navigation
        Column::new()
            .gap(0.0)
            .child(self.build_header())
            .child(self.build_main_content(current_view))
            .child(self.build_navigation())
            .class("app-container")
    }

    /// Build the header bar.
    fn build_header(&self) -> impl Widget {
        let state = self.state.clone();
        let connection_status = state.read().connection.status;

        Row::new()
            .gap(12.0)
            .align(Alignment::Center)
            .justify(Alignment::SpaceBetween)
            .padding(EdgeInsets::new(16.0, 20.0, 16.0, 20.0))
            .child(
                Row::new()
                    .gap(12.0)
                    .align(Alignment::Center)
                    .child(Label::new("🛡️").class("app-icon"))
                    .child(Label::new("CoreVPN").class("app-title"))
            )
            .child(
                VpnStatus::new()
                    .status(connection_status)
                    .size(VpnStatusSize::Compact)
                    .pulse(true)
            )
            .class("header-bar")
    }

    /// Build the main content area based on current view.
    fn build_main_content(&self, view: AppView) -> impl Widget {
        let state = self.state.clone();

        match view {
            AppView::Connection => self.build_connection_view(),
            AppView::ServerList => views::build_server_list_view(state),
            AppView::Settings => views::build_settings_view(state),
            AppView::Profiles => views::build_profiles_view(state),
            AppView::Logs => views::build_logs_view(state),
            AppView::About => views::build_about_view(state),
        }
    }

    /// Build the main connection view (OpenVPN Connect style).
    fn build_connection_view(&self) -> Column {
        let state = self.state.clone();
        let app_state = state.read();

        let connection_status = app_state.connection.status;
        let server_name = app_state
            .selected_server()
            .map(|s| s.name.clone())
            .unwrap_or_else(|| "No server selected".to_string());
        let auth_method = app_state.auth_method;
        let stats = app_state.connection.stats.clone();
        let requires_password = app_state.requires_password();
        let username = app_state.username.clone();

        drop(app_state); // Release read lock

        // Clone state for event handlers
        let connect_state = state.clone();
        let disconnect_state = state.clone();
        let server_select_state = state.clone();

        let mut content = Column::new()
            .gap(24.0)
            .align(Alignment::Center)
            .padding(EdgeInsets::new(20.0, 24.0, 20.0, 24.0));

        // Connection card
        content = content.child(
            ConnectionCard::new()
                .status(connection_status)
                .server_name(&server_name)
                .auth_method(auth_method)
                .stats(stats)
                .show_stats(true)
                .on_connect(move || {
                    let mut state = connect_state.write();
                    if state.is_sso() {
                        // For SSO, skip password prompt
                        state.start_connecting();
                        state.set_authenticating();
                        // In real implementation, would open browser for OAuth2
                        tracing::info!("Starting OAuth2 authentication flow");
                    } else {
                        state.start_connecting();
                    }
                })
                .on_disconnect(move || {
                    let mut state = disconnect_state.write();
                    state.start_disconnecting();
                    // Simulate disconnect
                    state.set_disconnected();
                })
        );

        // Server selection button
        content = content.child(
            Button::new(format!("📍 {}", server_name))
                .variant(ButtonVariant::Outline)
                .on_click(move || {
                    let mut state = server_select_state.write();
                    state.current_view = AppView::ServerList;
                })
                .class("server-select-btn")
        );

        // Authentication section (only for username/password auth)
        if requires_password && connection_status == VpnConnectionStatus::Disconnected {
            let username_state = state.clone();
            let password_state = state.clone();

            content = content.child(
                Column::new()
                    .gap(12.0)
                    .child(
                        TextField::new()
                            .placeholder("Username")
                            .value(&username)
                            .on_change(move |value| {
                                username_state.write().username = value.to_string();
                            })
                            .class("auth-input")
                    )
                    .child(
                        PasswordField::new()
                            .placeholder("Password")
                            .on_change(move |value| {
                                password_state.write().password = value.to_string();
                            })
                            .class("auth-input")
                    )
                    .class("auth-section")
            );
        }

        // SSO indicator for OAuth2/SAML
        if auth_method.is_sso() && connection_status == VpnConnectionStatus::Disconnected {
            content = content.child(
                Row::new()
                    .gap(8.0)
                    .align(Alignment::Center)
                    .justify(Alignment::Center)
                    .child(Label::new("🔐").class("sso-icon"))
                    .child(Label::new("Sign in with your organization").class("sso-label"))
                    .class("sso-indicator")
            );
        }

        content.class("connection-view")
    }

    /// Build the bottom navigation bar.
    fn build_navigation(&self) -> impl Widget {
        let state = self.state.clone();
        let current_view = state.read().current_view;

        let nav_home = state.clone();
        let nav_servers = state.clone();
        let nav_settings = state.clone();

        Row::new()
            .gap(0.0)
            .align(Alignment::Center)
            .justify(Alignment::SpaceEvenly)
            .padding(EdgeInsets::new(12.0, 0.0, 12.0, 0.0))
            .child(self.nav_button("🏠", "Home", current_view == AppView::Connection, move || {
                nav_home.write().current_view = AppView::Connection;
            }))
            .child(self.nav_button("📡", "Servers", current_view == AppView::ServerList, move || {
                nav_servers.write().current_view = AppView::ServerList;
            }))
            .child(self.nav_button("⚙️", "Settings", current_view == AppView::Settings, move || {
                nav_settings.write().current_view = AppView::Settings;
            }))
            .class("nav-bar")
    }

    /// Create a navigation button.
    fn nav_button<F>(&self, icon: &str, label: &str, active: bool, on_click: F) -> impl Widget
    where
        F: Fn() + Send + Sync + 'static,
    {
        let variant = if active {
            ButtonVariant::Primary
        } else {
            ButtonVariant::Ghost
        };

        Column::new()
            .gap(4.0)
            .align(Alignment::Center)
            .child(
                Button::new(icon)
                    .variant(variant)
                    .on_click(on_click)
                    .class("nav-btn-icon")
            )
            .child(
                Label::new(label)
                    .class(if active { "nav-label-active" } else { "nav-label" })
            )
            .class("nav-item")
    }
}

impl Default for CoreVpnApp {
    fn default() -> Self {
        Self::new()
    }
}
