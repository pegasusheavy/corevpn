import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FaIconComponent],
  template: `
    <footer class="border-t border-slate-800 bg-slate-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <!-- Product -->
          <div>
            <h4 class="text-sm font-semibold text-white mb-4">Product</h4>
            <ul class="space-y-3">
              <li><a routerLink="/getting-started" class="text-sm text-slate-400 hover:text-white transition-colors">Getting Started</a></li>
              <li><a routerLink="/configuration" class="text-sm text-slate-400 hover:text-white transition-colors">Configuration</a></li>
              <li><a routerLink="/deployment" class="text-sm text-slate-400 hover:text-white transition-colors">Deployment</a></li>
              <li><a routerLink="/api" class="text-sm text-slate-400 hover:text-white transition-colors">API Reference</a></li>
            </ul>
          </div>

          <!-- Features -->
          <div>
            <h4 class="text-sm font-semibold text-white mb-4">Features</h4>
            <ul class="space-y-3">
              <li><a routerLink="/configuration/ghost-mode" class="text-sm text-slate-400 hover:text-white transition-colors">Ghost Mode</a></li>
              <li><a routerLink="/configuration/authentication" class="text-sm text-slate-400 hover:text-white transition-colors">OAuth2/SAML</a></li>
              <li><a routerLink="/deployment/kubernetes" class="text-sm text-slate-400 hover:text-white transition-colors">Kubernetes</a></li>
              <li><a routerLink="/deployment/docker" class="text-sm text-slate-400 hover:text-white transition-colors">Docker</a></li>
            </ul>
          </div>

          <!-- Community -->
          <div>
            <h4 class="text-sm font-semibold text-white mb-4">Community</h4>
            <ul class="space-y-3">
              <li><a href="https://github.com/pegasusheavy/corevpn" target="_blank" rel="noopener" class="text-sm text-slate-400 hover:text-white transition-colors">GitHub</a></li>
              <li><a href="https://github.com/pegasusheavy/corevpn/discussions" target="_blank" rel="noopener" class="text-sm text-slate-400 hover:text-white transition-colors">Discussions</a></li>
              <li><a href="https://github.com/pegasusheavy/corevpn/issues" target="_blank" rel="noopener" class="text-sm text-slate-400 hover:text-white transition-colors">Issue Tracker</a></li>
              <li><a href="https://www.patreon.com/c/PegasusHeavyIndustries" target="_blank" rel="noopener" class="text-sm text-slate-400 hover:text-white transition-colors">Patreon</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul class="space-y-3">
              <li><a href="https://github.com/pegasusheavy/corevpn/blob/main/LICENSE" target="_blank" rel="noopener" class="text-sm text-slate-400 hover:text-white transition-colors">License (MIT)</a></li>
              <li><a href="https://github.com/pegasusheavy/corevpn/blob/main/SECURITY.md" target="_blank" rel="noopener" class="text-sm text-slate-400 hover:text-white transition-colors">Security Policy</a></li>
              <li><a href="https://github.com/pegasusheavy/corevpn/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener" class="text-sm text-slate-400 hover:text-white transition-colors">Contributing</a></li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <fa-icon [icon]="['fas', 'lock']" class="text-white text-sm"></fa-icon>
            </div>
            <span class="text-sm text-slate-400">© 2026 Pegasus Heavy Industries. All rights reserved.</span>
          </div>

          <div class="flex items-center gap-4">
            <a href="https://github.com/pegasusheavy/corevpn"
               target="_blank"
               rel="noopener"
               class="text-slate-400 hover:text-white transition-colors"
               aria-label="GitHub">
              <fa-icon [icon]="['fab', 'github']" class="text-xl"></fa-icon>
            </a>
            <a href="https://x.com/pegasusheavy"
               target="_blank"
               rel="noopener"
               class="text-slate-400 hover:text-white transition-colors"
               aria-label="X (Twitter)">
              <fa-icon [icon]="['fab', 'x-twitter']" class="text-xl"></fa-icon>
            </a>
            <a href="https://www.patreon.com/c/PegasusHeavyIndustries"
               target="_blank"
               rel="noopener"
               class="text-slate-400 hover:text-white transition-colors"
               aria-label="Patreon">
              <fa-icon [icon]="['fab', 'patreon']" class="text-xl"></fa-icon>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
