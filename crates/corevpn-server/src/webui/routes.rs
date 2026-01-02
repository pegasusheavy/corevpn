//! Web UI Routes
//!
//! HTTP handlers for the admin web interface.
//! All routes are protected by HTTP Basic Authentication.

use axum::{
    Router,
    middleware,
    routing::{get, post},
    response::{Html, IntoResponse, Redirect, Response},
    extract::{State, Path, Form},
    http::StatusCode,
};
use serde::Deserialize;

use super::auth;
use super::state::WebUiState;
use super::templates;

/// Create the web UI router with authentication
pub fn create_router(state: WebUiState) -> Router {
    // Protected admin routes
    let admin_routes = Router::new()
        // Dashboard
        .route("/", get(dashboard))
        .route("/admin", get(dashboard))
        .route("/admin/", get(dashboard))

        // Clients
        .route("/admin/clients", get(clients_list))
        .route("/admin/clients/", get(clients_list))
        .route("/admin/clients/new", get(new_client_form))
        .route("/admin/clients", post(create_client))
        .route("/admin/clients/:id/download", get(download_client_config))
        .route("/admin/clients/:id/download/mobile", get(download_client_config_mobile))
        .route("/admin/clients/:id/revoke", post(revoke_client))
        .route("/admin/clients/quick-generate", get(quick_generate_form))
        .route("/admin/clients/quick-generate", post(quick_generate_download))

        // Sessions
        .route("/admin/sessions", get(sessions_list))
        .route("/admin/sessions/", get(sessions_list))
        .route("/admin/sessions/:id/disconnect", post(disconnect_session))
        .route("/admin/sessions/disconnect-all", post(disconnect_all_sessions))

        // Settings
        .route("/admin/settings", get(settings_page))
        .route("/admin/settings/", get(settings_page))

        // Apply authentication middleware to all admin routes
        .layer(middleware::from_fn(auth::require_auth))
        .with_state(state);

    // Combine with fallback (fallback doesn't need auth)
    admin_routes.fallback(not_found)
}

// ============================================================================
// Route Handlers
// ============================================================================

async fn dashboard(State(state): State<WebUiState>) -> Html<String> {
    let config = &state.config;
    let uptime = state.uptime();

    // Get stats from session manager
    let (active_clients, total_sessions) = {
        let sessions = state.session_manager.read();
        (sessions.active_sessions().len() as u32, sessions.session_count() as u64)
    };

    let html = templates::dashboard(
        &uptime,
        active_clients,
        total_sessions,
        0, // bytes_rx - would come from metrics
        0, // bytes_tx
        &config.server.public_host,
        config.server.listen_addr.port(),
        &config.server.protocol,
        &config.network.subnet,
    );

    Html(html)
}

async fn clients_list(State(_state): State<WebUiState>) -> Html<String> {
    // In a real implementation, this would fetch from the database
    // For now, show empty list
    let clients: Vec<templates::ClientInfo> = vec![];

    Html(templates::clients_list(&clients))
}

async fn new_client_form() -> Html<String> {
    Html(templates::new_client())
}

#[derive(Deserialize)]
struct CreateClientForm {
    name: String,
    email: String,
    #[serde(default = "default_expires")]
    expires: u32,
}

fn default_expires() -> u32 {
    365
}

async fn create_client(
    State(state): State<WebUiState>,
    Form(form): Form<CreateClientForm>,
) -> Response {
    use corevpn_config::generator::ConfigGenerator;
    use corevpn_crypto::CertificateAuthority;

    // Load CA
    let ca_cert = match std::fs::read_to_string(state.config.ca_cert_path()) {
        Ok(c) => c,
        Err(e) => return error_response(500, &format!("Failed to read CA: {}", e)),
    };
    let ca_key = match std::fs::read_to_string(state.config.ca_key_path()) {
        Ok(k) => k,
        Err(e) => return error_response(500, &format!("Failed to read CA key: {}", e)),
    };

    let ca = match CertificateAuthority::from_pem(&ca_cert, &ca_key) {
        Ok(ca) => ca,
        Err(e) => return error_response(500, &format!("Failed to load CA: {}", e)),
    };

    // Load tls-auth key
    let ta_key = std::fs::read_to_string(state.config.ta_key_path()).ok();

    // Generate config
    let config = (*state.config).clone();
    let generator = ConfigGenerator::new(config, ca, ta_key);

    let generated = match generator.generate_client_config(&form.name, Some(&form.email)) {
        Ok(g) => g,
        Err(e) => return error_response(500, &format!("Failed to generate config: {}", e)),
    };

    let filename = generated.filename();
    let ovpn_content = generated.ovpn_content;

    // Show download page with auto-download and config preview
    let html = templates::client_download(&form.name, &filename, &ovpn_content);
    Html(html).into_response()
}

