'use client';

import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Callout, CheckCallout, CalloutType } from './Callout';
import { CodeBlock } from './CodeBlock';
import { DataTable, TableHead, TableRow, TableCell } from './DataTable';
import { WIDGET_REGISTRY, WidgetPlaceholder } from '@/components/widgets';
import { DIAGRAM_OVERRIDES } from '@/lib/diagram-overrides';
import { DiagramWrapper } from '@/components/diagrams/DiagramWrapper';

interface MarkdownRendererProps {
  content: string;
  fileSlug?: string;
  startTextIndex?: number;
}

export function MarkdownRenderer({
  content,
  fileSlug,
  startTextIndex = 1,
}: MarkdownRendererProps) {
  // Split content by {{widget:ID}} lines so widgets are top-level block elements
  const parts: { type: 'markdown' | 'widget'; value: string }[] = [];
  const lines = content.split(/\r?\n/);
  let currentMd: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const widgetMatch = trimmed.match(/^\{\{widget:([a-zA-Z0-9_-]+)\}\}$/);
    if (widgetMatch) {
      if (currentMd.length > 0) {
        parts.push({ type: 'markdown', value: currentMd.join('\n') });
        currentMd = [];
      }
      parts.push({ type: 'widget', value: widgetMatch[1] });
    } else {
      currentMd.push(line);
    }
  }
  if (currentMd.length > 0) {
    parts.push({ type: 'markdown', value: currentMd.join('\n') });
  }

  // Ref to track text block counting sequentially across chunks within this section
  const textCounterRef = useRef<number>(startTextIndex);
  // Reset counter when startTextIndex changes
  textCounterRef.current = startTextIndex;

  return (
    <div className="markdown-body space-y-6 text-[var(--text)]">
      {parts.map((part, index) => {
        if (part.type === 'widget') {
          const WidgetComponent = WIDGET_REGISTRY[part.value];
          return WidgetComponent ? (
            <div key={`w-${index}`} className="my-8">
              <WidgetComponent />
            </div>
          ) : (
            <WidgetPlaceholder key={`w-${index}`} id={part.value} />
          );
        }

        return (
          <MarkdownChunk
            key={`md-${index}`}
            markdown={part.value}
            fileSlug={fileSlug}
            textCounterRef={textCounterRef}
          />
        );
      })}
    </div>
  );
}

function MarkdownChunk({
  markdown,
  fileSlug,
  textCounterRef,
}: {
  markdown: string;
  fileSlug?: string;
  textCounterRef: React.MutableRefObject<number>;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)] mt-8 mb-4">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] mt-10 mb-4">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)] mt-8 mb-3">
            {children}
          </h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base sm:text-lg font-semibold text-[var(--text)] mt-6 mb-2">
            {children}
          </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-[1.0625rem] leading-[1.75] text-[var(--text)] mb-4">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc pl-6 space-y-2 mb-5 text-[1.0625rem] leading-[1.75] text-[var(--text)]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 space-y-2 mb-5 text-[1.0625rem] leading-[1.75] text-[var(--text)]">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,

        // Blockquotes & Callouts
        blockquote: ({ children }) => {
          const elements = React.Children.toArray(children).filter(
            (c) => typeof c !== 'string' || c.trim() !== ''
          );
          const firstChild = elements[0];

          if (
            React.isValidElement<{ children?: React.ReactNode }>(firstChild) &&
            firstChild.props &&
            firstChild.props.children
          ) {
            const pChildren = React.Children.toArray(firstChild.props.children);
            const firstText = typeof pChildren[0] === 'string' ? pChildren[0] : '';
            const match = firstText.match(
              /^\[!(KEY|ANALOGY|EXAM|TRAP|RECIPE|CHECK)\]\s*\n?/
            );

            if (match) {
              const type = match[1] as CalloutType;

              // Check yourself callout
              if (type === 'CHECK') {
                let foundAnswer = false;
                const qParts: React.ReactNode[] = [];
                const aParts: React.ReactNode[] = [];

                for (let i = 0; i < pChildren.length; i++) {
                  const item = pChildren[i];
                  if (i === 0) {
                    const cleanText = (item as string).replace(/^\[!CHECK\]\s*\n?/, '');
                    if (cleanText) qParts.push(cleanText);
                    continue;
                  }

                  if (React.isValidElement<{ children?: React.ReactNode }>(item) && item.type === 'strong') {
                    const strongText = React.Children.toArray(item.props.children).join('');
                    if (strongText.startsWith('Answer')) {
                      foundAnswer = true;
                      continue;
                    }
                  }

                  if (foundAnswer) {
                    aParts.push(item);
                  } else {
                    qParts.push(item);
                  }
                }

                // If there were subsequent paragraphs in the blockquote, they belong to the answer
                if (elements.length > 1) {
                  for (let i = 1; i < elements.length; i++) {
                    aParts.push(elements[i]);
                  }
                }

                return (
                  <CheckCallout
                    question={<>{qParts}</>}
                    answer={<>{aParts}</>}
                  />
                );
              }

              // Standard callouts: KEY, ANALOGY, EXAM, TRAP, RECIPE
              const cleanFirstText = firstText.replace(
                /^\[!(KEY|ANALOGY|EXAM|TRAP|RECIPE)\]\s*\n?/,
                ''
              );
              const remainingPChildren = [cleanFirstText, ...pChildren.slice(1)];
              const modifiedFirstP = React.cloneElement(
                firstChild as React.ReactElement<{ children: React.ReactNode }>,
                {},
                remainingPChildren
              );

              return (
                <Callout type={type}>
                  {modifiedFirstP}
                  {elements.slice(1)}
                </Callout>
              );
            }
          }

          return (
            <blockquote className="my-6 pl-4 border-l-3 border-[var(--border)] italic text-[var(--text-muted)]">
              {children}
            </blockquote>
          );
        },

        // Tables
        table: ({ children }) => <DataTable>{children}</DataTable>,
        thead: ({ children }) => <TableHead>{children}</TableHead>,
        tr: ({ children }) => <TableRow>{children}</TableRow>,
        th: ({ children }) => <TableCell isHeader>{children}</TableCell>,
        td: ({ children }) => {
          return <TableCell>{children}</TableCell>;
        },

        // Code and Fences
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match && !String(children).includes('\n');

          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[0.88em] text-[var(--accent)] font-medium"
                {...props}
              >
                {children}
              </code>
            );
          }

          const lang = match ? match[1] : '';
          const value = String(children).replace(/\n$/, '');

          // Check for diagram replacement on text code blocks
          if (lang === 'text') {
            const currentN = textCounterRef.current++;
            const blockId = fileSlug ? `${fileSlug}#${currentN}` : undefined;

            if (blockId && DIAGRAM_OVERRIDES[blockId]) {
              const DiagramComponent = DIAGRAM_OVERRIDES[blockId];
              return (
                <DiagramWrapper blockId={blockId} originalText={value}>
                  {DiagramComponent(value)}
                </DiagramWrapper>
              );
            }
          }

          return <CodeBlock language={lang} value={value} />;
        },

        // Horizontal rule
        hr: () => <hr className="my-10 border-[var(--border)]" />,

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-[var(--accent)] hover:underline font-medium underline-offset-3"
          >
            {children}
          </a>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
