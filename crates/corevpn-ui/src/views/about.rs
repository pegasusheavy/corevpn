//! About View
//!
//! Application information and help.

use openkit::prelude::*;
use crate::state::{SharedState, AppView};

/// Build the about view.
pub fn build_about_view(state: SharedState) -> Column {
    let back_state = state.clone();

    Column::new()
        .gap(24.0)
        .align(Alignment::Center)
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
                .child(Label::new("About CoreVPN").class("view-title"))
        )
        .child(
            // Logo/Icon
            Column::new()
                .gap(8.0)
                .align(Alignment::Center)
                .child(Label::new("🛡️").class("about-icon"))
                .child(Label::new("CoreVPN").class("about-title"))
                .child(Label::new("Version 0.1.0").class("about-version"))
        )
        .child(
            // Description
            Card::new()
                .variant(CardVariant::Outlined)
                .padding(20.0)
                .child(
                    Column::new()
                        .gap(12.0)
                        .child(Label::new("A modern, secure VPN client built with Rust.").class("about-desc"))
                        .child(Separator::horizontal())
                        .child(Label::new("Features:").class("about-features-title"))
                        .child(Label::new("• OAuth2/SAML SSO authentication").class("about-feature"))
                        .child(Label::new("• Modern, clean interface").class("about-feature"))
                        .child(Label::new("• Secure, audited cryptography").class("about-feature"))
                        .child(Label::new("• Cross-platform support").class("about-feature"))
                )
        )
        .child(
            // Links
            Column::new()
                .gap(12.0)
                .align(Alignment::Center)
                .child(
                    Button::new("📖 Documentation")
                        .variant(ButtonVariant::Outline)
                )
                .child(
                    Button::new("🐛 Report Issue")
                        .variant(ButtonVariant::Ghost)
                )
        )
        .child(
            // Copyright
            Label::new("© 2024 Pegasus Heavy Industries").class("about-copyright")
        )
        .class("about-view")
}
