'use client';

import { useState, useMemo } from 'react';
import { WidgetFrame } from '../shared/WidgetFrame';
import { ALL_FLASHCARDS, FlashcardItem } from '../data/flashcards';
import { useAppStore } from '@/lib/store';
import { Check, RotateCcw, Shuffle, Sparkles, HelpCircle, Eye, EyeOff } from 'lucide-react';

export function Flashcards() {
  const { flashcardMastered, setFlashcardMastered, resetFlashcards } = useAppStore();

  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[] | null>(null);

  // Filter cards by unit
  const filteredCards = useMemo(() => {
    let list = ALL_FLASHCARDS;
    if (selectedUnit !== 'all') {
      list = list.filter((c) => c.unitSlug === selectedUnit);
    }
    if (shuffleOrder && shuffleOrder.length === list.length) {
      return shuffleOrder.map((idx) => list[idx]);
    }
    return list;
  }, [selectedUnit, shuffleOrder]);

  const activeCard: FlashcardItem | undefined = filteredCards[currentIndex];
  const isMastered = activeCard ? !!flashcardMastered[activeCard.id] : false;

  const totalMastered = ALL_FLASHCARDS.filter((c) => !!flashcardMastered[c.id]).length;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(filteredCards.length - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const indices = Array.from({ length: filteredCards.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffleOrder(indices);
    setCurrentIndex(0);
  };

  const handleGotIt = () => {
    if (activeCard) {
      setFlashcardMastered(activeCard.id, true);
    }
    handleNext();
  };

  const handleAgain = () => {
    if (activeCard) {
      setFlashcardMastered(activeCard.id, false);
    }
    handleNext();
  };

  return (
    <WidgetFrame
      title="Exam Checkpoint Flashcards"
      notice="Auto-generated from all 20 [!CHECK] comprehension questions across all units"
      explanation="Active retrieval practice with spaced repetition reinforces high-yield exam concepts."
    >
      <div className="space-y-6">
        {/* Controls: Unit Filter + Shuffle + Progress */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)] font-bold">Filter:</span>
            <select
              value={selectedUnit}
              onChange={(e) => {
                setSelectedUnit(e.target.value);
                setShuffleOrder(null);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="px-3 py-1.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] focus:border-[var(--accent)]"
            >
              <option value="all">All Units ({ALL_FLASHCARDS.length} Cards)</option>
              <option value="00-introduction">Introduction (2 cards)</option>
              <option value="01-unit-1">Unit I: Lexical Analysis (4 cards)</option>
              <option value="02-unit-2">Unit II: Syntax Analysis (5 cards)</option>
              <option value="03-unit-3">Unit III: SDT & TAC (4 cards)</option>
              <option value="04-unit-4">Unit IV: Runtime & Codegen (2 cards)</option>
              <option value="05-unit-5">Unit V: Optimization (3 cards)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] transition-colors cursor-pointer"
              title="Shuffle cards"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <span className="text-[var(--success)] font-bold">
              {totalMastered} / {ALL_FLASHCARDS.length} Mastered
            </span>
          </div>
        </div>

        {/* The Flashcard itself */}
        {activeCard ? (
          <div className="space-y-4">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-8 sm:p-10 rounded-[var(--r-lg)] border-2 border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] transition-all cursor-pointer min-h-[220px] flex flex-col justify-between shadow-xs relative"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pb-4 border-b border-[var(--border)]/50">
                <span className="font-bold text-[var(--accent)] uppercase">
                  {activeCard.unitTitle}
                </span>
                <span className="flex items-center gap-1">
                  Card {currentIndex + 1} of {filteredCards.length} · Click to flip
                </span>
              </div>

              {/* Front or Back Content */}
              <div className="py-6 my-auto text-center">
                {!isFlipped ? (
                  <div className="space-y-3">
                    <span className="text-xs uppercase font-bold text-[var(--text-muted)] tracking-wider">
                      Question
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] leading-relaxed m-0">
                      {activeCard.question}
                    </h3>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <span className="text-xs uppercase font-bold text-[var(--success)] tracking-wider">
                      Model Exam Answer
                    </span>
                    <p className="text-base sm:text-lg font-medium text-[var(--text)] leading-relaxed m-0 max-w-2xl mx-auto">
                      {activeCard.answer}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom footer status */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]/50 text-[11px] font-mono text-[var(--text-muted)]">
                <span>{isMastered ? '✓ Previously Mastered' : 'Not yet mastered'}</span>
                <span className="text-[var(--accent)]">{isFlipped ? 'Answer shown' : 'Click to reveal answer'}</span>
              </div>
            </div>

            {/* Answer feedback buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={handleAgain}
                className="px-5 py-2.5 rounded-[var(--r-md)] bg-[var(--surface)] border border-[var(--danger)]/50 text-[var(--danger)] hover:bg-[var(--danger)]/15 text-xs font-bold transition-colors cursor-pointer"
              >
                Again (Need review)
              </button>

              <button
                onClick={handleGotIt}
                className="px-6 py-2.5 rounded-[var(--r-md)] bg-[var(--success)] text-black hover:opacity-90 text-xs font-bold transition-opacity cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Got it! (Mastered)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] italic">
            No cards match the selected filter.
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}
