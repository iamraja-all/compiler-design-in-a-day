'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="my-6 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--code-bg)] overflow-hidden shadow-xs not-prose">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text-muted)] font-mono">
        <span className="uppercase tracking-wider font-semibold">
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--r-sm)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors cursor-pointer"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[var(--success)]" />
              <span className="text-[var(--success)] text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-[0.92rem] leading-relaxed text-[var(--text)] whitespace-pre m-0">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
