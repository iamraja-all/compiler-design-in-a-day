'use client';

import React, { useState, useRef } from 'react';
import { Maximize2, Minimize2, Sparkles } from 'lucide-react';

interface WidgetFrameProps {
  title: string;
  notice?: string;
  explanation?: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export function WidgetFrame({
  title,
  notice,
  explanation,
  children,
  controls,
}: WidgetFrameProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      className={`rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-200 not-prose ${
        isFullscreen
          ? 'fixed inset-4 z-50 shadow-2xl flex flex-col bg-[var(--surface)] max-w-6xl mx-auto'
          : 'my-8 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="min-w-0 pr-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <h4 className="text-sm font-bold text-[var(--text)] m-0 truncate">
              {title}
            </h4>
          </div>
          {notice && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 m-0 line-clamp-1">
              <span className="font-semibold text-[var(--text)]">Notice:</span> {notice}
            </p>
          )}
        </div>

        <button
          onClick={toggleFullscreen}
          className="fullscreen-btn p-1.5 rounded-[var(--r-sm)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors shrink-0 cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Interactive Canvas */}
      <div className={`p-4 sm:p-6 bg-[var(--surface-2)] overflow-x-auto ${isFullscreen ? 'flex-1 flex flex-col justify-center' : ''}`}>
        {children}
      </div>

      {/* Footer: Stepper controls & per-step explanation */}
      {(controls || explanation) && (
        <div className="px-5 py-3.5 border-t border-[var(--border)] bg-[var(--surface)] space-y-2">
          {controls && <div>{controls}</div>}
          {explanation && (
            <div className="p-2.5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)]/70 text-xs font-mono leading-relaxed text-[var(--text)] flex items-start gap-2">
              <span className="text-[var(--accent)] font-bold shrink-0">WHY:</span>
              <span className="text-[var(--text)]">{explanation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
