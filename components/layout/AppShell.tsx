'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ReadingProgressBar } from './ReadingProgressBar';
import { ShortcutsModal } from './ShortcutsModal';
import { PomodoroOverlay } from './PomodoroOverlay';
import { UNITS } from '@/lib/units';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topBarHovered, setTopBarHovered] = useState(false);
  const [sections, setSections] = useState<{ id: string; title: string }[]>([]);

  const {
    theme,
    cycleTheme,
    focusMode,
    toggleFocusMode,
    setFocusMode,
    activeSectionId,
    setActiveSectionId,
    toggleSectionCompleted,
    pomodoroActive,
    tickPomodoro,
    togglePomodoro,
    setShowShortcutsHelp,
    pomodoroTimeRemaining,
  } = useAppStore();

  // Synchronize document theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Pomodoro timer tick interval
  useEffect(() => {
    if (!pomodoroActive) return;
    const interval = setInterval(() => {
      tickPomodoro();
    }, 1000);
    return () => clearInterval(interval);
  }, [pomodoroActive, tickPomodoro]);

  // Read section headings from DOM on route change or scroll
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('section[data-section-id]'));
    if (headings.length > 0) {
      const parsed = headings.map((h) => ({
        id: h.getAttribute('data-section-id') || '',
        title: h.getAttribute('data-section-title') || '',
      }));
      setSections(parsed);
    } else {
      setSections([]);
    }
  }, [pathname]);

  // Section spotlight IntersectionObserver
  useEffect(() => {
    const sectionEls = document.querySelectorAll('.content-section');
    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section-id');
            if (id) {
              setActiveSectionId(id);
              // Update DOM spotlight class
              sectionEls.forEach((el) => {
                if (el.getAttribute('data-section-id') === id) {
                  el.classList.add('spotlight-active');
                } else {
                  el.classList.remove('spotlight-active');
                }
              });
            }
          }
        }
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname, sections, setActiveSectionId]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        if (focusMode) setFocusMode(false);
        setShowShortcutsHelp(false);
        return;
      }

      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcutsHelp(true);
        return;
      }

      if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleFocusMode();
        return;
      }

      if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        cycleTheme();
        return;
      }

      if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        togglePomodoro();
        return;
      }

      if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (activeSectionId) {
          toggleSectionCompleted(activeSectionId);
        }
        return;
      }

      if (e.key.toLowerCase() === 'j' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // Jump to next section
        if (sections.length > 0) {
          const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
          const nextIndex = Math.min(sections.length - 1, currentIndex + 1);
          const target = document.getElementById(sections[nextIndex].id);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSectionId(sections[nextIndex].id);
          }
        }
        return;
      }

      if (e.key.toLowerCase() === 'k' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // Jump to previous section
        if (sections.length > 0) {
          const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
          const prevIndex = Math.max(0, currentIndex - 1);
          const target = document.getElementById(sections[prevIndex].id);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSectionId(sections[prevIndex].id);
          }
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    focusMode,
    activeSectionId,
    sections,
    cycleTheme,
    toggleFocusMode,
    setFocusMode,
    setShowShortcutsHelp,
    togglePomodoro,
    toggleSectionCompleted,
    setActiveSectionId,
  ]);

  // Current unit title for top bar
  const currentUnit = UNITS.find((u) => `/unit/${u.slug}` === pathname || (u.slug === '00-introduction' && pathname === '/'));

  // Calculate section progress for focus mode pill
  const activeSectionIndex = sections.findIndex((s) => s.id === activeSectionId);
  const sectionProgressLabel =
    sections.length > 0
      ? `Section ${activeSectionIndex >= 0 ? activeSectionIndex + 1 : 1}/${sections.length}`
      : null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col ${focusMode ? 'focus-active' : ''}`}>
      {/* Top progress bar */}
      <ReadingProgressBar />

      {/* Focus Mode hover zone to show top bar when mouse moves to the top 12px */}
      {focusMode && (
        <div
          className="focus-topbar-hover-zone"
          onMouseEnter={() => setTopBarHovered(true)}
          onMouseLeave={() => setTopBarHovered(false)}
        />
      )}

      {/* TopBar with conditional reveal in focus mode */}
      <div
        onMouseEnter={() => setTopBarHovered(true)}
        onMouseLeave={() => setTopBarHovered(false)}
        style={{
          transform: focusMode && !topBarHovered ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          title={currentUnit?.title}
          isSidebarOpen={sidebarOpen}
        />
      </div>

      {/* Main layout container */}
      <div className="flex-1 flex pt-14">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          sections={sections}
          activeSectionId={activeSectionId}
        />

        {/* Content Area */}
        <main
          className={`flex-1 transition-all duration-200 ${
            focusMode ? 'lg:pl-0' : 'lg:pl-72'
          }`}
        >
          {children}
        </main>
      </div>

      {/* Focus Mode floating pill (bottom-right) */}
      {focusMode && (
        <aside
          aria-label="Focus mode indicator"
          className="pomodoro-pill fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-xl text-xs font-mono text-[var(--text)] backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="font-semibold text-[var(--accent)]">
            ⏱ {formatTimer(pomodoroTimeRemaining)}
          </span>
          {sectionProgressLabel && (
            <>
              <span className="text-[var(--border)]" aria-hidden="true">·</span>
              <span className="text-[var(--text-muted)]">{sectionProgressLabel}</span>
            </>
          )}
          <span className="text-[var(--border)]" aria-hidden="true">·</span>
          <span className="text-[10px] text-[var(--text-muted)]">Esc to exit</span>
        </aside>
      )}

      {/* Modals and Overlays */}
      <ShortcutsModal />
      <PomodoroOverlay />
    </div>
  );
}
