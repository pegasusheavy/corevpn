import { Component, input, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [FaIconComponent],
  template: `
    <div class="relative group my-4">
      <!-- Language badge -->
      @if (language()) {
        <div class="absolute top-0 left-0 px-3 py-1 text-xs font-medium text-slate-500 bg-slate-800 rounded-tl-lg rounded-br-lg border-b border-r border-slate-700">
          {{ language() }}
        </div>
      }

      <!-- Copy button -->
      <button
        (click)="copyCode()"
        class="absolute top-2 right-2 p-2 text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
        [title]="copied() ? 'Copied!' : 'Copy code'">
        @if (copied()) {
          <fa-icon [icon]="['fas', 'check']" class="text-emerald-400"></fa-icon>
        } @else {
          <fa-icon [icon]="['far', 'copy']"></fa-icon>
        }
      </button>

      <!-- Code content -->
      <pre class="!pt-10 !rounded-xl"><code class="!bg-transparent !p-0 text-sm">{{ code() }}</code></pre>
    </div>
  `,
})
export class CodeBlockComponent {
  code = input.required<string>();
  language = input<string>('');

  protected readonly copied = signal(false);

  copyCode() {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
