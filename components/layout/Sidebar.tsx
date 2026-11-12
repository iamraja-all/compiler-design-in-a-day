'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UNITS } from '@/lib/units';
import { useAppStore } from '@/lib/store';
import { CheckCircle2, Circle, BookOpen, Layers, X, Sparkles } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sections?: { id: string; title: string }[];
  activeSectionId?: string | null;
}

export function Sidebar({ isOpen, onClose, sections, activeSectionId }: SidebarProps) {
  const pathname = usePathname();
  const { completedSections, focusMode } = useAppStore();

  if (focusMode) {
    return null;
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 w-72 z-40 bg-[var(--surface)] border-r border-[var(--border)] overflow-y-auto transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Table of Contents"
      >
        <div className="p-4 flex flex-col h-full justify-between">
          <div>
            {/* Mobile close button */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[var(--border)] lg:hidden">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Syllabus Navigation
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-[var(--r-sm)] text-[var(--text-muted)] hover:text-[var(--text)]"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Units list */}
            <div className="space-y-1 mb-6">
              <div className="px-2 py-1 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Units (Anna Univ. 24CS5501)</span>
              </div>

              {UNITS.map((unit) => {
                const isActive = pathname === `/unit/${unit.slug}` || (unit.slug === '00-introduction' && pathname === '/');
                // Calculate unit completion percentage based on checked sections
                return (
                  <Link
                    key={unit.slug}
                    href={`/unit/${unit.slug}`}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`group flex items-start gap-2.5 px-3 py-2 rounded-[var(--r-md)] text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30 font-semibold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text)]">
                      {unit.slug.replace('0', '').replace('-unit-', 'U').replace('introduction', '00').replace('revision', 'REV')}
                    </span>
                    <span className="leading-tight flex-1 line-clamp-2">{unit.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* Current page section TOC */}
            {sections && sections.length > 0 && (
              <div className="pt-4 border-t border-[var(--border)] space-y-1">
                <div className="px-2 py-1 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>On This Page ({sections.length})</span>
                </div>

                <div className="space-y-0.5 max-h-[38vh] overflow-y-auto pr-1">
                  {sections.map((sec) => {
                    const isCompleted = !!completedSections[sec.id];
                    const isCurrent = activeSectionId === sec.id;

                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={`group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[var(--r-sm)] text-[12px] transition-colors ${
                          isCurrent
                            ? 'text-[var(--accent)] font-semibold bg-[var(--surface-2)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                        }`}
                      >
                        <span className="truncate flex-1">{sec.title}</span>
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)] shrink-0" />
                        ) : (
                          <Circle className="w-3 h-3 text-[var(--border)] group-hover:text-[var(--text-muted)] shrink-0" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick link to revision / flashcards */}
          <div className="pt-4 border-t border-[var(--border)]">
            <Link
              href="/unit/06-revision"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className="flex items-center gap-2 p-2.5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] text-xs text-[var(--text)] transition-colors group"
            >
              <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">Final Revision Sheet</div>
                <div className="text-[10px] text-[var(--text-muted)]">All Checkpoints & Summary</div>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
