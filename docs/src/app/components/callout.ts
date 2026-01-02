import { Component, input } from '@angular/core';

type CalloutType = 'info' | 'warning' | 'danger' | 'success' | 'ghost';

@Component({
  selector: 'app-callout',
  standalone: true,
  template: `
    <div [class]="getClasses()">
      <div class="flex items-start gap-3">
        <span class="text-xl shrink-0">{{ getIcon() }}</span>
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

  getIcon(): string {
    const icons: Record<CalloutType, string> = {
      info: 'ℹ️',
      warning: '⚠️',
      danger: '🚨',
      success: '✅',
      ghost: '👻',
    };
    return icons[this.type()];
  }
}
