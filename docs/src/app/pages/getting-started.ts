import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent, SidebarSection } from '../components/sidebar';
import { CodeBlockComponent } from '../components/code-block';
import { CalloutComponent } from '../components/callout';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-getting-started',
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
            <nav aria-label="Breadcrumb" class="mb-6">
              <ol class="flex items-center gap-2 text-sm text-slate-400" itemscope itemtype="https://schema.org/BreadcrumbList">
                <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                  <a routerLink="/" itemprop="item" class="hover:text-white">
                    <span itemprop="name">Home</span>
                  </a>
                  <meta itemprop="position" content="1" />
                </li>
                <li aria-hidden="true">/</li>
                <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                  <span itemprop="name" class="text-white">Getting Started</span>
                  <meta itemprop="position" content="2" />
                </li>
              </ol>
            </nav>

            <article itemscope itemtype="https://schema.org/TechArticle">
              <header>
                <h1 class="text-4xl font-bold text-white mb-4" itemprop="headline">Getting Started</h1>
                <p class="text-xl text-slate-400 mb-8" itemprop="description">
                  Get CoreVPN up and running in minutes. Choose your deployment method and follow the guide.
                </p>
                <meta itemprop="datePublished" content="2026-01-02" />
                <meta itemprop="dateModified" content="2026-01-02" />
              </header>

              <app-callout type="info" title="Prerequisites">
                Before you begin, ensure you have Docker installed and running.
                For Kubernetes deployments, you'll need kubectl and Helm configured.
              </app-callout>

              <section id="quick-start" aria-labelledby="quick-start-heading">
                <h2 id="quick-start-heading">Quick Start with Docker</h2>
                <p>
                  The fastest way to get started is with Docker. This single command will start
                  CoreVPN with sensible defaults:
                </p>

                <app-code-block
                  language="bash"
                  [code]="dockerQuickStart" />

                <p>
                  This starts the VPN server on port 1194 (UDP) and the admin interface on port 8443.
                  Ghost mode is enabled by default for maximum privacy.
                </p>
              </section>

              <section id="docker-compose" aria-labelledby="docker-compose-heading">
                <h2 id="docker-compose-heading">Docker Compose</h2>
                <p>
                  For persistent configuration and easier management, use Docker Compose:
                </p>

                <app-code-block
                  language="yaml"
                  [code]="dockerCompose" />

                <p>Start the services:</p>
                <app-code-block
                  language="bash"
                  [code]="'docker compose up -d'" />
              </section>

              <section id="access-admin" aria-labelledby="access-admin-heading">
                <h2 id="access-admin-heading">Access the Admin Interface</h2>
                <p>
                  Once running, access the admin interface at
                  <code>https://localhost:8443</code>. The default credentials are:
                </p>

                <div class="card my-6">
                  <table class="w-full">
                    <tbody>
                      <tr>
                        <td class="font-medium text-slate-300">Username</td>
                        <td><code>admin</code></td>
                      </tr>
                      <tr>
                        <td class="font-medium text-slate-300">Password</td>
                        <td><code>admin</code> (change immediately!)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <app-callout type="warning" title="Security Notice">
                  Change the default admin credentials immediately after first login.
                  In production, configure proper authentication via OAuth2 or SAML.
                </app-callout>
              </section>

              <section id="generate-client" aria-labelledby="generate-client-heading">
                <h2 id="generate-client-heading">Generate Client Configuration</h2>
                <p>
                  From the admin interface, navigate to <strong>Clients</strong> and click
                  <strong>Quick Generate</strong>. This will create a new client and provide
                  the <code>.ovpn</code> configuration file for download.
                </p>

                <p>
                  Alternatively, use the CLI:
                </p>

                <app-code-block
                  language="bash"
                  [code]="cliGenerate" />
              </section>

              <section id="connect" aria-labelledby="connect-heading">
                <h2 id="connect-heading">Connect with OpenVPN</h2>
                <p>
                  Use any OpenVPN-compatible client to connect. Popular options include:
                </p>

                <ul>
                  <li><strong>Windows/macOS/Linux:</strong> OpenVPN Connect or official OpenVPN client</li>
                  <li><strong>iOS:</strong> OpenVPN Connect from App Store</li>
                  <li><strong>Android:</strong> OpenVPN for Android from Play Store</li>
                </ul>

                <app-code-block
                  language="bash"
                  [code]="openvpnConnect" />
              </section>

              <section id="next-steps" aria-labelledby="next-steps-heading">
                <h2 id="next-steps-heading">Next Steps</h2>
                <div class="grid sm:grid-cols-2 gap-4 mt-6">
                  <a routerLink="/configuration" class="card card-hover group">
                    <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      Configuration
                    </h3>
                    <p class="text-sm text-slate-400">
                      Deep dive into server configuration options and authentication.
                    </p>
                  </a>
                  <a routerLink="/configuration/ghost-mode" class="card card-hover group">
                    <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      Ghost Mode
                    </h3>
                    <p class="text-sm text-slate-400">
                      Learn about zero-logging and privacy features.
                    </p>
                  </a>
                  <a routerLink="/deployment/kubernetes" class="card card-hover group">
                    <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      Kubernetes Deployment
                    </h3>
                    <p class="text-sm text-slate-400">
                      Deploy CoreVPN on Kubernetes with Helm.
                    </p>
                  </a>
                  <a routerLink="/api" class="card card-hover group">
                    <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      API Reference
                    </h3>
                    <p class="text-sm text-slate-400">
                      Explore the REST and management APIs.
                    </p>
                  </a>
                </div>
              </section>
            </article>
          </main>
        </div>
      </div>
    </div>
  `,
})
export class GettingStartedComponent implements OnInit {
  private readonly seo = inject(SeoService);

  sidebarSections: SidebarSection[] = [
    {
      title: 'Getting Started',
      items: [
        { label: 'Quick Start', path: '/getting-started', icon: '🚀' },
        { label: 'Installation', path: '/getting-started/installation', icon: '📦' },
        { label: 'First Connection', path: '/getting-started/first-connection', icon: '🔌' },
      ],
    },
    {
      title: 'Basics',
      items: [
        { label: 'Architecture', path: '/getting-started/architecture', icon: '🏗️' },
        { label: 'Client Setup', path: '/getting-started/client-setup', icon: '💻' },
        { label: 'Troubleshooting', path: '/getting-started/troubleshooting', icon: '🔧' },
      ],
    },
  ];

  dockerQuickStart = `docker run -d --name corevpn \\
  -p 1194:1194/udp \\
  -p 8443:8443 \\
  -e COREVPN_GHOST_MODE=true \\
  ghcr.io/pegasusheavy/corevpn:latest`;

  dockerCompose = `version: '3.8'

