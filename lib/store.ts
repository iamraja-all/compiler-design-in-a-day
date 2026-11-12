import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'sepia';
export type PomodoroMode = 'focus' | 'break';

interface AppState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;

  focusMode: boolean;
  setFocusMode: (val: boolean) => void;
  toggleFocusMode: () => void;

  completedSections: Record<string, boolean>;
  toggleSectionCompleted: (sectionId: string) => void;
  isSectionCompleted: (sectionId: string) => boolean;

  // Active section for Focus Mode & navigation
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;

  // Pomodoro timer
  pomodoroActive: boolean;
  pomodoroMode: PomodoroMode;
  pomodoroTimeRemaining: number; // in seconds
  pomodoroFocusDuration: number; // e.g. 25 * 60
  pomodoroBreakDuration: number; // e.g. 5 * 60
  showBreakOverlay: boolean;
  setPomodoroActive: (active: boolean) => void;
  togglePomodoro: () => void;
  tickPomodoro: () => void;
  resetPomodoro: () => void;
  dismissBreakOverlay: () => void;
  setPomodoroDurations: (focusMin: number, breakMin: number) => void;

  // Flashcards state
  flashcardMastered: Record<string, boolean>;
  setFlashcardMastered: (id: string, mastered: boolean) => void;
  resetFlashcards: () => void;

  // Shortcuts modal
  showShortcutsHelp: boolean;
  setShowShortcutsHelp: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      cycleTheme: () => {
        const order: Theme[] = ['dark', 'light', 'sepia'];
        const current = get().theme;
        const next = order[(order.indexOf(current) + 1) % order.length];
        get().setTheme(next);
      },

      focusMode: false,
      setFocusMode: (val) => set({ focusMode: val }),
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),

      completedSections: {},
      toggleSectionCompleted: (sectionId) =>
        set((state) => ({
          completedSections: {
            ...state.completedSections,
            [sectionId]: !state.completedSections[sectionId],
          },
        })),
      isSectionCompleted: (sectionId) => !!get().completedSections[sectionId],

      activeSectionId: null,
      setActiveSectionId: (id) => set({ activeSectionId: id }),

      pomodoroActive: false,
      pomodoroMode: 'focus',
      pomodoroTimeRemaining: 25 * 60,
      pomodoroFocusDuration: 25 * 60,
      pomodoroBreakDuration: 5 * 60,
      showBreakOverlay: false,
      setPomodoroActive: (active) => set({ pomodoroActive: active }),
      togglePomodoro: () =>
        set((state) => ({ pomodoroActive: !state.pomodoroActive })),
      tickPomodoro: () => {
        const { pomodoroTimeRemaining, pomodoroMode, pomodoroFocusDuration, pomodoroBreakDuration } = get();
        if (pomodoroTimeRemaining > 1) {
          set({ pomodoroTimeRemaining: pomodoroTimeRemaining - 1 });
        } else {
          if (pomodoroMode === 'focus') {
            set({
              pomodoroMode: 'break',
              pomodoroTimeRemaining: pomodoroBreakDuration,
              showBreakOverlay: true,
              pomodoroActive: false,
            });
          } else {
            set({
              pomodoroMode: 'focus',
              pomodoroTimeRemaining: pomodoroFocusDuration,
              showBreakOverlay: false,
              pomodoroActive: false,
            });
          }
        }
      },
      resetPomodoro: () => {
        const { pomodoroFocusDuration } = get();
        set({
          pomodoroActive: false,
          pomodoroMode: 'focus',
          pomodoroTimeRemaining: pomodoroFocusDuration,
          showBreakOverlay: false,
        });
      },
      dismissBreakOverlay: () => set({ showBreakOverlay: false }),
      setPomodoroDurations: (focusMin, breakMin) =>
        set({
          pomodoroFocusDuration: focusMin * 60,
          pomodoroBreakDuration: breakMin * 60,
          pomodoroTimeRemaining: focusMin * 60,
          pomodoroMode: 'focus',
          pomodoroActive: false,
        }),

      flashcardMastered: {},
      setFlashcardMastered: (id, mastered) =>
        set((state) => ({
          flashcardMastered: {
            ...state.flashcardMastered,
            [id]: mastered,
          },
        })),
      resetFlashcards: () => set({ flashcardMastered: {} }),

      showShortcutsHelp: false,
      setShowShortcutsHelp: (show) => set({ showShortcutsHelp: show }),
    }),
    {
      name: 'compiler-design-in-a-day-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        completedSections: state.completedSections,
        flashcardMastered: state.flashcardMastered,
      }),
    }
  )
);
