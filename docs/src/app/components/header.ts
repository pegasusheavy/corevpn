import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FaIconComponent],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="relative">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
                <fa-icon [icon]="['fas', 'lock']" class="text-white text-lg"></fa-icon>
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
               class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
               aria-label="View on GitHub">
              <fa-icon [icon]="['fab', 'github']" class="text-xl"></fa-icon>
            </a>

            <!-- Mobile menu button -->
            <button (click)="toggleMobile()"
                    class="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
                    [attr.aria-label]="mobileOpen() ? 'Close menu' : 'Open menu'"
                    [attr.aria-expanded]="mobileOpen()">
              <fa-icon [icon]="mobileOpen() ? ['fas', 'xmark'] : ['fas', 'bars']" class="text-xl"></fa-icon>
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
