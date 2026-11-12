import React from 'react';

// Intro
import { PipelineJourney } from './intro/PipelineJourney';

// Unit I
import { TokenizerPlayground } from './unit1/TokenizerPlayground';
import { InputBuffer } from './unit1/InputBuffer';
import { DfaSimulator } from './unit1/DfaSimulator';
import { ThompsonBuilder } from './unit1/ThompsonBuilder';
import { SubsetConstruction } from './unit1/SubsetConstruction';
import { DfaMinimization } from './unit1/DfaMinimization';

// Unit II
import { AmbiguityTrees } from './unit2/AmbiguityTrees';
import { LeftRecursionFixer } from './unit2/LeftRecursionFixer';
import { FirstFollowStepper } from './unit2/FirstFollowStepper';
import { Ll1Parser } from './unit2/Ll1Parser';
import { Lr0Automaton } from './unit2/Lr0Automaton';
import { SlrParser } from './unit2/SlrParser';
import { ClrLalrMerge } from './unit2/ClrLalrMerge';

// Unit III
import { AnnotatedTree } from './unit3/AnnotatedTree';
import { DagVsTree } from './unit3/DagVsTree';
import { TacFormats } from './unit3/TacFormats';
import { BackpatchStepper } from './unit3/BackpatchStepper';

// Unit IV
import { ActivationStack } from './unit4/ActivationStack';
import { ParamPassingLab } from './unit4/ParamPassingLab';
import { BasicBlockFinder } from './unit4/BasicBlockFinder';
import { CodegenStepper } from './unit4/CodegenStepper';
import { ErshovLabeler } from './unit4/ErshovLabeler';

// Unit V
import { OptimizationGallery } from './unit5/OptimizationGallery';
import { PeepholeLab } from './unit5/PeepholeLab';
import { DagBuilder } from './unit5/DagBuilder';
import { ReachingDefs } from './unit5/ReachingDefs';

// Revision
import { Flashcards } from './revision/Flashcards';

// Widget registry mapping exact ID from {{widget:ID}} to its React component
export const WIDGET_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Intro (1)
  'pipeline-journey': PipelineJourney,

  // Unit I (6)
  'tokenizer-playground': TokenizerPlayground,
  'input-buffer': InputBuffer,
  'dfa-simulator': DfaSimulator,
  'thompson-builder': ThompsonBuilder,
  'subset-construction': SubsetConstruction,
  'dfa-minimization': DfaMinimization,

  // Unit II (7)
  'ambiguity-trees': AmbiguityTrees,
  'left-recursion-fixer': LeftRecursionFixer,
  'first-follow-stepper': FirstFollowStepper,
  'll1-parser': Ll1Parser,
  'lr0-automaton': Lr0Automaton,
  'slr-parser': SlrParser,
  'clr-lalr-merge': ClrLalrMerge,

  // Unit III (4)
  'annotated-tree': AnnotatedTree,
  'dag-vs-tree': DagVsTree,
  'tac-formats': TacFormats,
  'backpatch-stepper': BackpatchStepper,

  // Unit IV (5)
  'activation-stack': ActivationStack,
  'param-passing-lab': ParamPassingLab,
  'basic-block-finder': BasicBlockFinder,
  'codegen-stepper': CodegenStepper,
  'ershov-labeler': ErshovLabeler,

  // Unit V (4)
  'optimization-gallery': OptimizationGallery,
  'peephole-lab': PeepholeLab,
  'dag-builder': DagBuilder,
  'reaching-defs': ReachingDefs,

  // Revision (1)
  'flashcards': Flashcards,
};

export function registerWidget(id: string, component: React.ComponentType<any>) {
  WIDGET_REGISTRY[id] = component;
}

export function WidgetPlaceholder({ id }: { id: string }) {
  return (
    <div className="my-8 p-8 rounded-[var(--r-lg)] border-2 border-dashed border-[var(--border)] bg-[var(--surface-2)]/50 text-center not-prose">
      <div className="inline-block px-3 py-1 rounded-[var(--r-sm)] bg-[var(--surface)] border border-[var(--border)] font-mono text-xs text-[var(--accent)] mb-2">
        &#123;&#123;widget:{id}&#125;&#125;
      </div>
      <p className="text-xs text-[var(--text-muted)] m-0">
        Interactive Visual: {id}
      </p>
    </div>
  );
}
