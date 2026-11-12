'use client';

import { useEffect, useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface StepperControlsProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  onReset?: () => void;
  className?: string;
}

export function StepperControls({
  currentStep,
  totalSteps,
  onStepChange,
  onReset,
  className = '',
}: StepperControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 1600 / speed;
    const timer = setInterval(() => {
      onStepChange(currentStep < totalSteps - 1 ? currentStep + 1 : 0);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, currentStep, totalSteps, speed, onStepChange]);

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStep > 0) onStepChange(currentStep - 1);
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStep < totalSteps - 1) onStepChange(currentStep + 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (onReset) onReset();
    else onStepChange(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`stepper-controls flex flex-wrap items-center justify-between gap-3 text-xs not-prose ${className}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        } else if (e.key === ' ') {
          e.preventDefault();
          togglePlay();
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          handleReset();
        }
      }}
    >
      {/* Control Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleReset}
          className="h-9 px-3 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer"
          title="Reset (R)"
          aria-label="Reset stepper"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          onClick={handlePrev}
          disabled={currentStep <= 0}
          className="h-9 px-3 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          title="Previous (←)"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <button
          onClick={togglePlay}
          className="h-9 px-3.5 rounded-[var(--r-md)] bg-[var(--accent)] text-black font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="Play / Pause (Space)"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Play</span>
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep >= totalSteps - 1}
          className="h-9 px-3 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors disabled:opacity-35 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          title="Next (→)"
          aria-label="Next step"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Step Counter & Speed */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          Step <span className="font-bold text-[var(--text)]">{currentStep + 1}</span> / {totalSteps}
        </span>

        {/* Speed toggle pills */}
        <div className="flex items-center rounded-[var(--r-sm)] border border-[var(--border)] p-0.5 bg-[var(--surface-2)]">
          {([0.5, 1, 2] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-1.5 py-0.5 text-[10px] font-mono rounded-[3px] transition-colors cursor-pointer ${
                speed === s
                  ? 'bg-[var(--accent)] text-black font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