async fn download_client_config(
    State(state): State<WebUiState>,
    Path(id): Path<String>,
) -> Response {
    use corevpn_config::generator::ConfigGenerator;
    use corevpn_crypto::CertificateAuthority;
    use axum::http::header;

    // Load CA
    let ca_cert = match std::fs::read_to_string(state.config.ca_cert_path()) {
        Ok(c) => c,
        Err(e) => return error_response(500, &format!("Failed to read CA: {}", e)),
    };
    let ca_key = match std::fs::read_to_string(state.config.ca_key_path()) {
        Ok(k) => k,
        Err(e) => return error_response(500, &format!("Failed to read CA key: {}", e)),
    };

    let ca = match CertificateAuthority::from_pem(&ca_cert, &ca_key) {
        Ok(ca) => ca,
        Err(e) => return error_response(500, &format!("Failed to load CA: {}", e)),
    };

    let ta_key = std::fs::read_to_string(state.config.ta_key_path()).ok();

    let config = (*state.config).clone();
    let generator = ConfigGenerator::new(config, ca, ta_key);

    let generated = match generator.generate_client_config(&id, Some(&id)) {
        Ok(g) => g,
        Err(e) => return error_response(500, &format!("Failed to generate config: {}", e)),
    };

    let filename = generated.filename();
    let content = generated.ovpn_content;

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/x-openvpn-profile")
        .header(header::CONTENT_DISPOSITION, format!("attachment; filename=\"{}\"", filename))
        .body(content.into())
        .unwrap_or_else(|_| error_response(500, "Failed to build response"))
}

async fn revoke_client(
    State(_state): State<WebUiState>,
    Path(_id): Path<String>,
) -> Redirect {
    // In a real implementation, this would revoke the client certificate
    // For now, just redirect back
    Redirect::to("/admin/clients")
}

/// Download mobile-optimized client config
async fn download_client_config_mobile(
    State(state): State<WebUiState>,
    Path(id): Path<String>,
) -> Response {
    use corevpn_config::generator::ConfigGenerator;
    use corevpn_crypto::CertificateAuthority;
    use axum::http::header;

    // Load CA
    let ca_cert = match std::fs::read_to_string(state.config.ca_cert_path()) {
        Ok(c) => c,
        Err(e) => return error_response(500, &format!("Failed to read CA: {}", e)),
    };
    let ca_key = match std::fs::read_to_string(state.config.ca_key_path()) {
        Ok(k) => k,
        Err(e) => return error_response(500, &format!("Failed to read CA key: {}", e)),
    };

    let ca = match CertificateAuthority::from_pem(&ca_cert, &ca_key) {
        Ok(ca) => ca,
        Err(e) => return error_response(500, &format!("Failed to load CA: {}", e)),
    };

    let ta_key = std::fs::read_to_string(state.config.ta_key_path()).ok();

    let config = (*state.config).clone();
    let generator = ConfigGenerator::new(config, ca, ta_key);

    // Generate mobile-optimized config
    let generated = match generator.generate_mobile_config(&id, Some(&id)) {
        Ok(g) => g,
        Err(e) => return error_response(500, &format!("Failed to generate config: {}", e)),
    };

    let filename = format!("{}-mobile.ovpn", id.replace(['@', '.', ' '], "_"));
    let content = generated.ovpn_content;

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/x-openvpn-profile")
        .header(header::CONTENT_DISPOSITION, format!("attachment; filename=\"{}\"", filename))
        .body(content.into())
        .unwrap_or_else(|_| error_response(500, "Failed to build response"))
}

/// Quick generate form - simple one-field form for fast config generation
async fn quick_generate_form() -> Html<String> {
    Html(templates::quick_generate())
}

/// Quick generate and immediate download
#[derive(Deserialize)]
struct QuickGenerateForm {
    name: String,
    #[serde(default)]
    mobile: bool,
}

