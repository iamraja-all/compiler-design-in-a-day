'use client';

import { useAppStore } from '@/lib/store';
import { CheckCircle2, Circle } from 'lucide-react';

interface SectionDoneCheckProps {
  sectionId: string;
  sectionTitle: string;
}

export function SectionDoneCheck({ sectionId, sectionTitle }: SectionDoneCheckProps) {
  const { completedSections, toggleSectionCompleted } = useAppStore();
  const isDone = !!completedSections[sectionId];

  return (
    <div className="mt-8 pt-4 pb-2 border-t border-[var(--border)]/60 flex items-center justify-between not-prose">
      <div className="text-xs text-[var(--text-muted)] italic">
        Section complete?
      </div>
      <button
        onClick={() => toggleSectionCompleted(sectionId)}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--r-md)] text-xs font-semibold cursor-pointer transition-all border ${
          isDone
            ? 'bg-[var(--success)]/15 border-[var(--success)]/50 text-[var(--success)]'
            : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]'
        }`}
        aria-pressed={isDone}
      >
        {isDone ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
            <span>Section completed</span>
          </>
        ) : (
          <>
            <Circle className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Mark section as done</span>
          </>
        )}
      </button>
    </div>
  );
}
