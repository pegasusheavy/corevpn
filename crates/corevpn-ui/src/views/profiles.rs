//! Profiles View
//!
//! VPN profile management.

use openkit::prelude::*;
use crate::state::{AppView, SharedState};

/// Build the profiles view.
pub fn build_profiles_view(state: SharedState) -> Column {
    let app_state = state.read();
    let profiles = app_state.profiles.clone();
    let active_profile = app_state.active_profile.clone();
    drop(app_state);

    let back_state = state.clone();

    let mut content = Column::new()
        .gap(20.0)
        .padding(EdgeInsets::new(16.0, 20.0, 16.0, 20.0))
        .child(
            // Header
            Row::new()
                .gap(12.0)
                .align(Alignment::Center)
                .justify(Alignment::SpaceBetween)
                .child(
                    Button::new("←")
                        .variant(ButtonVariant::Ghost)
                        .on_click(move || {
                            back_state.write().current_view = AppView::Connection;
                        })
                )
                .child(Label::new("VPN Profiles").class("view-title"))
                .child(
                    Button::new("+ New")
                        .variant(ButtonVariant::Primary)
                )
        );

    if profiles.is_empty() {
        // Empty state
        content = content.child(
            Column::new()
                .gap(16.0)
                .align(Alignment::Center)
                .child(Label::new("📋").class("empty-icon"))
                .child(Label::new("No profiles yet").class("empty-title"))
                .child(Label::new("Import or create a VPN profile to get started").class("empty-desc"))
                .child(
                    Row::new()
                        .gap(12.0)
                        .child(
                            Button::new("Import .ovpn")
                                .variant(ButtonVariant::Outline)
                        )
                        .child(
                            Button::new("Create Profile")
                                .variant(ButtonVariant::Primary)
                        )
                )
                .class("empty-state")
        );
    } else {
        // Profile list
        for profile in &profiles {
            let is_active = active_profile.as_ref() == Some(&profile.name);
            let profile_state = state.clone();
            let profile_name = profile.name.clone();

            content = content.child(
                Card::new()
                    .variant(if is_active { CardVariant::Default } else { CardVariant::Outlined })
                    .padding(16.0)
                    .child(
                        Row::new()
                            .gap(12.0)
                            .align(Alignment::Center)
                            .justify(Alignment::SpaceBetween)
                            .child(
                                Column::new()
                                    .gap(4.0)
                                    .child(Label::new(&profile.name).class("profile-name"))
                                    .child(Label::new(&profile.server.location()).class("profile-server"))
                                    .child(Label::new(profile.auth_method.label()).class("profile-auth"))
                            )
                            .child(
                                Row::new()
                                    .gap(8.0)
                                    .child(
                                        Button::new(if is_active { "Active" } else { "Activate" })
                                            .variant(if is_active { ButtonVariant::Primary } else { ButtonVariant::Outline })
                                            .on_click(move || {
                                                let mut state = profile_state.write();
                                                state.active_profile = Some(profile_name.clone());
                                            })
                                    )
                            )
                    )
            );
        }
    }

    content.class("profiles-view")
}
