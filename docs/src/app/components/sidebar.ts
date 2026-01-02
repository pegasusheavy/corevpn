import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  label: string;
  path: string;
  icon?: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 shrink-0 hidden lg:block">
      <div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-4 pb-8">
        @for (section of sections(); track section.title) {
          <div class="mb-6">
            <h3 class="nav-section">{{ section.title }}</h3>
            <ul class="space-y-1">
              @for (item of section.items; track item.path) {
                <li>
                  <a [routerLink]="item.path"
                     routerLinkActive="active"
                     class="nav-item">
                    @if (item.icon) {
                      <span class="text-lg">{{ item.icon }}</span>
                    }
                    <span>{{ item.label }}</span>
                    @if (item.badge) {
                      <span class="ml-auto badge badge-cyan text-xs">{{ item.badge }}</span>
                    }
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  sections = input<SidebarSection[]>([]);
}
