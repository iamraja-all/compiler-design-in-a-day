export interface UnitMeta {
  slug: string;
  title: string;
  file: string;
  number: number;
}

export const UNITS: UnitMeta[] = [
  { slug: '00-introduction', title: 'Introduction: The Big Picture', file: '00-introduction.md', number: 0 },
  { slug: '01-unit-1', title: 'Unit I · Lexical Analysis', file: '01-unit-1.md', number: 1 },
  { slug: '02-unit-2', title: 'Unit II · Syntax Analysis', file: '02-unit-2.md', number: 2 },
  { slug: '03-unit-3', title: 'Unit III · SDT & Intermediate Code', file: '03-unit-3.md', number: 3 },
  { slug: '04-unit-4', title: 'Unit IV · Run-Time & Code Generation', file: '04-unit-4.md', number: 4 },
  { slug: '05-unit-5', title: 'Unit V · Code Optimization', file: '05-unit-5.md', number: 5 },
  { slug: '06-revision', title: 'Final Revision Sheet', file: '06-revision.md', number: 6 },
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
