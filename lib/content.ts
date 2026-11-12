import fs from 'fs';
import path from 'path';
import { UNITS, UnitMeta, slugify } from './units';

export * from './units';

export interface Section {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  widgetCount: number;
  estimatedMinutes: number;
  textBlockOffset: number;
}

export interface CheckQuestionItem {
  id: string;
  unitSlug: string;
  unitTitle: string;
  question: string;
  answer: string;
}

export interface UnitData {
  slug: string;
  file: string;
  unitNumber: number; // 0 to 6
  unitTitle: string; // "Unit I · Lexical Analysis"
  pageTitle: string; // from # heading
  sections: Section[];
  totalWords: number;
  totalMinutes: number;
  totalWidgets: number;
  totalChecks: number;
  checkQuestions: CheckQuestionItem[];
}

export function parseCheckQuestions(markdown: string, unitSlug: string, unitTitle: string): CheckQuestionItem[] {
  const items: CheckQuestionItem[] = [];
  const lines = markdown.split(/\r?\n/);
  let inCheck = false;
  let questionLines: string[] = [];
  let answerLines: string[] = [];
  let inAnswer = false;
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('> [!CHECK]')) {
      if (inCheck && questionLines.length > 0) {
        items.push({
          id: `${unitSlug}-q${count++}`,
          unitSlug,
          unitTitle,
          question: questionLines.join('\n').trim(),
          answer: answerLines.join('\n').trim(),
        });
      }
      inCheck = true;
      inAnswer = false;
      questionLines = [];
      answerLines = [];
      continue;
    }

    if (inCheck) {
      if (line.startsWith('>')) {
        const stripped = line.replace(/^>\s?/, '');
        if (stripped.startsWith('**Answer:**') || stripped.startsWith('**Answer**:')) {
          inAnswer = true;
          answerLines.push(stripped.replace(/^\*\*Answer:\*\*|\*\*Answer\*\*:/, '').trim());
        } else if (inAnswer) {
          answerLines.push(stripped);
        } else {
          questionLines.push(stripped);
        }
      } else {
        items.push({
          id: `${unitSlug}-q${count++}`,
          unitSlug,
          unitTitle,
          question: questionLines.join('\n').trim(),
          answer: answerLines.join('\n').trim(),
        });
        inCheck = false;
        inAnswer = false;
        questionLines = [];
        answerLines = [];
      }
    }
  }

  if (inCheck && questionLines.length > 0) {
    items.push({
      id: `${unitSlug}-q${count++}`,
      unitSlug,
      unitTitle,
      question: questionLines.join('\n').trim(),
      answer: answerLines.join('\n').trim(),
    });
  }

  return items;
}

export function getUnitData(slug: string): UnitData | null {
  const meta = UNITS.find((u) => u.slug === slug);
  if (!meta) return null;

  const filePath = path.join(process.cwd(), 'content', meta.file);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.split(/\r?\n/);

  let pageTitle = meta.title;
  for (const line of lines) {
    if (line.startsWith('# ')) {
      pageTitle = line.replace(/^#\s+/, '').trim();
      break;
    }
  }

  const sections: Section[] = [];
  let currentTitle = '';
  let currentLines: string[] = [];
  let runningTextBlockCount = 0;

  const countTextBlocks = (linesArr: string[]) => {
    let count = 0;
    let inCode = false;
    let lang = '';
    for (const l of linesArr) {
      if (!inCode && l.startsWith('```')) {
        inCode = true;
        lang = l.slice(3).trim();
      } else if (inCode && l.startsWith('```')) {
        inCode = false;
        if (lang === 'text') count++;
      }
    }
    return count;
  };

  const flushSection = () => {
    if (currentTitle || currentLines.length > 0) {
      const sectionText = currentLines.join('\n');
      const words = sectionText.trim().split(/\s+/).filter(Boolean).length;
      const widgetMatches = sectionText.match(/\{\{widget:[^}]+\}\}/g) || [];
      const widgetCount = widgetMatches.length;
      const estimatedMinutes = Math.max(1, Math.ceil(words / 200 + widgetCount * 2));
      const textBlockOffset = runningTextBlockCount + 1;
      const blockCount = countTextBlocks(currentLines);
      runningTextBlockCount += blockCount;

      sections.push({
        id: slugify(currentTitle || 'intro'),
        title: currentTitle || 'Overview',
        content: sectionText,
        wordCount: words,
        widgetCount,
        estimatedMinutes,
        textBlockOffset,
      });
    }
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushSection();
      currentTitle = line.replace(/^##\s+/, '').trim();
      currentLines = [];
    } else if (line.startsWith('# ') && !currentTitle) {
      continue;
    } else {
      currentLines.push(line);
    }
  }
  flushSection();

  const totalWords = sections.reduce((acc, s) => acc + s.wordCount, 0);
  const totalMinutes = sections.reduce((acc, s) => acc + s.estimatedMinutes, 0);
  const totalWidgets = sections.reduce((acc, s) => acc + s.widgetCount, 0);
  const checkQuestions = parseCheckQuestions(raw, meta.slug, meta.title);

  return {
    slug: meta.slug,
    file: meta.file,
    unitNumber: meta.number,
    unitTitle: meta.title,
    pageTitle,
    sections,
    totalWords,
    totalMinutes,
    totalWidgets,
    totalChecks: checkQuestions.length,
    checkQuestions,
  };
}

export function getAllUnits(): UnitData[] {
  return UNITS.map((u) => getUnitData(u.slug)!).filter(Boolean);
}

export function getAllCheckQuestions(): CheckQuestionItem[] {
  const units = getAllUnits();
  return units.flatMap((u) => u.checkQuestions);
}
