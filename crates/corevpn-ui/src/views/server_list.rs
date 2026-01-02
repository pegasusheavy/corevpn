//! Server List View
//!
//! Displays available VPN servers for selection.

use openkit::prelude::*;
use crate::state::{SharedState, AppView};

/// Build the server list view.
pub fn build_server_list_view(state: SharedState) -> Column {
    let app_state = state.read();
    let servers = app_state.servers.clone();
    let selected_id = app_state.selected_server_id.clone();
    drop(app_state);

    let select_state = state.clone();
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
                .child(Label::new("Select Server").class("view-title"))
                .child(Spacer::new())
        )
        .child(
            // Search bar (placeholder)
            TextField::new()
                .placeholder("🔍 Search servers...")
                .class("search-bar")
        )
        .child(
            // Server list
            ServerList::new()
                .servers(servers)
                .selected(selected_id.unwrap_or_default())
                .show_load(true)
                .show_latency(true)
                .on_select(move |server| {
                    let mut state = select_state.write();
                    state.select_server(&server.id);
                    state.current_view = AppView::Connection;
                })
        )
        .class("server-list-view")
}
