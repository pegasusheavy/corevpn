//! CoreVPN Desktop Application Entry Point
//!
//! This is the main entry point for the CoreVPN desktop application.

use openkit::prelude::*;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use corevpn_ui::CoreVpnApp;

fn main() {
    // Initialize logging
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "corevpn_ui=info,openkit=warn".into()),
        )
        .init();

    tracing::info!("Starting CoreVPN Desktop Client");

    // Create and run the application
    let app = CoreVpnApp::new();

    App::new()
        .title("CoreVPN")
        .size(420.0, 680.0)
        .theme(Theme::Auto)
        .run(move || app.build_ui())
        .expect("Failed to run CoreVPN");
}
