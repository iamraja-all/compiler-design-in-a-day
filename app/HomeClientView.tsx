'use client';

import Link from 'next/link';
import { UnitData } from '@/lib/content';
import { useAppStore } from '@/lib/store';
import { ArrowRight, BookOpen, CheckCircle, Clock, Sparkles, Calendar, Layers, ShieldCheck } from 'lucide-react';

interface HomeClientViewProps {
  units: UnitData[];
}

export function HomeClientView({ units }: HomeClientViewProps) {
  const { completedSections } = useAppStore();

  const totalSections = units.reduce((acc, u) => acc + u.sections.length, 0);
  const doneCount = Object.values(completedSections).filter(Boolean).length;
  const overallPercentage = totalSections > 0 ? Math.round((doneCount / totalSections) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 sm:pt-8 not-prose">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--accent)] font-semibold shadow-xs">
          <span>Anna University · B.E. CSE Sem V · 24CS5501</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--text)] max-w-3xl mx-auto leading-[1.15]">
          Compiler Design in a Day
        </h1>

        <p className="text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          The whole subject in one focused day. High-yield explanations, step-by-step algorithms, and 28 interactive visual laboratories.
        </p>

        {/* Global Progress Bar */}
        <div className="max-w-md mx-auto pt-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5 font-mono">
            <span>Overall Syllabus Mastery</span>
            <span className="font-semibold text-[var(--text)]">{doneCount} / {totalSections} sections ({overallPercentage}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/unit/00-introduction"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--r-md)] bg-[var(--accent)] text-black font-semibold text-sm hover:opacity-90 transition-all shadow-md cursor-pointer"
          >
            <span>Start studying</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/unit/06-revision"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] font-semibold text-sm hover:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span>Revision & Flashcards</span>
          </Link>
        </div>
      </section>

      {/* 7 Unit Cards Grid */}
      <section className="space-y-6 not-prose">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div>
            <h2 className="text-xl font-bold text-[var(--text)] m-0">Syllabus Units</h2>
            <p className="text-xs text-[var(--text-muted)] m-0 mt-0.5">
              Anna University 2024 Regulation 24CS5501
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">7 modules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {units.map((unit) => {
            const unitDone = unit.sections.filter((s) => !!completedSections[s.id]).length;
            const pct = unit.sections.length > 0 ? Math.round((unitDone / unit.sections.length) * 100) : 0;

            return (
              <Link
                key={unit.slug}
                href={`/unit/${unit.slug}`}
                className="group relative p-5 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-semibold text-[var(--accent)] uppercase tracking-wider">
                      {unit.slug.replace('0', '').replace('-unit-', 'Unit ').replace('introduction', 'Intro').replace('revision', 'Revision')}
                    </span>

                    {/* Progress Ring */}
                    <div className="flex items-center gap-1.5" title={`${unitDone}/${unit.sections.length} sections completed`}>
                      <div className="relative w-7 h-7 flex items-center justify-center">
                        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            className="stroke-[var(--surface-2)] fill-none"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15"
                            className="stroke-[var(--accent)] fill-none transition-all duration-300"
                            strokeWidth="3"
                            strokeDasharray={94.2}
                            strokeDashoffset={94.2 - (94.2 * pct) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[9px] font-mono font-bold text-[var(--text)]">
                          {pct}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors mb-2 line-clamp-1">
                    {unit.unitTitle}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-4 leading-relaxed">
                    {unit.sections.map((s) => s.title).slice(0, 4).join(' · ')}
                    {unit.sections.length > 4 ? '…' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--text-muted)] pt-3 border-t border-[var(--border)]/60">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[var(--text-muted)]" />
                    <span>{unit.sections.length} sections</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[var(--accent)]" />
                    <span>{unit.totalWidgets} visuals</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[var(--warning)]" />
                    <span>~{unit.totalMinutes}m</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 1-Day Study Plan Timeline */}
      <section className="p-6 sm:p-8 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] space-y-6 not-prose">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[var(--accent)]" />
          <div>
            <h2 className="text-lg font-bold text-[var(--text)] m-0">
              The 1-Day Master Schedule
            </h2>
            <p className="text-xs text-[var(--text-muted)] m-0">
              Recommended battle-tested timeline to complete the entire syllabus before exam day
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
            <div className="flex items-center justify-between font-mono font-semibold text-[var(--accent)]">
              <span>08:00 – 09:30</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[var(--accent)]/15">Morning Kickoff</span>
            </div>
            <div className="font-bold text-[var(--text)]">Intro + Unit I: Lexical Analysis</div>
            <p className="text-[var(--text-muted)] m-0">
              Compiler structure, input buffering, Thompson construction, Subset construction, DFA minimization.
            </p>
          </div>

          <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
            <div className="flex items-center justify-between font-mono font-semibold text-[var(--warning)]">
              <span>09:45 – 12:15</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[var(--warning)]/15">High Marks</span>
            </div>
            <div className="font-bold text-[var(--text)]">Unit II: Syntax Analysis & Parsing</div>
            <p className="text-[var(--text-muted)] m-0">
              Ambiguity, Left recursion & factoring, FIRST & FOLLOW, LL(1) tables, LR(0) items, SLR parsing, LALR merging.
            </p>
          </div>

          <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
            <div className="flex items-center justify-between font-mono font-semibold text-[var(--purple)]">
              <span>13:15 – 15:00</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[var(--purple)]/15">After Lunch</span>
            </div>
            <div className="font-bold text-[var(--text)]">Unit III: SDT & Intermediate Code</div>
            <p className="text-[var(--text-muted)] m-0">
              Syntax-directed definitions (S- & L-attributed), TAC, Quadruples, Triples, DAG vs Tree, Backpatching.
            </p>
          </div>

          <div className="p-3.5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
            <div className="flex items-center justify-between font-mono font-semibold text-[var(--success)]">
              <span>15:15 – 18:00</span>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[var(--success)]/15">Target Finish</span>
            </div>
            <div className="font-bold text-[var(--text)]">Unit IV & V: Runtime, Codegen & Opt</div>
            <p className="text-[var(--text-muted)] m-0">
              Activation records, parameter passing, basic blocks, Ershov numbers, code motion, DAGs, reaching definitions.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[var(--success)]" />
            <span>Follow the Pomodoro timer: 25 min focus / 5 min break</span>
          </span>
          <span className="font-mono">Evening: Final Flashcards Deck</span>
        </div>
      </section>
    </div>
  );
}
