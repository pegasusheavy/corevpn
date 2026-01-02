import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent, SidebarSection } from '../components/sidebar';
import { CodeBlockComponent } from '../components/code-block';
import { CalloutComponent } from '../components/callout';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [RouterLink, SidebarComponent, CodeBlockComponent, CalloutComponent],
  template: `
    <div class="min-h-screen pt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex gap-12">
          <!-- Sidebar -->
          <app-sidebar [sections]="sidebarSections" />

          <!-- Content -->
          <main class="flex-1 min-w-0 prose-docs">
            <h1 class="text-4xl font-bold text-white mb-4">Configuration</h1>
            <p class="text-xl text-slate-400 mb-8">
              Complete reference for CoreVPN server configuration. All options can be set
              via config file, environment variables, or command-line flags.
            </p>

            <h2 id="config-file">Configuration File</h2>
            <p>
              The primary configuration file is <code>/etc/corevpn/config.toml</code>.
              Here's a complete example with all options:
            </p>

            <app-code-block
              language="toml"
              [code]="configToml" />

            <h2 id="environment-variables">Environment Variables</h2>
            <p>
              All configuration options can be set via environment variables. The naming
              convention is <code>COREVPN_SECTION_KEY</code>:
            </p>

            <div class="card my-6 overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Environment Variable</th>
                    <th>Config Key</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  @for (env of envVars; track env.name) {
                    <tr>
                      <td><code>{{ env.name }}</code></td>
                      <td><code>{{ env.config }}</code></td>
                      <td class="text-slate-400">{{ env.description }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <h2 id="server-settings">Server Settings</h2>

            <h3 id="network">Network Configuration</h3>
            <p>
              Configure the VPN network settings including the tunnel subnet and DNS servers.
            </p>

            <app-code-block
              language="toml"
              [code]="networkConfig" />

            <app-callout type="info" title="Subnet Selection">
              Choose a subnet that doesn't conflict with your existing network infrastructure.
              Common choices are 10.8.0.0/24, 172.16.0.0/24, or 192.168.100.0/24.
            </app-callout>

            <h3 id="security">Security Settings</h3>
            <p>
              CoreVPN uses modern TLS and encryption by default. Customize these settings
              for your security requirements:
            </p>

            <app-code-block
              language="toml"
              [code]="securityConfig" />

            <h2 id="authentication">Authentication</h2>
            <p>
              CoreVPN supports multiple authentication methods. You can combine certificate-based
              authentication with OAuth2 or SAML for enhanced security.
            </p>

            <h3 id="oauth2">OAuth2 / OIDC</h3>
            <app-code-block
              language="toml"
              [code]="oauth2Config" />

            <h3 id="saml">SAML</h3>
            <app-code-block
              language="toml"
              [code]="samlConfig" />

            <h2 id="logging">Logging Configuration</h2>
            <p>
              Control how connection events are logged. See the
              <a routerLink="/configuration/ghost-mode">Ghost Mode</a> documentation for
              privacy-focused configurations.
            </p>

            <app-code-block
              language="toml"
              [code]="loggingConfig" />

            <div class="grid sm:grid-cols-2 gap-4 mt-12">
              <a routerLink="/configuration/ghost-mode" class="card card-hover group">
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  👻 Ghost Mode
                </h3>
                <p class="text-sm text-slate-400">
                  Zero-logging configuration for maximum privacy.
                </p>
              </a>
              <a routerLink="/configuration/authentication" class="card card-hover group">
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  🔐 Authentication
                </h3>
                <p class="text-sm text-slate-400">
                  Detailed OAuth2/SAML integration guide.
                </p>
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
})
export class ConfigurationComponent {
  sidebarSections: SidebarSection[] = [
    {
      title: 'Configuration',
      items: [
        { label: 'Overview', path: '/configuration', icon: '⚙️' },
        { label: 'Server Settings', path: '/configuration/server', icon: '🖥️' },
        { label: 'Network', path: '/configuration/network', icon: '🌐' },
        { label: 'Security', path: '/configuration/security', icon: '🔒' },
      ],
    },
    {
      title: 'Authentication',
      items: [
        { label: 'Overview', path: '/configuration/authentication', icon: '🔐' },
        { label: 'OAuth2 / OIDC', path: '/configuration/oauth2', icon: '🪪' },
        { label: 'SAML', path: '/configuration/saml', icon: '📜' },
        { label: 'Certificates', path: '/configuration/certificates', icon: '📄' },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { label: 'Ghost Mode', path: '/configuration/ghost-mode', icon: '👻', badge: 'NEW' },
        { label: 'Logging', path: '/configuration/logging', icon: '📝' },
        { label: 'Anonymization', path: '/configuration/anonymization', icon: '🎭' },
      ],
    },
  ];

  envVars = [
    { name: 'COREVPN_LISTEN_ADDRESS', config: 'server.listen_address', description: 'VPN server bind address' },
    { name: 'COREVPN_LISTEN_PORT', config: 'server.listen_port', description: 'VPN server port' },
    { name: 'COREVPN_GHOST_MODE', config: 'logging.mode', description: 'Enable ghost mode (true/false)' },
    { name: 'COREVPN_LOG_LEVEL', config: 'server.log_level', description: 'Log level (debug/info/warn/error)' },
    { name: 'COREVPN_TLS_CERT', config: 'security.tls_cert', description: 'Path to TLS certificate' },
    { name: 'COREVPN_TLS_KEY', config: 'security.tls_key', description: 'Path to TLS private key' },
    { name: 'COREVPN_ADMIN_PASSWORD', config: 'admin.password', description: 'Admin interface password' },
  ];

  configToml = `# CoreVPN Server Configuration

