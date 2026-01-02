import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
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
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span class="text-sm text-slate-400">© 2026 Pegasus Heavy Industries. All rights reserved.</span>
          </div>

          <div class="flex items-center gap-4">
            <a href="https://github.com/pegasusheavy/corevpn" target="_blank" rel="noopener" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a href="https://x.com/pegasusheavy" target="_blank" rel="noopener" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