async fn quick_generate_download(
    State(state): State<WebUiState>,
    Form(form): Form<QuickGenerateForm>,
) -> Response {
    use corevpn_config::generator::ConfigGenerator;
    use corevpn_crypto::CertificateAuthority;
    use axum::http::header;

    // Validate name
    let name = form.name.trim();
    if name.is_empty() || name.len() > 64 {
        return error_response(400, "Invalid client name. Must be 1-64 characters.");
    }

    // Load CA
    let ca_cert = match std::fs::read_to_string(state.config.ca_cert_path()) {
        Ok(c) => c,
        Err(e) => return error_response(500, &format!("Failed to read CA: {}", e)),
    };
    let ca_key = match std::fs::read_to_string(state.config.ca_key_path()) {
        Ok(k) => k,
        Err(e) => return error_response(500, &format!("Failed to read CA key: {}", e)),
    };

    let ca = match CertificateAuthority::from_pem(&ca_cert, &ca_key) {
        Ok(ca) => ca,
        Err(e) => return error_response(500, &format!("Failed to load CA: {}", e)),
    };

    let ta_key = std::fs::read_to_string(state.config.ta_key_path()).ok();

    let config = (*state.config).clone();
    let generator = ConfigGenerator::new(config, ca, ta_key);

    // Generate config (mobile or standard)
    let generated = if form.mobile {
        generator.generate_mobile_config(name, None)
    } else {
        generator.generate_client_config(name, None)
    };

    let generated = match generated {
        Ok(g) => g,
        Err(e) => return error_response(500, &format!("Failed to generate config: {}", e)),
    };

    let filename = if form.mobile {
        format!("{}-mobile.ovpn", name.replace(['@', '.', ' '], "_"))
    } else {
        generated.filename()
    };
    let content = generated.ovpn_content;

    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/x-openvpn-profile")
        .header(header::CONTENT_DISPOSITION, format!("attachment; filename=\"{}\"", filename))
        .body(content.into())
        .unwrap_or_else(|_| error_response(500, "Failed to build response"))
}

async fn sessions_list(State(state): State<WebUiState>) -> Html<String> {
    // Get active sessions from session manager
    let sessions = {
        let sm = state.session_manager.read();
        sm.active_sessions()
    };

    let session_infos: Vec<templates::SessionInfo> = sessions
        .iter()
        .map(|s| {
            // Format VPN address - prefer IPv4, fall back to IPv6
            let vpn_ip = s.vpn_address
                .and_then(|addr| addr.ipv4.map(|ip| ip.to_string())
                    .or_else(|| addr.ipv6.map(|ip| ip.to_string())))
                .unwrap_or_else(|| "-".to_string());

            templates::SessionInfo {
                id: s.id.to_string(),
                client_name: s.user_id.as_ref().map(|u| u.to_string()).unwrap_or_else(|| "Unknown".to_string()),
                vpn_ip,
                real_ip: format!("{}:{}", s.client_ip, s.client_port),
                connected_at: s.created_at.format("%Y-%m-%d %H:%M").to_string(),
                data_usage: format_data_usage(s.bytes_rx, s.bytes_tx),
            }
        })
        .collect();

    Html(templates::sessions_list(&session_infos))
}

async fn disconnect_session(
    State(state): State<WebUiState>,
    Path(id): Path<String>,
) -> Redirect {
    use corevpn_core::SessionId;

    // Parse UUID and remove session
    if let Ok(uuid) = id.parse::<uuid::Uuid>() {
        let session_id = SessionId::from_bytes(*uuid.as_bytes());
        let sm = state.session_manager.read();
        sm.remove_session(&session_id);
    }

    Redirect::to("/admin/sessions")
}

async fn disconnect_all_sessions(State(state): State<WebUiState>) -> Redirect {
    // Get all session IDs and remove them
    let session_ids: Vec<_> = {
        let sm = state.session_manager.read();
        sm.active_sessions().iter().map(|s| s.id).collect()
    };

    let sm = state.session_manager.read();
    for id in session_ids {
        sm.remove_session(&id);
    }

    Redirect::to("/admin/sessions")
}

async fn settings_page(State(state): State<WebUiState>) -> Html<String> {
    let config = &state.config;

    let (oauth_enabled, oauth_provider) = config.oauth.as_ref()
        .map(|o| (o.enabled, Some(o.provider.as_str())))
        .unwrap_or((false, None));

    let html = templates::settings(
        &config.server.public_host,
        config.server.listen_addr.port(),
        &config.server.protocol,
        &config.network.subnet,
        config.server.max_clients,
        oauth_enabled,
        oauth_provider,
    );

    Html(html)
}

async fn not_found() -> Html<String> {
    Html(templates::error_page(404, "The page you're looking for doesn't exist."))
}

// ============================================================================
// Helpers
// ============================================================================

fn error_response(status: u16, message: &str) -> Response {
    let html = templates::error_page(status, message);
    let status_code = StatusCode::from_u16(status).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);

    (status_code, Html(html)).into_response()
}

fn format_data_usage(rx: u64, tx: u64) -> String {
    let total = rx + tx;
    format_bytes(total)
}

fn format_bytes(bytes: u64) -> String {
    const KB: u64 = 1024;
    const MB: u64 = KB * 1024;
    const GB: u64 = MB * 1024;

    if bytes >= GB {
        format!("{:.1} GB", bytes as f64 / GB as f64)
    } else if bytes >= MB {
        format!("{:.1} MB", bytes as f64 / MB as f64)
    } else if bytes >= KB {
        format!("{:.1} KB", bytes as f64 / KB as f64)
    } else {
        format!("{} B", bytes)
    }
}