[server]
listen_address = "0.0.0.0"
listen_port = 1194
protocol = "udp"
log_level = "info"

[network]
subnet = "10.8.0.0/24"
dns_servers = ["1.1.1.1", "8.8.8.8"]
push_routes = ["0.0.0.0/0"]

[security]
tls_version = "1.3"
cipher = "AES-256-GCM"
auth = "SHA512"
tls_cert = "/etc/corevpn/server.crt"
tls_key = "/etc/corevpn/server.key"
ca_cert = "/etc/corevpn/ca.crt"
dh_params = "/etc/corevpn/dh.pem"

[admin]
enabled = true
listen_address = "0.0.0.0"
listen_port = 8443
username = "admin"
password_hash = "$argon2id$..."

[logging]
mode = "none"  # none, memory, file, database`;

  networkConfig = `[network]
# VPN tunnel subnet
subnet = "10.8.0.0/24"

# DNS servers pushed to clients
dns_servers = ["1.1.1.1", "1.0.0.1"]

# Routes to push to clients
# Use ["0.0.0.0/0"] for full tunnel
push_routes = [
  "10.0.0.0/8",
  "172.16.0.0/12",
  "192.168.0.0/16"
]

# Enable IPv6
ipv6_enabled = false
ipv6_subnet = "fd00::/64"`;

  securityConfig = `[security]
# TLS version (1.2 or 1.3)
tls_version = "1.3"

# Data channel cipher
cipher = "AES-256-GCM"

# HMAC authentication
auth = "SHA512"

# Certificate paths
tls_cert = "/etc/corevpn/server.crt"
tls_key = "/etc/corevpn/server.key"
ca_cert = "/etc/corevpn/ca.crt"

# Diffie-Hellman parameters (optional for TLS 1.3)
dh_params = "/etc/corevpn/dh.pem"

# Client certificate verification
verify_client_cert = true

# Certificate revocation list
crl_file = "/etc/corevpn/crl.pem"`;

  oauth2Config = `[auth.oauth2]
enabled = true
provider = "oidc"

# OIDC Configuration
issuer_url = "https://auth.example.com"
client_id = "corevpn"
client_secret = "your-client-secret"

# Scopes to request
scopes = ["openid", "profile", "email"]

# Redirect URI for callback
redirect_uri = "https://vpn.example.com/auth/callback"

# Username claim from token
username_claim = "preferred_username"

# Group claim for authorization
groups_claim = "groups"
allowed_groups = ["vpn-users"]`;

  samlConfig = `[auth.saml]
enabled = true

# Identity Provider metadata URL
idp_metadata_url = "https://idp.example.com/metadata"

# Or provide metadata directly
# idp_metadata_file = "/etc/corevpn/idp-metadata.xml"

# Service Provider settings
sp_entity_id = "https://vpn.example.com/saml"
sp_acs_url = "https://vpn.example.com/saml/acs"

# Certificate for signing requests
sp_cert = "/etc/corevpn/saml.crt"
sp_key = "/etc/corevpn/saml.key"

# Attribute mapping
username_attribute = "uid"
groups_attribute = "memberOf"`;

  loggingConfig = `[logging]
# Logging mode: none, memory, file, database
mode = "file"

# File logging settings
[logging.file]
path = "/var/log/corevpn/connections.log"
rotation = "daily"
max_files = 30
format = "json"

# Database logging settings
[logging.database]
url = "sqlite:///var/lib/corevpn/logs.db"
retention_days = 90

# Anonymization settings
[logging.anonymization]
hash_ips = true
hash_usernames = false
round_timestamps = "1h"

# Events to log
[logging.events]
connections = true
auth_attempts = true
data_transfer = false
errors = true`;
}
