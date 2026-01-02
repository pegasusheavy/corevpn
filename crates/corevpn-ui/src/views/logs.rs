//! Logs View
//!
//! Connection logs display.

use openkit::prelude::*;
use crate::state::{SharedState, AppView};

/// Build the logs view.
pub fn build_logs_view(state: SharedState) -> Column {
    let back_state = state.clone();

    Column::new()
        .gap(16.0)
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
                .child(Label::new("Connection Logs").class("view-title"))
                .child(
                    Button::new("Clear")
                        .variant(ButtonVariant::Ghost)
                )
        )
        .child(
            // Log content area
            Card::new()
                .variant(CardVariant::Outlined)
                .padding(16.0)
                .child(
                    Column::new()
                        .gap(8.0)
                        .child(log_entry("INFO", "Application started"))
                        .child(log_entry("INFO", "Loading configuration..."))
                        .child(log_entry("INFO", "Configuration loaded successfully"))
                        .child(log_entry("INFO", "Ready to connect"))
                )
        )
        .class("logs-view")
}

fn log_entry(level: &str, message: &str) -> impl Widget {
    let level_class = match level {
        "ERROR" => "log-error",
        "WARN" => "log-warn",
        "DEBUG" => "log-debug",
        _ => "log-info",
    };

    Row::new()
        .gap(8.0)
        .child(Label::new(format!("[{}]", level)).class(level_class))
        .child(Label::new(message).class("log-message"))
        .class("log-entry")
}
