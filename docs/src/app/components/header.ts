import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="relative">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
            </div>
            <div>
              <span class="text-xl font-bold text-white">CoreVPN</span>
              <span class="text-xs text-slate-500 block -mt-1">Documentation</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            @for (item of navItems(); track item.label) {
              <a [routerLink]="item.path"
                 routerLinkActive="!text-cyan-400 !bg-cyan-500/10"
                 [routerLinkActiveOptions]="{ exact: item.exact }"
                 class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200">
                {{ item.label }}
              </a>
            }
          </nav>

          <!-- Right side -->
          <div class="flex items-center gap-4">
            <!-- Version badge -->
            <span class="badge badge-cyan hidden sm:inline-flex">v0.1.0</span>

            <!-- GitHub link -->
            <a href="https://github.com/pegasusheavy/corevpn"
               target="_blank"
               rel="noopener noreferrer"
               class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>

            <!-- Mobile menu button -->
            <button (click)="toggleMobile()"
                    class="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (!mobileOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileOpen()) {
        <div class="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl animate-fade-in">
          <nav class="px-4 py-4 space-y-1">
            @for (item of navItems(); track item.label) {
              <a [routerLink]="item.path"
                 routerLinkActive="!text-cyan-400 !bg-cyan-500/10"
                 [routerLinkActiveOptions]="{ exact: item.exact }"
                 (click)="mobileOpen.set(false)"
                 class="block px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200">
                {{ item.label }}
              </a>
            }
          </nav>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  protected readonly mobileOpen = signal(false);

  protected readonly navItems = signal([
    { label: 'Home', path: '/', exact: true },
    { label: 'Getting Started', path: '/getting-started', exact: false },
    { label: 'Configuration', path: '/configuration', exact: false },
    { label: 'Deployment', path: '/deployment', exact: false },
    { label: 'API Reference', path: '/api', exact: false },
  ]);

  toggleMobile() {
    this.mobileOpen.update((v) => !v);
  }
}
