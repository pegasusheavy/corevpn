import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent, SidebarSection } from '../components/sidebar';
import { CodeBlockComponent } from '../components/code-block';
import { CalloutComponent } from '../components/callout';

@Component({
  selector: 'app-ghost-mode',
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
            <div class="flex items-center gap-4 mb-4">
              <h1 class="text-4xl font-bold text-white">Ghost Mode</h1>
              <span class="badge badge-purple">Privacy</span>
            </div>
            <p class="text-xl text-slate-400 mb-8">
              When privacy is paramount, Ghost Mode ensures absolutely zero connection logging.
              No files, no database, no memory traces.
            </p>

            <app-callout type="ghost" title="Maximum Privacy">
              Ghost Mode implements the NullConnectionLogger, which discards all connection
              events immediately. There is no way to recover connection history when this
              mode is active.
            </app-callout>

            <h2 id="overview">What is Ghost Mode?</h2>
            <p>
              Ghost Mode is CoreVPN's zero-logging feature. When enabled, the server uses
              a <code>NullConnectionLogger</code> that:
            </p>
            <ul>
              <li>Discards all connection events immediately</li>
              <li>Maintains no in-memory connection history</li>
              <li>Writes nothing to disk or database</li>
              <li>Provides no audit trail whatsoever</li>
            </ul>

            <p>
              This is ideal for privacy-conscious deployments, whistleblower protection,
              and scenarios where connection metadata could be legally compelled.
            </p>

            <h2 id="enable">Enabling Ghost Mode</h2>

            <h3>Method 1: CLI Flag</h3>
            <p>The simplest way to enable Ghost Mode is with the <code>--ghost</code> flag:</p>
            <app-code-block
              language="bash"
              [code]="'corevpn-server run --ghost'" />

            <h3>Method 2: Environment Variable</h3>
            <app-code-block
              language="bash"
              [code]="'export COREVPN_GHOST_MODE=true\ncorevpn-server run'" />

            <h3>Method 3: Configuration File</h3>
            <app-code-block
              language="toml"
              [code]="ghostConfig" />

            <h3>Method 4: Docker</h3>
            <app-code-block
              language="bash"
              [code]="dockerGhost" />

            <h3>Method 5: Kubernetes/Helm</h3>
            <app-code-block
              language="bash"
              [code]="k8sGhost" />

            <h2 id="logging-modes">Logging Modes Comparison</h2>
            <p>
              CoreVPN supports four logging modes. Choose based on your privacy and
              compliance requirements:
            </p>

            <div class="card my-6 overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th>Storage</th>
                    <th>Persistence</th>
                    <th>Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  @for (mode of loggingModes; track mode.name) {
                    <tr>
                      <td>
                        <code>{{ mode.name }}</code>
                        @if (mode.ghost) {
                          <span class="ml-2 text-purple-400">👻</span>
                        }
                      </td>
                      <td class="text-slate-400">{{ mode.storage }}</td>
                      <td>
                        <span [class]="mode.persistent ? 'text-amber-400' : 'text-emerald-400'">
                          {{ mode.persistence }}
                        </span>
                      </td>
                      <td class="text-slate-400">{{ mode.useCase }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <h2 id="anonymization">Alternative: Anonymized Logging</h2>
            <p>
              If you need some logging for operational purposes but want to protect
              user privacy, consider using anonymized logging instead of full Ghost Mode:
            </p>

            <app-code-block
              language="toml"
              [code]="anonymizedConfig" />

            <h3>Anonymization Features</h3>
            <ul>
              <li><strong>IP Hashing:</strong> Client IPs are hashed with a daily-rotating salt</li>
              <li><strong>Username Hashing:</strong> Usernames become irreversible hashes</li>
              <li><strong>Timestamp Rounding:</strong> Connection times rounded to reduce precision</li>
            </ul>

            <app-callout type="info" title="Legal Considerations">
              Ghost Mode may not be appropriate for all deployments. Some jurisdictions
              require VPN operators to maintain connection logs. Consult with legal
              counsel regarding your logging obligations.
            </app-callout>

            <h2 id="verification">Verifying Ghost Mode</h2>
            <p>
              To verify Ghost Mode is active, check the server logs at startup:
            </p>

            <app-code-block
              language="text"
              [code]="verifyOutput" />

            <p>
              You can also use the admin API to check the current logging configuration:
            </p>

            <app-code-block
              language="bash"
              [code]="apiCheck" />

            <h2 id="security">Security Considerations</h2>

            <app-callout type="warning" title="Memory Forensics">
              While Ghost Mode prevents persistent logging, active connections still
              exist in memory. On server shutdown, memory is securely wiped, but be
              aware that memory forensics during operation could reveal active sessions.
            </app-callout>

            <p>For maximum security in addition to Ghost Mode:</p>
            <ul>
              <li>Use encrypted memory (TRESOR, encrypted swap)</li>
              <li>Deploy on trusted hardware with TPM</li>
              <li>Disable core dumps: <code>ulimit -c 0</code></li>
              <li>Use secure deletion tools on any temporary files</li>
              <li>Consider running in a TEE (Trusted Execution Environment)</li>
            </ul>

            <div class="grid sm:grid-cols-2 gap-4 mt-12">
              <a routerLink="/configuration/logging" class="card card-hover group">
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  📝 Logging Options
                </h3>
                <p class="text-sm text-slate-400">
                  Full documentation on all logging backends.
                </p>
              </a>
              <a routerLink="/configuration/anonymization" class="card card-hover group">
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  🎭 Anonymization
                </h3>
                <p class="text-sm text-slate-400">
                  Privacy-preserving logging techniques.
                </p>
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
})
export class GhostModeComponent {
  sidebarSections: SidebarSection[] = [
    {
      title: 'Privacy',
      items: [
        { label: 'Ghost Mode', path: '/configuration/ghost-mode', icon: '👻', badge: 'NEW' },
        { label: 'Logging', path: '/configuration/logging', icon: '📝' },
        { label: 'Anonymization', path: '/configuration/anonymization', icon: '🎭' },
      ],
    },
    {
      title: 'Related',
      items: [
        { label: 'Configuration', path: '/configuration', icon: '⚙️' },
        { label: 'Security', path: '/configuration/security', icon: '🔒' },
      ],
    },
  ];

  loggingModes = [
    {
      name: 'none',
      storage: 'None',
      persistence: 'Nothing stored',
      persistent: false,
      useCase: 'Maximum privacy, no audit trail',
      ghost: true,
    },
    {
      name: 'memory',
      storage: 'RAM only',
      persistence: 'Lost on restart',
      persistent: false,
      useCase: 'Volatile debugging, no disk writes',
      ghost: false,
    },
    {
      name: 'file',
      storage: 'Log files',
      persistence: 'Persistent',
      persistent: true,
      useCase: 'Standard deployments, log rotation',
      ghost: false,
    },
    {
      name: 'database',
      storage: 'SQLite/PostgreSQL',
      persistence: 'Persistent',
      persistent: true,
      useCase: 'Queryable audit logs, compliance',
      ghost: false,
    },
  ];

  ghostConfig = `[logging]
# Ghost Mode - no logging whatsoever
mode = "none"`;

  dockerGhost = `docker run -d --name corevpn \\
  -p 1194:1194/udp \\
  -e COREVPN_GHOST_MODE=true \\
  ghcr.io/pegasusheavy/corevpn:latest`;

  k8sGhost = `# Using the ghost mode values file
helm install corevpn ./deploy/helm/corevpn \\
  -f ./deploy/helm/corevpn/values-ghost.yaml

# Or set explicitly
helm install corevpn ./deploy/helm/corevpn \\
  --set config.logging.mode=none \\
  --set ghostMode=true`;

  anonymizedConfig = `[logging]
mode = "file"

[logging.file]
path = "/var/log/corevpn/connections.log"
rotation = "daily"
max_files = 7

[logging.anonymization]
# Hash client IPs with daily-rotating salt
hash_ips = true

# Hash usernames (irreversible)
hash_usernames = true

# Round timestamps to reduce precision
# Options: 1m, 5m, 15m, 30m, 1h, 6h, 12h, 1d
round_timestamps = "1h"

[logging.events]
# Only log what you need
connections = true
auth_attempts = true
data_transfer = false  # Don't log bandwidth
errors = true`;

  verifyOutput = `[2026-01-02T10:00:00Z INFO  corevpn_server] Starting CoreVPN Server v0.1.0
[2026-01-02T10:00:00Z INFO  corevpn_server] 👻 Ghost mode enabled - no connection logging
[2026-01-02T10:00:00Z INFO  corevpn_server] Logger: NullConnectionLogger
[2026-01-02T10:00:00Z INFO  corevpn_server] Listening on 0.0.0.0:1194 (UDP)`;

  apiCheck = `curl -s https://localhost:8443/api/v1/status | jq '.logging'

# Response:
{
  "mode": "none",
  "ghost_mode": true,
  "anonymization": null
}`;
}
