//! Settings View
//!
//! Application settings and preferences.

use openkit::prelude::*;
use crate::state::{SharedState, AppView};

/// Build the settings view.
pub fn build_settings_view(state: SharedState) -> Column {
    let app_state = state.read();
    let auth_method = app_state.auth_method;
    let auto_connect = app_state.auto_connect;
    let show_notifications = app_state.show_notifications;
    let remember_credentials = app_state.remember_credentials;
    drop(app_state);

    let back_state = state.clone();
    let auto_connect_state = state.clone();
    let notifications_state = state.clone();
    let remember_state = state.clone();
    let auth_oauth_state = state.clone();
    let auth_password_state = state.clone();

    Column::new()
        .gap(20.0)
        .padding(EdgeInsets::new(16.0, 20.0, 16.0, 20.0))
        .child(
            // Header
            Row::new()
                .gap(12.0)
                .align(Alignment::Center)
                .child(
                    Button::new("←")
                        .variant(ButtonVariant::Ghost)
                        .on_click(move || {
                            back_state.write().current_view = AppView::Connection;
                        })
                )
                .child(Label::new("Settings").class("view-title"))
        )
        // Authentication Section
        .child(
            Column::new()
                .gap(12.0)
                .child(Label::new("Authentication").class("section-title"))
                .child(
                    Card::new()
                        .variant(CardVariant::Outlined)
                        .padding(16.0)
                        .child(
                            Column::new()
                                .gap(16.0)
                                .child(
                                    Row::new()
                                        .gap(12.0)
                                        .align(Alignment::Center)
                                        .justify(Alignment::SpaceBetween)
                                        .child(
                                            Column::new()
                                                .gap(4.0)
                                                .child(Label::new("OAuth2/SSO").class("setting-label"))
                                                .child(Label::new("Sign in with your organization").class("setting-desc"))
                                        )
                                        .child(
                                            ToggleSwitch::new()
                                                .checked(auth_method == AuthMethod::OAuth2)
                                                .on_change(move |enabled| {
                                                    let mut state = auth_oauth_state.write();
                                                    if enabled {
                                                        state.auth_method = AuthMethod::OAuth2;
                                                    }
                                                })
                                        )
                                )
                                .child(Separator::horizontal())
                                .child(
                                    Row::new()
                                        .gap(12.0)
                                        .align(Alignment::Center)
                                        .justify(Alignment::SpaceBetween)
                                        .child(
                                            Column::new()
                                                .gap(4.0)
                                                .child(Label::new("Username/Password").class("setting-label"))
                                                .child(Label::new("Traditional credentials").class("setting-desc"))
                                        )
                                        .child(
                                            ToggleSwitch::new()
                                                .checked(auth_method == AuthMethod::UsernamePassword)
                                                .on_change(move |enabled| {
                                                    let mut state = auth_password_state.write();
                                                    if enabled {
                                                        state.auth_method = AuthMethod::UsernamePassword;
                                                    }
                                                })
                                        )
                                )
                                .child(Separator::horizontal())
                                .child(
                                    Row::new()
                                        .gap(12.0)
                                        .align(Alignment::Center)
                                        .justify(Alignment::SpaceBetween)
                                        .child(
                                            Column::new()
                                                .gap(4.0)
                                                .child(Label::new("Remember Credentials").class("setting-label"))
                                                .child(Label::new("Save login information").class("setting-desc"))
                                        )
                                        .child(
                                            ToggleSwitch::new()
                                                .checked(remember_credentials)
                                                .disabled(auth_method != AuthMethod::UsernamePassword)
                                                .on_change(move |enabled| {
                                                    remember_state.write().remember_credentials = enabled;
                                                })
                                        )
                                )
                        )
                )
        )
        // Connection Section
        .child(
            Column::new()
                .gap(12.0)
                .child(Label::new("Connection").class("section-title"))
                .child(
                    Card::new()
                        .variant(CardVariant::Outlined)
                        .padding(16.0)
                        .child(
                            Column::new()
                                .gap(16.0)
                                .child(
                                    Row::new()
                                        .gap(12.0)
                                        .align(Alignment::Center)
                                        .justify(Alignment::SpaceBetween)
                                        .child(
                                            Column::new()
                                                .gap(4.0)
                                                .child(Label::new("Auto-Connect").class("setting-label"))
                                                .child(Label::new("Connect when app starts").class("setting-desc"))
                                        )
                                        .child(
                                            ToggleSwitch::new()
                                                .checked(auto_connect)
                                                .on_change(move |enabled| {
                                                    auto_connect_state.write().auto_connect = enabled;
                                                })
                                        )
                                )
                        )
                )
        )
        // Notifications Section
        .child(
            Column::new()
                .gap(12.0)
                .child(Label::new("Notifications").class("section-title"))
                .child(
                    Card::new()
                        .variant(CardVariant::Outlined)
                        .padding(16.0)
                        .child(
                            Row::new()
                                .gap(12.0)
                                .align(Alignment::Center)
                                .justify(Alignment::SpaceBetween)
                                .child(
                                    Column::new()
                                        .gap(4.0)
                                        .child(Label::new("Show Notifications").class("setting-label"))
                                        .child(Label::new("Connection status alerts").class("setting-desc"))
                                )
                                .child(
                                    ToggleSwitch::new()
                                        .checked(show_notifications)
                                        .on_change(move |enabled| {
                                            notifications_state.write().show_notifications = enabled;
                                        })
                                )
                        )
                )
        )
        .class("settings-view")
}
