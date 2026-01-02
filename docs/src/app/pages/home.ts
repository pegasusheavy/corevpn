import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { SeoService } from '../services/seo.service';

interface Feature {
  icon: [IconPrefix, IconName];
  title: string;
  description: string;
}

interface DeploymentOption {
  icon: [IconPrefix, IconName];
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FaIconComponent],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative pt-32 pb-20 overflow-hidden">
        <!-- Background effects -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div class="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-20 left-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="text-center max-w-4xl mx-auto">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 animate-fade-in">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-sm text-slate-300">Open Source & Production Ready</span>
            </div>

            <!-- Title -->
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style="animation-delay: 0.1s">
              <span class="gradient-text">Secure VPN Server</span>
              <br>
              <span class="text-white">Built for Privacy</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-xl text-slate-400 mb-10 max-w-2xl mx-auto animate-fade-in" style="animation-delay: 0.2s">
              OpenVPN-compatible server with OAuth2/SAML authentication, ghost mode for zero-logging,
              and modern TLS. Deploy anywhere with Docker or Kubernetes.
            </p>

            <!-- CTAs -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style="animation-delay: 0.3s">
              <a routerLink="/getting-started" class="btn btn-primary text-lg px-8 py-3">
                Get Started
                <fa-icon [icon]="['fas', 'arrow-right']" class="ml-2"></fa-icon>
              </a>
              <a href="https://github.com/pegasusheavy/corevpn" target="_blank" rel="noopener" class="btn btn-secondary text-lg px-8 py-3">
                <fa-icon [icon]="['fab', 'github']" class="mr-2"></fa-icon>
                View on GitHub
              </a>
            </div>
          </div>

          <!-- Terminal Preview -->
          <div class="mt-20 max-w-4xl mx-auto animate-fade-in" style="animation-delay: 0.4s">
            <div class="glass rounded-2xl overflow-hidden glow-cyan">
              <div class="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <fa-icon [icon]="['fas', 'terminal']" class="text-slate-500 ml-2"></fa-icon>
                <span class="text-sm text-slate-500">terminal</span>
              </div>
              <div class="p-6 font-mono text-sm leading-relaxed">
                <div class="text-slate-500"># Quick start with Docker</div>
                <div class="mt-2">
                  <span class="text-cyan-400">$</span>
                  <span class="text-white"> docker run -d --name corevpn \\</span>
                </div>
                <div class="pl-4 text-white">-p 1194:1194/udp -p 8443:8443 \\</div>
                <div class="pl-4 text-white">-e COREVPN_GHOST_MODE=true \\</div>
                <div class="pl-4 text-white">ghcr.io/pegasusheavy/corevpn:latest</div>
                <div class="mt-4 text-emerald-400">
                  <fa-icon [icon]="['fas', 'check']" class="mr-1"></fa-icon>
                  CoreVPN server started on port 1194
                </div>
                <div class="text-emerald-400">
                  <fa-icon [icon]="['fas', 'check']" class="mr-1"></fa-icon>
                  Admin UI available at https://localhost:8443
                </div>
                <div class="text-purple-400">
                  <fa-icon [icon]="['fas', 'ghost']" class="mr-1"></fa-icon>
                  Ghost mode enabled - zero logging active
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-24 relative" aria-labelledby="features-heading">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 id="features-heading" class="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need for Secure Connectivity
            </h2>
            <p class="text-lg text-slate-400 max-w-2xl mx-auto">
              Production-ready VPN infrastructure with enterprise features and privacy-first design.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (feature of features; track feature.title) {
              <article class="card card-hover group">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                  <fa-icon [icon]="feature.icon" class="text-2xl text-cyan-400"></fa-icon>
                </div>
                <h3 class="text-lg font-semibold text-white mb-2">{{ feature.title }}</h3>
                <p class="text-slate-400 text-sm">{{ feature.description }}</p>
              </article>
            }
          </div>
        </div>
      </section>

      <!-- Ghost Mode Section -->
      <section class="py-24 relative overflow-hidden" aria-labelledby="ghost-mode-heading">
        <div class="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span class="badge badge-purple mb-4">Privacy First</span>
              <h2 id="ghost-mode-heading" class="text-3xl sm:text-4xl font-bold text-white mb-6">
                <fa-icon [icon]="['fas', 'ghost']" class="mr-3 text-purple-400"></fa-icon>
                Ghost Mode
              </h2>
              <p class="text-lg text-slate-400 mb-6">
                When privacy is paramount, Ghost Mode ensures absolutely zero connection logging.
                No files, no database, no memory traces. Perfect for privacy-conscious deployments.
              </p>
              <ul class="space-y-3 mb-8">
                @for (item of ghostFeatures; track item) {
                  <li class="flex items-center gap-3 text-slate-300">
                    <fa-icon [icon]="['fas', 'check']" class="text-purple-400 shrink-0"></fa-icon>
                    {{ item }}
                  </li>
                }
              </ul>
              <a routerLink="/configuration/ghost-mode" class="btn btn-secondary">
                Learn about Ghost Mode
                <fa-icon [icon]="['fas', 'chevron-right']" class="ml-2"></fa-icon>
              </a>
            </div>
            <div class="glass rounded-2xl p-6 glow-purple ghost-mode">
              <pre class="!bg-transparent !border-0 !p-0"><code class="text-sm">[logging]