services:
  corevpn:
    image: ghcr.io/pegasusheavy/corevpn:latest
    container_name: corevpn
    restart: unless-stopped
    ports:
      - "1194:1194/udp"
      - "8443:8443"
    volumes:
      - ./config:/etc/corevpn
      - ./data:/var/lib/corevpn
    environment:
      - COREVPN_GHOST_MODE=true
      - COREVPN_LOG_LEVEL=info
    cap_add:
      - NET_ADMIN
    sysctls:
      - net.ipv4.ip_forward=1`;

  cliGenerate = `# Generate a new client configuration
docker exec corevpn corevpn-cli client create --name "my-laptop"

# The .ovpn file will be output to stdout
# Or save directly to a file:
docker exec corevpn corevpn-cli client create --name "my-laptop" > my-laptop.ovpn`;

  openvpnConnect = `# Linux
sudo openvpn --config my-laptop.ovpn

# macOS (with Tunnelblick or OpenVPN Connect)
open my-laptop.ovpn`;

  ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Getting Started',
      description:
        'Get CoreVPN up and running in minutes. Quick start guide for Docker deployment, Docker Compose setup, and connecting your first VPN client.',
      keywords: [
        'CoreVPN',
        'getting started',
        'installation',
        'Docker',
        'quick start',
        'VPN setup',
        'OpenVPN',
      ],
      canonicalUrl: 'https://docs.corevpn.dev/getting-started',
      ogType: 'article',
      section: 'Getting Started',
    });

    this.seo.addBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Getting Started', url: '/getting-started' },
    ]);

    this.seo.addHowToSchema(
      'How to Deploy CoreVPN with Docker',
      'Learn how to deploy CoreVPN VPN server using Docker in just a few steps.',
      [
        {
          name: 'Run the Docker container',
          text: 'Run: docker run -d --name corevpn -p 1194:1194/udp -p 8443:8443 -e COREVPN_GHOST_MODE=true ghcr.io/pegasusheavy/corevpn:latest',
        },
        {
          name: 'Access the admin interface',
          text: 'Open https://localhost:8443 in your browser and login with admin/admin',
        },
        {
          name: 'Generate client configuration',
          text: 'Navigate to Clients > Quick Generate to create a new VPN client and download the .ovpn file',
        },
        {
          name: 'Connect with OpenVPN client',
          text: 'Import the .ovpn file into your OpenVPN client and connect to the VPN server',
        },
      ],
      'PT5M'
    );

    this.seo.addTechArticleSchema(
      'Getting Started with CoreVPN',
      'Complete guide to deploying and configuring CoreVPN VPN server with Docker.',
      '2026-01-02'
    );
  }
}
