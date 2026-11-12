'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface DiagramWrapperProps {
  blockId: string;
  originalText: string;
  children: React.ReactNode;
}

export function DiagramWrapper({
  blockId,
  originalText,
  children,
}: DiagramWrapperProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(originalText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="my-6 not-prose" data-diagram-id={blockId}>
      {/* Visual Diagram */}
      {children}

      {/* Ghost toggle button for original text version */}
      <div className="flex justify-end mt-1 px-1">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-[var(--r-sm)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border)]"
          aria-expanded={showOriginal}
          aria-controls={`ascii-panel-${blockId}`}
        >
          <span>{showOriginal ? 'Hide text version' : 'Show text version'}</span>
          {showOriginal ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Collapsed original ASCII text panel */}
      {showOriginal && (
        <div
          id={`ascii-panel-${blockId}`}
          className="mt-2 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--code-bg)] overflow-hidden shadow-xs"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--border)] bg-[var(--surface-2)] text-[11px] font-mono text-[var(--text-muted)]">
            <span>ORIGINAL ASCII ({blockId})</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors cursor-pointer"
              aria-label="Copy original ASCII text"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[var(--success)]" />
                  <span className="text-[var(--success)]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy ASCII</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 overflow-x-auto">
            <pre
              className="m-0 text-[13px] text-[var(--text)]"
              style={{
                fontFamily: 'var(--font-mono), "DejaVu Sans Mono", "Menlo", "Consolas", monospace',
                fontVariantLigatures: 'none',
                fontFeatureSettings: '"liga" 0, "calt" 0',
                lineHeight: 1.25,
                letterSpacing: 0,
                whiteSpace: 'pre',
                tabSize: 4,
              }}
            >
              <code>{originalText}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