# Ghost mode - no logs whatsoever
mode = "none"

# Or use memory-only (volatile)
# mode = "memory"
# memory_max_entries = 100

# Anonymization when logging is needed
[logging.anonymization]
hash_ips = true
hash_usernames = true
round_timestamps = "1h"</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Deployment Options -->
      <section class="py-24" aria-labelledby="deployment-heading">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 id="deployment-heading" class="text-3xl sm:text-4xl font-bold text-white mb-4">
              Deploy Anywhere
            </h2>
            <p class="text-lg text-slate-400 max-w-2xl mx-auto">
              From single containers to enterprise Kubernetes clusters, CoreVPN scales with your needs.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-6">
            @for (option of deploymentOptions; track option.title) {
              <a [routerLink]="option.link" class="card card-hover group text-center">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mx-auto mb-4 group-hover:from-slate-600 group-hover:to-slate-700 transition-colors">
                  <fa-icon [icon]="option.icon" class="text-3xl text-cyan-400"></fa-icon>
                </div>
                <h3 class="text-lg font-semibold text-white mb-2">{{ option.title }}</h3>
                <p class="text-slate-400 text-sm">{{ option.description }}</p>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- FAQ Section for AEO -->
      <section class="py-24 bg-slate-900/50" aria-labelledby="faq-heading">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 id="faq-heading" class="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p class="text-lg text-slate-400">
              Quick answers to common questions about CoreVPN.
            </p>
          </div>

          <div class="space-y-4">
            @for (faq of faqs; track faq.question) {
              <details class="group card" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <summary class="flex items-center justify-between cursor-pointer list-none">
                  <h3 class="text-lg font-medium text-white pr-4" itemprop="name">{{ faq.question }}</h3>
                  <fa-icon [icon]="['fas', 'chevron-down']" class="text-slate-400 group-open:rotate-180 transition-transform"></fa-icon>
                </summary>
                <div class="mt-4 text-slate-400" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                  <p itemprop="text">{{ faq.answer }}</p>
                </div>
              </details>
            }
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-24 relative overflow-hidden" aria-labelledby="cta-heading">
        <div class="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none"></div>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 id="cta-heading" class="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p class="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Deploy a secure, privacy-focused VPN server in minutes.
            Open source, battle-tested, and backed by an active community.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/getting-started" class="btn btn-primary text-lg px-8 py-3">
              <fa-icon [icon]="['fas', 'book-open']" class="mr-2"></fa-icon>
              Read the Docs
            </a>
            <a href="https://github.com/pegasusheavy/corevpn/releases" target="_blank" rel="noopener" class="btn btn-secondary text-lg px-8 py-3">
              <fa-icon [icon]="['fas', 'download']" class="mr-2"></fa-icon>
              Download Latest
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);

  features: Feature[] = [
    {
      icon: ['fas', 'key'],
      title: 'OAuth2 & SAML Authentication',
      description: 'Integrate with your existing identity provider. Support for OIDC, Google, GitHub, and enterprise SAML.',
    },
    {
      icon: ['fas', 'ghost'],
      title: 'Ghost Mode',
      description: 'Zero-logging mode for maximum privacy. No connection logs, no traces, no compromises.',
    },
    {
      icon: ['fas', 'lock'],
      title: 'Modern TLS',
      description: 'TLS 1.3 with strong ciphers. AES-256-GCM encryption for data channel security.',
    },
    {
      icon: ['fas', 'cube'],
      title: 'Kubernetes Ready',
      description: 'Helm charts, network policies, and pod disruption budgets for production deployments.',
    },
    {
      icon: ['fab', 'docker'],
      title: 'Container Native',
      description: 'Hardened Alpine-based images with minimal attack surface and Tini init.',
    },
    {
      icon: ['fas', 'sliders'],
      title: 'Admin Dashboard',
      description: 'Web-based management interface for client configuration and monitoring.',
    },
  ];

  ghostFeatures = [
    'NullConnectionLogger discards all events',
    'Secure memory wiping on shutdown',
    'No persistent storage of any kind',
    'CLI flag: --ghost for instant activation',
    'Kubernetes values-ghost.yaml preset',
  ];

  deploymentOptions: DeploymentOption[] = [
    {
      icon: ['fab', 'docker'],
      title: 'Docker',
      description: 'Single command deployment with docker-compose',
      link: '/deployment/docker',
    },
    {
      icon: ['fas', 'cube'],
      title: 'Kubernetes',
      description: 'Production-grade Helm charts and manifests',
      link: '/deployment/kubernetes',
    },
    {
      icon: ['fas', 'cube'],
      title: 'Packages',
      description: 'DEB and RPM packages with systemd/OpenRC',
      link: '/deployment/packages',
    },
  ];

  faqs = [
    {
      question: 'What is CoreVPN?',
      answer: 'CoreVPN is an OpenVPN-compatible VPN server written in Rust. It features OAuth2/SAML authentication, ghost mode for zero-logging privacy, modern TLS 1.3 encryption, and easy deployment with Docker or Kubernetes.',
    },
    {
      question: 'Is CoreVPN compatible with OpenVPN clients?',
      answer: 'Yes, CoreVPN is fully compatible with standard OpenVPN clients. You can use OpenVPN Connect on Windows, macOS, Linux, iOS, and Android to connect using the generated .ovpn configuration files.',
    },
    {
      question: 'What is Ghost Mode?',
      answer: "Ghost Mode is CoreVPN's zero-logging feature. When enabled, the server discards all connection events immediately, maintains no history, and writes nothing to disk. It's ideal for privacy-conscious deployments.",
    },
    {
      question: 'How do I deploy CoreVPN?',
      answer: 'CoreVPN can be deployed using Docker, Kubernetes with Helm, or native packages (DEB/RPM). The quickest way is: docker run -d -p 1194:1194/udp ghcr.io/pegasusheavy/corevpn:latest',
    },
    {
      question: 'Does CoreVPN support OAuth2 and SAML?',
      answer: 'Yes, CoreVPN supports OAuth2/OIDC with providers like Google, GitHub, and any OIDC-compliant IdP. It also supports enterprise SAML authentication for single sign-on integration.',
    },
    {
      question: 'Is CoreVPN free and open source?',
      answer: 'Yes, CoreVPN is completely free and open source under the MIT license. You can use it for personal or commercial purposes, modify the code, and contribute to the project on GitHub.',
    },
  ];

  ngOnInit(): void {
    this.seo.updateMeta({
      title: 'CoreVPN Documentation',
      description:
        'CoreVPN is an OpenVPN-compatible server with OAuth2/SAML authentication, ghost mode for zero-logging, and modern TLS. Deploy anywhere with Docker or Kubernetes.',
      keywords: [
        'VPN',
        'OpenVPN',
        'CoreVPN',
        'ghost mode',
        'zero logging',
        'OAuth2',
        'SAML',
        'Docker',
        'Kubernetes',
        'privacy',
        'security',
        'TLS',
        'Rust',
      ],
      canonicalUrl: 'https://pegasusheavy.github.io/corevpn/',
      ogType: 'website',
    });

    // Add FAQ schema for AEO
    this.seo.addFAQSchema(this.faqs);

    // Add software and documentation schemas
    this.seo.addSoftwareSchema();
    this.seo.addDocumentationSchema();
  }
}
