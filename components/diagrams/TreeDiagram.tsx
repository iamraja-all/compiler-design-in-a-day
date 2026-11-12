'use client';

import React from 'react';

export interface TreeNodeData {
  id?: string;
  label: string;
  annotation?: string; // e.g. "val=15" or "[1]"
  note?: string;
  shared?: boolean;
  highlight?: boolean;
  children?: TreeNodeData[];
}

export interface TreeDiagramProps {
  title?: string;
  ariaLabel: string;
  tree?: TreeNodeData;
  trees?: {
    caption?: string;
    badge?: string;
    badgeVariant?: 'success' | 'danger' | 'default';
    tree: TreeNodeData;
  }[];
  headerInfo?: string;
  isDag?: boolean;
}

export function TreeDiagram({
  title,
  ariaLabel,
  tree,
  trees,
  headerInfo,
  isDag = false,
}: TreeDiagramProps) {
  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      className="my-6 p-4 sm:p-6 rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] not-prose overflow-x-auto shadow-xs"
    >
      {title && (
        <div className="text-xs font-mono font-semibold tracking-wider uppercase text-[var(--accent)] mb-3">
          {title}
        </div>
      )}

      {headerInfo && (
        <div className="p-2.5 mb-4 rounded-[var(--r-sm)] bg-[var(--surface-2)] border border-[var(--border)] font-mono text-xs text-[var(--text)]">
          {headerInfo}
        </div>
      )}

      {trees && trees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trees.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] flex flex-col items-center"
            >
              {t.caption && (
                <div className="flex items-center gap-2 mb-4 font-mono text-xs">
                  {t.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-[var(--r-sm)] font-semibold text-[11px] ${
                        t.badgeVariant === 'success'
                          ? 'bg-[var(--success)]/20 text-[var(--success)] border border-[var(--success)]/30'
                          : t.badgeVariant === 'danger'
                          ? 'bg-[var(--danger)]/20 text-[var(--danger)] border border-[var(--danger)]/30'
                          : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]'
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                  <span className="font-semibold text-[var(--text)]">{t.caption}</span>
                </div>
              )}
              <div className="w-full flex justify-center overflow-x-auto py-2">
                <RenderTreeNode node={t.tree} isRoot isDag={isDag} />
              </div>
            </div>
          ))}
        </div>
      ) : tree ? (
        <div className="w-full flex justify-center overflow-x-auto py-2">
          <RenderTreeNode node={tree} isRoot isDag={isDag} />
        </div>
      ) : null}
    </figure>
  );
}

function RenderTreeNode({
  node,
  isRoot = false,
  isDag = false,
}: {
  node: TreeNodeData;
  isRoot?: boolean;
  isDag?: boolean;
}) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node Pill */}
      <div
        className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs sm:text-sm font-mono transition-all z-10 shadow-xs ${
          node.shared
            ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] ring-2 ring-[var(--accent)]/30 font-bold'
            : node.highlight
            ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)] font-bold'
            : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]'
        }`}
      >
        <span>{node.label}</span>
        {node.annotation && (
          <span className="px-1.5 py-0.2 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] text-[10px] font-bold border border-[var(--accent)]/30">
            {node.annotation}
          </span>
        )}
        {node.note && (
          <span className="text-[10px] text-[var(--text-muted)] font-normal ml-0.5">
            ({node.note})
          </span>
        )}
      </div>

      {/* Children branches */}
      {hasChildren && (
        <div className="relative flex flex-col items-center mt-2 w-full">
          {/* Vertical stem from parent */}
          <div className="w-0.5 h-3 bg-[var(--border)]" />

          {/* Children container */}
          <div className="relative flex justify-center gap-4 sm:gap-6 pt-2">
            {/* Horizontal connector across siblings if more than 1 child */}
            {node.children!.length > 1 && (
              <div
                className="absolute top-0 h-0.5 bg-[var(--border)]"
                style={{
                  left: `calc(100% / ${node.children!.length * 2})`,
                  right: `calc(100% / ${node.children!.length * 2})`,
                }}
              />
            )}

            {node.children!.map((child, idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                {/* Vertical drop to child */}
                <div className="w-0.5 h-2 bg-[var(--border)]" />
                <RenderTreeNode node={child} isDag={isDag} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
