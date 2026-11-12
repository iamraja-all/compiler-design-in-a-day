'use client';

import React, { useState } from 'react';
import { DIAGRAM_OVERRIDES } from '@/lib/diagram-overrides';
import rawBlocksData from '@/lib/raw-text-blocks.json';

const rawBlocks: Record<string, { raw: string }> = rawBlocksData;

export default function DevDiagramsPage() {
  const overrideKeys = Object.keys(DIAGRAM_OVERRIDES);
  const [filter, setFilter] = useState('');

  const filteredKeys = overrideKeys.filter((k) =>
    k.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8 border-b border-[var(--border)] pb-6">
        <h1 className="text-3xl font-extrabold text-[var(--text)] mb-2">
          Diagram Overrides Visual Comparison (/dev/diagrams)
        </h1>
        <p className="text-sm font-mono text-[var(--text-muted)]">
          Side-by-side inspection of all {overrideKeys.length} replaced visual diagram components against their original ASCII text.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Filter by block ID (e.g. 01-unit-1 or 02-unit-2#5)..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--surface-2)] text-xs font-mono text-[var(--text)] w-80"
          />
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Showing {filteredKeys.length} of {overrideKeys.length} overrides
          </span>
        </div>
      </div>

      <div className="space-y-12">
        {filteredKeys.map((blockId) => {
          const original = rawBlocks[blockId]?.raw || '';
          const renderComponent = DIAGRAM_OVERRIDES[blockId];

          return (
            <div
              key={blockId}
              id={blockId}
              className="p-6 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-xs"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
                <span className="px-3 py-1 rounded-[var(--r-sm)] bg-[var(--accent)] text-[var(--bg)] font-mono text-sm font-bold">
                  {blockId}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  Original Length: {original.length} chars
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Visual Component */}
                <div>
                  <div className="text-xs font-mono font-bold text-[var(--accent)] uppercase mb-2">
                    Visual Diagram Component
                  </div>
                  <div className="border border-[var(--border)] rounded-[var(--r-md)] p-2 bg-[var(--surface-2)]">
                    {renderComponent ? renderComponent(original) : <div>No renderer</div>}
                  </div>
                </div>

                {/* Original ASCII */}
                <div>
                  <div className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase mb-2">
                    Original ASCII (Source of Truth)
                  </div>
                  <pre
                    className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--code-bg)] text-xs text-[var(--text)] overflow-x-auto m-0"
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
                    <code>{original}</code>
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
