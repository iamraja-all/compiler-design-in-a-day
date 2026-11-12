'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Menu, Maximize2, Minimize2, Sun, Moon, BookOpen, Play, Pause, RotateCcw, Keyboard } from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  title?: string;
  isSidebarOpen: boolean;
}

export function TopBar({ onToggleSidebar, title, isSidebarOpen }: TopBarProps) {
  const {
    theme,
    cycleTheme,
    focusMode,
    toggleFocusMode,
    pomodoroActive,
    pomodoroMode,
    pomodoroTimeRemaining,
    togglePomodoro,
    resetPomodoro,
    setShowShortcutsHelp,
  } = useAppStore();

  const [showTimerMenu, setShowTimerMenu] = useState(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="w-4 h-4 text-[var(--accent)]" />;
    if (theme === 'light') return <Sun className="w-4 h-4 text-[var(--warning)]" />;
    return <BookOpen className="w-4 h-4 text-[var(--purple)]" />;
  };

  return (
    <header
      className="topbar fixed top-0 left-0 right-0 h-14 z-40 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] transition-transform duration-200"
      style={{
        transform: focusMode ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <div className="h-full px-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Mobile hamburger + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-[var(--r-sm)] hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            href="/"
            className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors shrink-0 hidden sm:inline-block"
          >
            Compiler Design
          </Link>

          {title && (
            <>
              <span className="text-[var(--border)] hidden sm:inline" aria-hidden="true">/</span>
              <span className="text-sm font-medium text-[var(--text)] truncate max-w-[200px] sm:max-w-[320px] md:max-w-md">
                {title}
              </span>
            </>
          )}
        </div>

        {/* Right: Pomodoro + Theme + Shortcuts + Focus */}
        <div className="flex items-center gap-2">
          {/* Pomodoro Timer button */}
          <div className="relative">
            <button
              onClick={() => setShowTimerMenu(!showTimerMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
              title="Pomodoro Timer"
              aria-label="Pomodoro Timer"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  pomodoroActive ? 'bg-[var(--success)] animate-pulse' : 'bg-[var(--text-muted)]'
                }`}
              />
              <span className="tabular-nums font-semibold">{formatTime(pomodoroTimeRemaining)}</span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase hidden md:inline">
                {pomodoroMode}
              </span>
            </button>

            {showTimerMenu && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl z-50 text-sm space-y-2"
                onMouseLeave={() => setShowTimerMenu(false)}
              >
                <div className="text-xs text-[var(--text-muted)] uppercase font-semibold tracking-wider">
                  Pomodoro ({pomodoroMode})
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={togglePomodoro}
                    className="flex-1 mr-1.5 py-1.5 px-2 rounded-[var(--r-sm)] bg-[var(--accent)] text-black font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {pomodoroActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" /> Start
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetPomodoro}
                    className="p-1.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme cycle button */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-[var(--r-sm)] hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            title={`Current theme: ${theme}. Click to change (T)`}
            aria-label="Toggle theme"
          >
            {getThemeIcon()}
          </button>

          {/* Shortcuts button */}
          <button
            onClick={() => setShowShortcutsHelp(true)}
            className="p-2 rounded-[var(--r-sm)] hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer hidden sm:flex"
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Focus Mode button */}
          <button
            onClick={toggleFocusMode}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-[var(--r-md)] text-xs font-semibold cursor-pointer transition-all ${
              focusMode
                ? 'bg-[var(--accent)] text-black shadow-sm'
                : 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)]'
            }`}
            title="Toggle Focus Mode (F)"
            aria-label="Toggle Focus Mode"
          >
            {focusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Focus</span>
          </button>
        </div>
      </div>
    </header>
  );
}
