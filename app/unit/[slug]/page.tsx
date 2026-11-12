import { notFound } from 'next/navigation';
import { UNITS, getUnitData } from '@/lib/content';
import { MarkdownRenderer } from '@/components/content/MarkdownRenderer';
import { SectionDoneCheck } from '@/components/content/SectionDoneCheck';
import { PrevNextUnit } from '@/components/layout/PrevNextUnit';
import { Clock, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export async function generateStaticParams() {
  return UNITS.map((unit) => ({
    slug: unit.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const unit = getUnitData(slug);
  if (!unit) return {};

  return {
    title: `${unit.pageTitle} — Compiler Design in a Day`,
    description: `Anna University B.E. CSE Semester V (24CS5501) study guide for ${unit.unitTitle}.`,
  };
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const unit = getUnitData(slug);

  if (!unit) {
    notFound();
  }

  return (
    <article className="reading-column max-w-[68ch] mx-auto px-4 sm:px-6 py-12 pb-24">
      {/* Unit Header Badge & Meta */}
      <header className="mb-12 pb-8 border-b border-[var(--border)] not-prose">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--accent)] font-semibold mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{unit.unitTitle}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-4 leading-tight">
          {unit.pageTitle}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-muted)] pt-2">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[var(--warning)]" />
            <span>~{unit.totalMinutes} min study time</span>
          </span>
          <span className="text-[var(--border)]" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{unit.totalWidgets} interactive visuals</span>
          </span>
          {unit.totalChecks > 0 && (
            <>
              <span className="text-[var(--border)]" aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" />
                <span>{unit.totalChecks} exam checkpoints</span>
              </span>
            </>
          )}
        </div>
      </header>

      {/* Sections */}
      <div className="space-y-16">
        {unit.sections.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="content-section pt-4 scroll-mt-20"
          >
            <div className="mb-6 flex items-baseline justify-between border-b border-[var(--border)]/60 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] m-0">
                {section.title}
              </h2>
              <span className="text-xs font-mono text-[var(--text-muted)] shrink-0 ml-4">
                {section.estimatedMinutes} min
              </span>
            </div>

            <MarkdownRenderer content={section.content} />

            <SectionDoneCheck sectionId={section.id} sectionTitle={section.title} />
          </section>
        ))}
      </div>

      {/* Bottom Unit Pagination */}
      <PrevNextUnit currentSlug={unit.slug} />
    </article>
  );
}
