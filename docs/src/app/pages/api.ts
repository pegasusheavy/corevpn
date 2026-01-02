import { Component, OnInit, inject } from '@angular/core';
import { SidebarComponent, SidebarSection } from '../components/sidebar';
import { CodeBlockComponent } from '../components/code-block';
import { CalloutComponent } from '../components/callout';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-api',
  standalone: true,
  imports: [SidebarComponent, CodeBlockComponent, CalloutComponent],
  template: `
    <div class="min-h-screen pt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex gap-12">
          <!-- Sidebar -->
          <app-sidebar [sections]="sidebarSections" />

          <!-- Content -->
          <main class="flex-1 min-w-0 prose-docs">
            <h1 class="text-4xl font-bold text-white mb-4">API Reference</h1>
            <p class="text-xl text-slate-400 mb-8">
              CoreVPN provides a REST API for programmatic management of the VPN server,
              clients, and configuration.
            </p>

            <app-callout type="info" title="Authentication">
              All API endpoints require authentication. Use HTTP Basic Auth or Bearer tokens
              obtained from the OAuth2 flow.
            </app-callout>

            <h2 id="overview">API Overview</h2>
            <p>
              The API is available at <code>https://your-server:8443/api/v1/</code>.
              All responses are JSON formatted.
            </p>

            <div class="card my-6">
              <table>
                <thead>
                  <tr>
                    <th>Base URL</th>
                    <th>Authentication</th>
                    <th>Content-Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>/api/v1</code></td>
                    <td>Basic Auth / Bearer Token</td>
                    <td><code>application/json</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 id="health">Health Check</h2>
            <p>
              Check server health and status. This endpoint does not require authentication.
            </p>

            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-green">GET</span>
              <code>/api/health</code>
            </div>

            <app-code-block
              language="bash"
              [code]="healthCheck" />

            <h3>Response</h3>
            <app-code-block
              language="json"
              [code]="healthResponse" />

            <h2 id="status">Server Status</h2>
            <p>Get detailed server status including configuration and active connections.</p>

            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-green">GET</span>
              <code>/api/v1/status</code>
            </div>

            <app-code-block
              language="bash"
              [code]="statusCheck" />

            <h3>Response</h3>
            <app-code-block
              language="json"
              [code]="statusResponse" />

            <h2 id="clients">Client Management</h2>

            <h3 id="list-clients">List Clients</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-green">GET</span>
              <code>/api/v1/clients</code>
            </div>

            <app-code-block
              language="bash"
              [code]="listClients" />

            <h3 id="create-client">Create Client</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-cyan">POST</span>
              <code>/api/v1/clients</code>
            </div>

            <app-code-block
              language="bash"
              [code]="createClient" />

            <h3>Request Body</h3>
            <app-code-block
              language="json"
              [code]="createClientBody" />

            <h3>Response</h3>
            <app-code-block
              language="json"
              [code]="createClientResponse" />

            <h3 id="get-client-config">Get Client Configuration</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-green">GET</span>
              <code>/api/v1/clients/:id/config</code>
            </div>

            <p>
              Returns the <code>.ovpn</code> configuration file for the client.
            </p>

            <app-code-block
              language="bash"
              [code]="getClientConfig" />

            <h3 id="revoke-client">Revoke Client</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-red">DELETE</span>
              <code>/api/v1/clients/:id</code>
            </div>

            <app-code-block
              language="bash"
              [code]="revokeClient" />

            <h2 id="connections">Active Connections</h2>

            <h3>List Active Connections</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-green">GET</span>
              <code>/api/v1/connections</code>
            </div>

            <app-callout type="ghost" title="Ghost Mode">
              When Ghost Mode is enabled, this endpoint returns an empty array
              as connection data is not tracked.
            </app-callout>

            <app-code-block
              language="json"
              [code]="connectionsResponse" />

            <h3>Disconnect Client</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-red">POST</span>
              <code>/api/v1/connections/:id/disconnect</code>
            </div>

            <h2 id="configuration">Configuration</h2>

            <h3>Get Current Configuration</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-green">GET</span>
              <code>/api/v1/config</code>
            </div>

            <h3>Update Configuration</h3>
            <div class="flex items-center gap-2 mb-3">
              <span class="badge badge-purple">PATCH</span>
              <code>/api/v1/config</code>
            </div>

            <app-callout type="warning" title="Server Restart">
              Some configuration changes require a server restart to take effect.
              The response will indicate if a restart is needed.
            </app-callout>

            <h2 id="errors">Error Responses</h2>
            <p>
              All error responses follow a consistent format:
            </p>

            <app-code-block
              language="json"
              [code]="errorResponse" />

            <div class="card my-6">
              <table>
                <thead>
                  <tr>
                    <th>Status Code</th>
                    <th>Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  @for (code of statusCodes; track code.code) {
                    <tr>
                      <td><code>{{ code.code }}</code></td>
                      <td class="text-slate-400">{{ code.meaning }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
})
export class ApiComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMeta({
      title: 'API Reference',
      description:
        'CoreVPN REST API documentation. Manage VPN clients, connections, and configuration programmatically with full API reference and examples.',
      keywords: [
        'CoreVPN API',
        'REST API',
        'VPN API',
        'client management',
        'API reference',
        'JSON API',
      ],
      canonicalUrl: 'https://docs.corevpn.dev/api',
      ogType: 'article',
      section: 'API',
    });

    this.seo.addBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'API Reference', url: '/api' },
    ]);
  }

  sidebarSections: SidebarSection[] = [
    {
      title: 'API Reference',
      items: [
        { label: 'Overview', path: '/api', icon: '📖' },
        { label: 'Authentication', path: '/api/authentication', icon: '🔐' },
        { label: 'Rate Limits', path: '/api/rate-limits', icon: '⏱️' },
      ],
    },
    {
      title: 'Endpoints',
      items: [
        { label: 'Health', path: '/api/health', icon: '❤️' },
        { label: 'Status', path: '/api/status', icon: '📊' },
        { label: 'Clients', path: '/api/clients', icon: '👥' },
        { label: 'Connections', path: '/api/connections', icon: '🔌' },
        { label: 'Configuration', path: '/api/configuration', icon: '⚙️' },
      ],
    },
  ];

  statusCodes = [
    { code: '200', meaning: 'Success' },
    { code: '201', meaning: 'Created' },
    { code: '400', meaning: 'Bad Request - Invalid parameters' },
    { code: '401', meaning: 'Unauthorized - Authentication required' },
    { code: '403', meaning: 'Forbidden - Insufficient permissions' },
    { code: '404', meaning: 'Not Found - Resource does not exist' },
    { code: '429', meaning: 'Too Many Requests - Rate limited' },
    { code: '500', meaning: 'Internal Server Error' },
  ];

  healthCheck = `curl https://localhost:8443/api/health`;

  healthResponse = `{
  "status": "healthy",
  "version": "0.1.0",
  "uptime_seconds": 86400
}`;

  statusCheck = `curl -u admin:password https://localhost:8443/api/v1/status`;

  statusResponse = `{
  "version": "0.1.0",
  "uptime_seconds": 86400,
  "active_connections": 42,
  "total_clients": 150,
  "bytes_in": 1073741824,
  "bytes_out": 2147483648,
  "logging": {
    "mode": "none",
    "ghost_mode": true
  },
  "network": {
    "subnet": "10.8.0.0/24",
    "available_ips": 210
  }
}`;

  listClients = `curl -u admin:password https://localhost:8443/api/v1/clients`;

  createClient = `curl -X POST -u admin:password \\
  -H "Content-Type: application/json" \\
  -d '{"name": "my-laptop"}' \\
  https://localhost:8443/api/v1/clients`;

  createClientBody = `{
  "name": "my-laptop",
  "description": "Personal laptop",
  "expires_at": "2027-01-01T00:00:00Z",
  "allowed_ips": ["10.8.0.0/24"],
  "dns_servers": ["1.1.1.1"]
}`;

  createClientResponse = `{
  "id": "client_abc123",
  "name": "my-laptop",
  "created_at": "2026-01-02T10:00:00Z",
  "expires_at": "2027-01-01T00:00:00Z",
  "status": "active",
  "config_url": "/api/v1/clients/client_abc123/config"
}`;

  getClientConfig = `# Download .ovpn file
curl -u admin:password \\
  -o my-laptop.ovpn \\
  https://localhost:8443/api/v1/clients/client_abc123/config`;

  revokeClient = `curl -X DELETE -u admin:password \\
  https://localhost:8443/api/v1/clients/client_abc123`;

  connectionsResponse = `{
  "connections": [
    {
      "id": "conn_xyz789",
      "client_id": "client_abc123",
      "client_name": "my-laptop",
      "connected_at": "2026-01-02T09:30:00Z",
      "virtual_ip": "10.8.0.10",
      "bytes_in": 10485760,
      "bytes_out": 52428800
    }
  ],
  "total": 1
}`;

  errorResponse = `{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Client name is required",
    "details": {
      "field": "name",
      "constraint": "required"
    }
  }
}`;
}
