import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent, SidebarSection } from '../components/sidebar';
import { CodeBlockComponent } from '../components/code-block';
import { CalloutComponent } from '../components/callout';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-deployment',
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
            <h1 class="text-4xl font-bold text-white mb-4">Deployment</h1>
            <p class="text-xl text-slate-400 mb-8">
              Deploy CoreVPN anywhere—from single containers to enterprise Kubernetes clusters.
              Choose the deployment method that fits your infrastructure.
            </p>

            <div class="grid sm:grid-cols-3 gap-4 mb-12">
              @for (option of deploymentOptions; track option.title) {
                <a [routerLink]="option.link" class="card card-hover group text-center">
                  <div class="text-4xl mb-3">{{ option.icon }}</div>
                  <h3 class="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                    {{ option.title }}
                  </h3>
                  <p class="text-sm text-slate-500 mt-1">{{ option.description }}</p>
                </a>
              }
            </div>

            <h2 id="docker">Docker Deployment</h2>
            <p>
              The fastest way to deploy CoreVPN. Our container images are based on
              hardened Alpine Linux with minimal attack surface.
            </p>

            <h3>Quick Start</h3>
            <app-code-block
              language="bash"
              [code]="dockerQuick" />

            <h3>Docker Compose (Recommended)</h3>
            <p>
              For production deployments, use Docker Compose for easier management:
            </p>
            <app-code-block
              language="yaml"
              [code]="dockerCompose" />

            <app-callout type="info" title="Persistent Data">
              Mount volumes for <code>/etc/corevpn</code> (config) and
              <code>/var/lib/corevpn</code> (data) to preserve configuration across
              container restarts.
            </app-callout>

            <h2 id="kubernetes">Kubernetes Deployment</h2>
            <p>
              CoreVPN provides both raw Kubernetes manifests and a Helm chart for
              production deployments.
            </p>

            <h3>Using Helm (Recommended)</h3>
            <app-code-block
              language="bash"
              [code]="helmInstall" />

            <h3>Using Kustomize</h3>
            <app-code-block
              language="bash"
              [code]="kustomizeInstall" />

            <h3>Helm Values</h3>
            <p>Key configuration options for the Helm chart:</p>
            <app-code-block
              language="yaml"
              [code]="helmValues" />

            <h2 id="packages">System Packages</h2>
            <p>
              Native packages are available for Debian/Ubuntu (.deb) and
              RHEL/CentOS/Fedora (.rpm) with systemd integration.
            </p>

            <h3>Debian/Ubuntu</h3>
            <app-code-block
              language="bash"
              [code]="debInstall" />

            <h3>RHEL/CentOS/Fedora</h3>
            <app-code-block
              language="bash"
              [code]="rpmInstall" />

            <h3>Systemd Service</h3>
            <p>After installation, manage the service with systemd:</p>
            <app-code-block
              language="bash"
              [code]="systemdCommands" />

            <h2 id="source">Building from Source</h2>
            <p>
              For custom deployments or development, build CoreVPN from source:
            </p>
            <app-code-block
              language="bash"
              [code]="buildSource" />

            <h2 id="production">Production Checklist</h2>
            <p>Before deploying to production, ensure you've addressed these items:</p>

            <div class="card my-6">
              <ul class="space-y-3">
                @for (item of productionChecklist; track item.title) {
                  <li class="flex items-start gap-3">
                    <span class="text-lg">{{ item.icon }}</span>
                    <div>
                      <strong class="text-white">{{ item.title }}</strong>
                      <p class="text-sm text-slate-400 mt-1">{{ item.description }}</p>
                    </div>
                  </li>
                }
              </ul>
            </div>

            <div class="grid sm:grid-cols-2 gap-4 mt-12">
              <a routerLink="/deployment/docker" class="card card-hover group">
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  🐳 Docker Guide
                </h3>
                <p class="text-sm text-slate-400">
                  Detailed Docker deployment instructions.
                </p>
              </a>
              <a routerLink="/deployment/kubernetes" class="card card-hover group">
                <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  ☸️ Kubernetes Guide
                </h3>
                <p class="text-sm text-slate-400">
                  Complete Kubernetes and Helm documentation.
                </p>
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
})
export class DeploymentComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Deployment Guide',
      description:
        'Deploy CoreVPN anywhere with Docker, Kubernetes, or native packages. Production-ready deployment guides with Helm charts, Docker Compose, and systemd.',
      keywords: [
        'CoreVPN deployment',
        'Docker VPN',
        'Kubernetes VPN',
        'Helm chart',
        'VPN server deployment',
        'systemd',
        'production VPN',
      ],
      canonicalUrl: 'https://pegasusheavy.github.io/corevpn/deployment',
      ogType: 'article',
      section: 'Deployment',
    });

    this.seo.addBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Deployment', url: '/deployment' },
    ]);

    this.seo.addHowToSchema(
      'How to Deploy CoreVPN on Kubernetes',
      'Production-grade Kubernetes deployment using Helm charts.',
      [
        { name: 'Add Helm repository', text: 'helm repo add corevpn https://charts.pegasusheavy.com && helm repo update' },
        { name: 'Install with Helm', text: 'helm install corevpn corevpn/corevpn -n corevpn --create-namespace' },
        { name: 'Configure values', text: 'Customize values.yaml for your environment including ghost mode, authentication, and resources' },
        { name: 'Verify deployment', text: 'kubectl get pods -n corevpn to verify all pods are running' },
      ],
      'PT10M'
    );
  }

  sidebarSections: SidebarSection[] = [
    {
      title: 'Deployment',
      items: [
        { label: 'Overview', path: '/deployment', icon: ['fas', 'rocket'] },
        { label: 'Docker', path: '/deployment/docker', icon: ['fab', 'docker'] },
        { label: 'Kubernetes', path: '/deployment/kubernetes', icon: ['fas', 'cube'] },
        { label: 'Packages', path: '/deployment/packages', icon: ['fas', 'cube'] },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Monitoring', path: '/deployment/monitoring', icon: ['fas', 'sliders'] },
        { label: 'Backup', path: '/deployment/backup', icon: ['fas', 'database'] },
        { label: 'Upgrades', path: '/deployment/upgrades', icon: ['fas', 'rocket'] },
        { label: 'High Availability', path: '/deployment/ha', icon: ['fas', 'server'] },
      ],
    },
  ];

  deploymentOptions = [
    { icon: '🐳', title: 'Docker', description: 'Single command', link: '/deployment/docker' },
    { icon: '☸️', title: 'Kubernetes', description: 'Helm charts', link: '/deployment/kubernetes' },
    { icon: '📦', title: 'Packages', description: 'DEB/RPM', link: '/deployment/packages' },
  ];

  dockerQuick = `docker run -d --name corevpn \\
  --cap-add NET_ADMIN \\
  --sysctl net.ipv4.ip_forward=1 \\
  -p 1194:1194/udp \\
  -p 8443:8443 \\
  -v corevpn-config:/etc/corevpn \\
  -v corevpn-data:/var/lib/corevpn \\
  -e COREVPN_GHOST_MODE=true \\
  ghcr.io/pegasusheavy/corevpn:latest`;

  dockerCompose = `version: '3.8'

services:
  corevpn:
    image: ghcr.io/pegasusheavy/corevpn:latest
    container_name: corevpn
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
    sysctls:
      - net.ipv4.ip_forward=1
    ports:
      - "1194:1194/udp"
      - "8443:8443"
    volumes:
      - ./config:/etc/corevpn
      - ./data:/var/lib/corevpn
    environment:
      - COREVPN_GHOST_MODE=true
      - COREVPN_LOG_LEVEL=info
    healthcheck:
      test: ["CMD", "corevpn-cli", "status"]
      interval: 30s
      timeout: 10s
      retries: 3`;

  helmInstall = `# Add the Helm repository (if published)
helm repo add corevpn https://charts.pegasusheavy.com
helm repo update

# Install with default values
helm install corevpn corevpn/corevpn -n corevpn --create-namespace

# Install with ghost mode
helm install corevpn corevpn/corevpn -n corevpn \\
  --create-namespace \\
  -f values-ghost.yaml

# Or from local chart
helm install corevpn ./deploy/helm/corevpn -n corevpn --create-namespace`;

  kustomizeInstall = `# Apply the base manifests
kubectl apply -k deploy/kubernetes/

# Or with kustomize overlays
kubectl apply -k deploy/kubernetes/overlays/production/`;

  helmValues = `# values.yaml
replicaCount: 2

image:
  repository: ghcr.io/pegasusheavy/corevpn
  tag: latest
  pullPolicy: Always

ghostMode: true

config:
  logging:
    mode: "none"
  server:
    port: 1194
    protocol: udp

service:
  type: LoadBalancer
  port: 1194

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: vpn.example.com
      paths:
        - path: /
          pathType: Prefix

resources:
  limits:
    cpu: 500m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi`;

  debInstall = `# Download the package
wget https://github.com/pegasusheavy/corevpn/releases/latest/download/corevpn_0.1.0_amd64.deb

# Install
sudo dpkg -i corevpn_0.1.0_amd64.deb

# Or with apt
sudo apt install ./corevpn_0.1.0_amd64.deb`;

  rpmInstall = `# Download the package
wget https://github.com/pegasusheavy/corevpn/releases/latest/download/corevpn-0.1.0-1.x86_64.rpm

# Install with dnf (Fedora/RHEL 8+)
sudo dnf install ./corevpn-0.1.0-1.x86_64.rpm

# Or with yum (RHEL 7/CentOS)
sudo yum install ./corevpn-0.1.0-1.x86_64.rpm`;

  systemdCommands = `# Enable and start the service
sudo systemctl enable --now corevpn-server

# Check status
sudo systemctl status corevpn-server

# View logs
sudo journalctl -u corevpn-server -f

# Restart after config changes
sudo systemctl restart corevpn-server`;

  buildSource = `# Clone the repository
git clone https://github.com/pegasusheavy/corevpn.git
cd corevpn

# Build release binaries
cargo build --release

# Install to /usr/local/bin
sudo install -m 755 target/release/corevpn-server /usr/local/bin/
sudo install -m 755 target/release/corevpn-cli /usr/local/bin/

# Copy default configuration
sudo mkdir -p /etc/corevpn
sudo cp packaging/config/config.toml.example /etc/corevpn/config.toml

# Install systemd service
sudo cp packaging/systemd/corevpn-server.service /etc/systemd/system/
sudo systemctl daemon-reload`;

  productionChecklist = [
    {
      icon: '🔐',
      title: 'TLS Certificates',
      description: 'Generate or obtain proper TLS certificates. Never use self-signed certs in production.',
    },
    {
      icon: '🔑',
      title: 'Authentication',
      description: 'Configure OAuth2 or SAML. Change default admin credentials.',
    },
    {
      icon: '🌐',
      title: 'Network Security',
      description: 'Configure firewall rules. Use network policies in Kubernetes.',
    },
    {
      icon: '📊',
      title: 'Monitoring',
      description: 'Set up health checks, metrics collection, and alerting.',
    },
    {
      icon: '💾',
      title: 'Backup',
      description: 'Implement backup strategy for configuration and client data.',
    },
    {
      icon: '📝',
      title: 'Logging Policy',
      description: 'Decide on logging mode based on compliance requirements.',
    },
  ];
}
