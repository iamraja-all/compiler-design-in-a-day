'use client';

import { useState } from 'react';
import { Key, Lightbulb, Target, AlertTriangle, CheckSquare, HelpCircle, Eye, EyeOff } from 'lucide-react';

export type CalloutType = 'KEY' | 'ANALOGY' | 'EXAM' | 'TRAP' | 'RECIPE' | 'CHECK';

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

const CALLOUT_CONFIG: Record<
  CalloutType,
  {
    label: string;
    tokenVar: string;
    borderVar: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  KEY: {
    label: 'KEY IDEA',
    tokenVar: 'var(--accent)',
    borderVar: 'var(--accent)',
    icon: Key,
  },
  ANALOGY: {
    label: 'EVERYDAY ANALOGY',
    tokenVar: 'var(--purple)',
    borderVar: 'var(--purple)',
    icon: Lightbulb,
  },
  EXAM: {
    label: 'EXAM TIP',
    tokenVar: 'var(--warning)',
    borderVar: 'var(--warning)',
    icon: Target,
  },
  TRAP: {
    label: 'COMMON MISTAKE',
    tokenVar: 'var(--danger)',
    borderVar: 'var(--danger)',
    icon: AlertTriangle,
  },
  RECIPE: {
    label: 'PROBLEM RECIPE',
    tokenVar: 'var(--success)',
    borderVar: 'var(--success)',
    icon: CheckSquare,
  },
  CHECK: {
    label: 'CHECK YOURSELF',
    tokenVar: 'var(--accent)',
    borderVar: 'var(--accent)',
    icon: HelpCircle,
  },
};

export function Callout({ type, children }: CalloutProps) {
  const config = CALLOUT_CONFIG[type] || CALLOUT_CONFIG.KEY;
  const Icon = config.icon;

  return (
    <aside
      className={`my-6 rounded-[var(--r-md)] border-l-[3.5px] p-5 transition-all text-[0.95rem] ${
        type === 'RECIPE' ? 'shadow-sm' : ''
      }`}
      style={{
        borderLeftColor: config.borderVar,
        backgroundColor: `color-mix(in srgb, ${config.tokenVar} 8%, transparent)`,
      }}
    >
      <div className="flex items-center gap-2 mb-2 font-bold tracking-wider text-xs uppercase" style={{ color: config.tokenVar }}>
        <Icon className="w-4 h-4 shrink-0" />
        <span>{config.label}</span>
      </div>
      <div className="callout-body space-y-2 text-[var(--text)] leading-relaxed">{children}</div>
    </aside>
  );
}

interface CheckCalloutProps {
  question: React.ReactNode;
  answer: React.ReactNode;
}

export function CheckCallout({ question, answer }: CheckCalloutProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <aside
      className="my-6 rounded-[var(--r-md)] border-l-[3.5px] p-5 transition-all text-[0.95rem] border-[var(--border)]"
      style={{
        borderLeftColor: 'var(--accent)',
        backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)',
      }}
    >
      <div className="flex items-center gap-2 mb-2 font-bold tracking-wider text-xs uppercase text-[var(--accent)]">
        <HelpCircle className="w-4 h-4 shrink-0" />
        <span>CHECK YOURSELF</span>
      </div>

      <div className="text-[var(--text)] leading-relaxed mb-4">{question}</div>

      <div className="pt-2 border-t border-[var(--border)]/50">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] hover:bg-[var(--accent)] hover:text-black text-xs font-semibold text-[var(--accent)] border border-[var(--accent)]/40 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Reveal answer</span>
          </button>
        ) : (
          <div className="animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--success)] uppercase tracking-wider">
                Answer:
              </span>
              <button
                onClick={() => setRevealed(false)}
                className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <EyeOff className="w-3 h-3" />
                <span>Hide</span>
              </button>
            </div>
            <div className="text-[var(--text)] leading-relaxed pl-3 border-l-2 border-[var(--success)]/50">
              {answer}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
