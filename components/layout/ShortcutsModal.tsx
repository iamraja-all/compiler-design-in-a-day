'use client';

import { useAppStore } from '@/lib/store';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { key: 'F', action: 'Toggle Focus Mode' },
  { key: 'T', action: 'Cycle theme (Dark → Light → Sepia)' },
  { key: 'J / K', action: 'Next / previous section' },
  { key: 'D', action: 'Mark current section done' },
  { key: '← / →', action: 'Previous / next step in focused widget' },
  { key: 'Space', action: 'Play / pause focused widget' },
  { key: 'R', action: 'Reset focused widget' },
  { key: 'P', action: 'Start / pause Pomodoro timer' },
  { key: '?', action: 'Open keyboard shortcuts help' },
  { key: 'Esc', action: 'Exit Focus Mode / close dialogs' },
];

export function ShortcutsModal() {
  const { showShortcutsHelp, setShowShortcutsHelp } = useAppStore();

  if (!showShortcutsHelp) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowShortcutsHelp(false)}
    >
      <div
        className="w-full max-w-md rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[var(--accent)]" />
            <h2 id="shortcuts-title" className="text-lg font-semibold text-[var(--text)] m-0">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setShowShortcutsHelp(false)}
            className="p-1 rounded-[var(--r-sm)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between py-1.5 px-2 rounded-[var(--r-sm)] hover:bg-[var(--surface-2)] text-sm"
            >
              <span className="text-[var(--text-muted)]">{s.action}</span>
              <kbd className="px-2 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs text-[var(--accent)] font-semibold shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)] text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] font-mono">Esc</kbd> anytime to dismiss
        </div>
      </div>
    </div>
  );
}
