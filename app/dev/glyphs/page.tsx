'use client';

import React, { useEffect, useState } from 'react';
import rawBlocksData from '@/lib/raw-text-blocks.json';

const rawBlocks: Record<string, { raw: string }> = rawBlocksData;

interface CharMeasure {
  char: string;
  codePoint: number;
  hex: string;
  width: number;
  diff: number;
  sampleBlock: string;
}

export default function DevGlyphsPage() {
  const [results, setResults] = useState<{
    referenceWidth: number;
    mismatches: CharMeasure[];
    totalUniqueChars: number;
    fontUsed: string;
  } | null>(null);

  useEffect(() => {
    // Collect all unique characters across all text blocks
    const charMap = new Map<string, string>(); // char -> sample blockId

    Object.entries(rawBlocks).forEach(([blockId, block]) => {
      for (const char of block.raw) {
        if (!charMap.has(char)) {
          charMap.set(char, blockId);
        }
      }
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontString = '16px "JetBrains Mono", "DejaVu Sans Mono", Menlo, Consolas, monospace';
    ctx.font = fontString;

    const refMetrics = ctx.measureText('M');
    const refWidth = Math.round(refMetrics.width * 100) / 100;

    const mismatches: CharMeasure[] = [];

    charMap.forEach((sampleBlock, char) => {
      // Skip newlines, tabs, and spaces
      if (char === '\n' || char === '\r' || char === '\t') return;

      const m = ctx.measureText(char);
      const w = Math.round(m.width * 100) / 100;
      const diff = Math.abs(w - refWidth);

      // Flag if width differs significantly from monospace standard (tolerance 0.5px for subpixel rendering)
      if (diff > 0.5) {
        mismatches.push({
          char,
          codePoint: char.codePointAt(0) || 0,
          hex: 'U+' + (char.codePointAt(0) || 0).toString(16).toUpperCase().padStart(4, '0'),
          width: w,
          diff: Math.round(diff * 100) / 100,
          sampleBlock,
        });
      }
    });

    setResults({
      referenceWidth: refWidth,
      mismatches,
      totalUniqueChars: charMap.size,
      fontUsed: fontString,
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-extrabold text-[var(--text)] mb-2">
          Glyph Width Monospace Verifier (/dev/glyphs)
        </h1>
        <p className="text-sm font-mono text-[var(--text-muted)]">
          Measures character widths of every unique glyph in /content text blocks against the reference width of &apos;M&apos; using canvas.measureText.
        </p>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="text-[var(--text-muted)]">Reference Width (&apos;M&apos;)</div>
              <div className="text-xl font-bold text-[var(--accent)] mt-1">
                {results.referenceWidth} px
              </div>
            </div>

            <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="text-[var(--text-muted)]">Total Unique Glyphs</div>
              <div className="text-xl font-bold text-[var(--text)] mt-1">
                {results.totalUniqueChars}
              </div>
            </div>

            <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="text-[var(--text-muted)]">Width Discrepancies</div>
              <div
                className={`text-xl font-bold mt-1 ${
                  results.mismatches.length === 0
                    ? 'text-[var(--success)]'
                    : 'text-[var(--warning)]'
                }`}
              >
                {results.mismatches.length}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface)]">
            <div className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase mb-3">
              Mismatched Glyphs (if any)
            </div>
            {results.mismatches.length === 0 ? (
              <div className="text-xs font-mono text-[var(--success)] p-3 rounded bg-[var(--success)]/10 border border-[var(--success)]/20">
                ✓ All glyphs have uniform monospace width matching &apos;M&apos;.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-[var(--border)] text-[var(--text-muted)]">
                    <tr>
                      <th className="py-2 px-3">Char</th>
                      <th className="py-2 px-3">Unicode</th>
                      <th className="py-2 px-3">Width</th>
                      <th className="py-2 px-3">Diff vs &apos;M&apos;</th>
                      <th className="py-2 px-3">Sample Block</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
                    {results.mismatches.map((m, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-bold text-sm bg-[var(--surface-2)]">
                          {m.char}
                        </td>
                        <td className="py-2 px-3">{m.hex}</td>
                        <td className="py-2 px-3">{m.width} px</td>
                        <td className="py-2 px-3 text-[var(--warning)]">+{m.diff} px</td>
                        <td className="py-2 px-3 text-[var(--text-muted)]">{m.sampleBlock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
