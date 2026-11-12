'use client';

import React from 'react';
import { StateNode, Edge, StartArrow, SvgArrowDefs } from '@/components/widgets/shared/SvgPrimitives';

export interface AutomatonNode {
  id: string | number;
  x: number;
  y: number;
  label?: string | number;
  sublabel?: string;
  isAccepting?: boolean;
  retract?: boolean;
  returnToken?: string;
}

export interface AutomatonEdge {
  from: string | number;
  to: string | number;
  label?: string;
  isCurved?: boolean;
  curveOffset?: number;
  isSelfLoop?: boolean;
  isEpsilon?: boolean;
}

export interface AutomatonDiagramProps {
  title?: string;
  ariaLabel: string;
  viewBox?: string;
  startNodeId?: string | number;
  nodes?: AutomatonNode[];
  edges?: AutomatonEdge[];
  legend?: string;
  subLegend?: string;
  subMachines?: {
    caption: string;
    viewBox?: string;
    startNodeId?: string | number;
    nodes: AutomatonNode[];
    edges: AutomatonEdge[];
  }[];
}

export function AutomatonDiagram({
  title,
  ariaLabel,
  viewBox = '0 0 600 240',
  startNodeId,
  nodes = [],
  edges = [],
  legend,
  subLegend,
  subMachines,
}: AutomatonDiagramProps) {
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

      {subMachines && subMachines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subMachines.map((sm, idx) => (
            <div
              key={idx}
              className="p-3 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--surface-2)] flex flex-col items-center"
            >
              <div className="text-xs font-mono font-bold text-[var(--accent)] mb-2">
                {sm.caption}
              </div>
              <div className="w-full aspect-[4/3] flex items-center justify-center">
                <SingleAutomatonSvg
                  viewBox={sm.viewBox || '0 0 280 180'}
                  startNodeId={sm.startNodeId}
                  nodes={sm.nodes}
                  edges={sm.edges}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="w-full flex justify-center py-2">
            <SingleAutomatonSvg
              viewBox={viewBox}
              startNodeId={startNodeId}
              nodes={nodes}
              edges={edges}
            />
          </div>
          {(legend || subLegend) && (
            <div className="mt-3 pt-3 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)]">
              {legend && <span>{legend}</span>}
              {subLegend && <span className="text-[var(--accent)] font-medium">{subLegend}</span>}
            </div>
          )}
        </div>
      )}
    </figure>
  );
}

function SingleAutomatonSvg({
  viewBox,
  startNodeId,
  nodes,
  edges,
}: {
  viewBox: string;
  startNodeId?: string | number;
  nodes: AutomatonNode[];
  edges: AutomatonEdge[];
}) {
  const nodeMap = new Map<string | number, AutomatonNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const startNode = startNodeId !== undefined ? nodeMap.get(startNodeId) : nodes[0];

  return (
    <svg
      viewBox={viewBox}
      className="w-full max-w-full h-auto select-none"
      style={{ overflow: 'visible' }}
    >
      <SvgArrowDefs />

      {/* Start arrow */}
      {startNode && <StartArrow x={startNode.x} y={startNode.y} />}

      {/* Edges */}
      {edges.map((edge, idx) => {
        const u = nodeMap.get(edge.from);
        const v = nodeMap.get(edge.to);
        if (!u || !v) return null;
        return (
          <Edge
            key={idx}
            x1={u.x}
            y1={u.y}
            x2={v.x}
            y2={v.y}
            label={edge.label}
            isCurved={edge.isCurved}
            curveOffset={edge.curveOffset}
            isSelfLoop={edge.isSelfLoop}
            isEpsilon={edge.isEpsilon}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => (
        <g key={node.id}>
          <StateNode
            id={node.id}
            x={node.x}
            y={node.y}
            label={node.label !== undefined ? node.label : node.id}
            sublabel={node.sublabel}
            isAccepting={node.isAccepting}
          />
          {node.retract && (
            <text
              x={node.x + 22}
              y={node.y - 12}
              className="font-mono text-[11px] font-bold fill-[var(--warning)]"
            >
              *
            </text>
          )}
          {node.returnToken && (
            <text
              x={node.x}
              y={node.y + 36}
              textAnchor="middle"
              className="font-mono text-[10px] font-semibold fill-[var(--accent)]"
            >
              {node.returnToken}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
