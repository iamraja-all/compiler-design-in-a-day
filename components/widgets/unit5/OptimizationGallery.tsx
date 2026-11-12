'use client';

import { useState } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { OPT_GALLERY } from '../data/unit5';
import { ArrowRight, Check } from 'lucide-react';

export function OptimizationGallery() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showOptimized, setShowOptimized] = useState(false);

  const item = OPT_GALLERY[selectedIdx];

  return (
    <WidgetFrame
      title="Classical Machine-Independent Code Optimization Gallery"
      notice="Explore standard loop, expression, and data-flow transformations"
      explanation={item.why}
    >
      <div className="space-y-6">
        {/* Gallery Tabs */}
        <div className="flex flex-wrap gap-2">
          {OPT_GALLERY.map((opt, idx) => (
            <button
              key={opt.id}
              onClick={() => {
                setSelectedIdx(idx);
                setShowOptimized(false);
              }}
              className={`px-3 py-1.5 rounded-[var(--r-md)] border text-xs font-semibold cursor-pointer transition-colors ${
                selectedIdx === idx
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)] shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              {opt.title}
            </button>
          ))}
        </div>

        {/* Before / After Card */}
        <div className="p-5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-sm text-[var(--text)] m-0">{item.title}</h5>
            <button
              onClick={() => setShowOptimized(!showOptimized)}
              className="px-3 py-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--accent)] font-semibold hover:border-[var(--accent)] transition-colors cursor-pointer"
            >
              Toggle: {showOptimized ? 'View Before' : 'View After (Optimized)'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {/* Before */}
            <div
              className={`p-4 rounded-[var(--r-sm)] border transition-all ${
                !showOptimized
                  ? 'bg-[var(--surface-2)] border-[var(--accent)]/50 ring-1 ring-[var(--accent)]'
                  : 'bg-[var(--surface-2)]/40 border-[var(--border)] opacity-60'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-[var(--danger)] mb-2 flex items-center justify-between">
                <span>Before Optimization</span>
                {!showOptimized && <span>Active</span>}
              </div>
              <pre className="text-[var(--text)] leading-relaxed m-0 whitespace-pre">
                {item.before}
              </pre>
            </div>

            {/* After */}
            <div
              className={`p-4 rounded-[var(--r-sm)] border transition-all ${
                showOptimized
                  ? 'bg-[var(--success)]/10 border-[var(--success)]/50 ring-1 ring-[var(--success)]'
                  : 'bg-[var(--surface-2)]/40 border-[var(--border)] opacity-60'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-[var(--success)] mb-2 flex items-center justify-between">
                <span>After Optimization</span>
                {showOptimized && <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Active</span>}
              </div>
              <pre className="text-[var(--text)] leading-relaxed m-0 whitespace-pre">
                {item.after}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}
