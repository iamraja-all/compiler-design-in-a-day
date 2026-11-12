import Link from 'next/link';
import { UNITS } from '@/lib/units';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PrevNextUnitProps {
  currentSlug: string;
}

export function PrevNextUnit({ currentSlug }: PrevNextUnitProps) {
  const currentIndex = UNITS.findIndex((u) => u.slug === currentSlug);
  if (currentIndex === -1) return null;

  const prevUnit = currentIndex > 0 ? UNITS[currentIndex - 1] : null;
  const nextUnit = currentIndex < UNITS.length - 1 ? UNITS[currentIndex + 1] : null;

  return (
    <nav className="mt-16 pt-8 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose" aria-label="Unit pagination">
      {prevUnit ? (
        <Link
          href={`/unit/${prevUnit.slug}`}
          className="group flex flex-col p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)] transition-all"
        >
          <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1 uppercase tracking-wider mb-1">
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Previous Unit
          </span>
          <span className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
            {prevUnit.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextUnit && (
        <Link
          href={`/unit/${nextUnit.slug}`}
          className="group flex flex-col items-end text-right p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)] transition-all"
        >
          <span className="text-[11px] font-semibold text-[var(--text-muted)] flex items-center gap-1 uppercase tracking-wider mb-1">
            Next Unit
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
            {nextUnit.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
