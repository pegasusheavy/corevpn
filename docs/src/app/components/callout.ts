import { Component, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

type CalloutType = 'info' | 'warning' | 'danger' | 'success' | 'ghost';

@Component({
  selector: 'app-callout',
  standalone: true,
  imports: [FaIconComponent],
  template: `
    <div [class]="getClasses()">
      <div class="flex items-start gap-3">
        <fa-icon [icon]="getIcon()" class="text-xl shrink-0 mt-0.5"></fa-icon>
        <div class="flex-1 min-w-0">
          @if (title()) {
            <h4 class="font-semibold mb-1">{{ title() }}</h4>
          }
          <div class="text-sm opacity-90">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CalloutComponent {
  type = input<CalloutType>('info');
  title = input<string>('');

  getClasses(): string {
    const baseClasses = 'callout';
    const typeClasses: Record<CalloutType, string> = {
      info: 'callout-info',
      warning: 'callout-warning',
      danger: 'callout-danger',
      success: 'callout-success',
      ghost: 'bg-purple-500/10 border-purple-500 text-purple-200 ghost-mode',
    };
    return `${baseClasses} ${typeClasses[this.type()]}`;
  }

  getIcon(): [IconPrefix, IconName] {
    const icons: Record<CalloutType, [IconPrefix, IconName]> = {
      info: ['fas', 'circle-info'],
      warning: ['fas', 'triangle-exclamation'],
      danger: ['fas', 'circle-exclamation'],
      success: ['fas', 'circle-check'],
      ghost: ['fas', 'ghost'],
    };
    return icons[this.type()];
  }
}
