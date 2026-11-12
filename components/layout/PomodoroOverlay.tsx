'use client';

import { useAppStore } from '@/lib/store';
import { Coffee, ArrowRight, X } from 'lucide-react';

export function PomodoroOverlay() {
  const { showBreakOverlay, dismissBreakOverlay, activeSectionId } = useAppStore();

  if (!showBreakOverlay) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[var(--bg)]/90 backdrop-blur-md transition-all duration-300"
    >
      <div className="max-w-md w-full text-center p-8 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-2xl relative">
        <button
          onClick={dismissBreakOverlay}
          className="absolute top-4 right-4 p-1.5 rounded-[var(--r-sm)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          aria-label="Dismiss break overlay"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
          <Coffee className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-[var(--text)] mb-2 mt-0">
          Time for a gentle break
        </h3>
        <p className="text-[var(--text-muted)] text-base mb-6 leading-relaxed">
          Stand up, stretch your back, drink water, and rest your eyes. You’ve completed a focused study block.
        </p>

        {activeSectionId && (
          <div className="mb-6 p-3 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] text-sm flex items-center justify-center gap-2 text-[var(--text-muted)]">
            <span>Next up:</span>
            <span className="font-semibold text-[var(--text)] capitalize">
              {activeSectionId.replace(/-/g, ' ')}
            </span>
          </div>
        )}

        <button
          onClick={dismissBreakOverlay}
          className="w-full py-3 px-4 rounded-[var(--r-md)] bg-[var(--accent)] text-black font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <span>Continue studying</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
