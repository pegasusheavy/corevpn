import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-block',
  standalone: true,
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
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        } @else {
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
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
