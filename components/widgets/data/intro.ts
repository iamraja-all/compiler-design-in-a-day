export interface PipelineStage {
  step: number;
  name: string;
  unit: string;
  say: string;
  outputType: 'input' | 'tokens' | 'tree' | 'ir' | 'codegen' | 'opt';
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: 0,
    name: 'Source Input',
    unit: 'Character Stream',
    say: "The computer starts with just a row of characters. It doesn't know what any of them mean yet.",
    outputType: 'input',
  },
  {
    step: 1,
    name: 'Scanner (Lexer)',
    unit: 'Unit I · Lexical Analysis',
    say: 'The scanner groups characters into words called tokens, and notes each name in the symbol table.',
    outputType: 'tokens',
  },
  {
    step: 2,
    name: 'Parser',
    unit: 'Unit II · Syntax Analysis',
    say: "The parser checks the grammar and builds a tree. * sits deeper, so it happens first.",
    outputType: 'tree',
  },
  {
    step: 3,
    name: 'Semantic & IR',
    unit: 'Unit III · SDT & TAC',
    say: 'After checking types, the line becomes baby steps with at most one operation each.',
    outputType: 'ir',
  },
  {
    step: 4,
    name: 'Code Generator',
    unit: 'Unit IV · Target Code',
    say: 'The compiler picks memory and registers, then writes machine-style instructions.',
    outputType: 'codegen',
  },
  {
    step: 5,
    name: 'Optimizer',
    unit: 'Unit V · Code Optimization',
    say: 'The optimizer removes waste: multiplication becomes cheaper addition, and the extra temp disappears.',
    outputType: 'opt',
  },
];
