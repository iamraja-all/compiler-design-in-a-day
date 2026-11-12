import React from 'react';

interface StateNodeProps {
  id: string | number;
  x: number;
  y: number;
  label?: string | number;
  sublabel?: string;
  isAccepting?: boolean;
  isCurrent?: boolean;
  isVisited?: boolean;
  radius?: number;
}

export function StateNode({
  id,
  x,
  y,
  label = id,
  sublabel,
  isAccepting = false,
  isCurrent = false,
  isVisited = false,
  radius = 24,
}: StateNodeProps) {
  return (
    <g
      className={`state-node cursor-default transition-all duration-200 ${
        isCurrent ? 'scale-105' : ''
      }`}
      transform-origin={`${x} ${y}`}
    >
      {/* Outer accepting ring */}
      {isAccepting && (
        <circle
          cx={x}
          cy={y}
          r={radius + 4}
          fill="none"
          stroke={isCurrent ? 'var(--accent)' : 'var(--success)'}
          strokeWidth="2"
        />
      )}

      {/* Main node circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={
          isCurrent
            ? 'var(--accent-soft)'
            : isVisited
            ? 'var(--surface)'
            : 'var(--surface-2)'
        }
        stroke={
          isCurrent
            ? 'var(--accent)'
            : isAccepting
            ? 'var(--success)'
            : isVisited
            ? 'var(--text-muted)'
            : 'var(--border)'
        }
        strokeWidth={isCurrent ? '2.5' : '1.5'}
        className="transition-colors duration-200"
      />

      {/* Current indicator marker */}
      {isCurrent && (
        <polygon
          points={`${x - 4},${y - radius - 10} ${x + 4},${y - radius - 10} ${x},${y - radius - 3}`}
          fill="var(--accent)"
        />
      )}

      {/* Label */}
      <text
        x={x}
        y={sublabel ? y - 2 : y + 4}
        textAnchor="middle"
        className={`font-mono select-none font-bold text-sm ${
          isCurrent ? 'fill-[var(--accent)]' : 'fill-[var(--text)]'
        }`}
      >
        {label}
      </text>

      {/* Sublabel */}
      {sublabel && (
        <text
          x={x}
          y={y + 12}
          textAnchor="middle"
          className="font-mono select-none text-[10px] fill-[var(--text-muted)]"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  isCurved?: boolean;
  curveOffset?: number; // positive = curves down, negative = curves up
  isSelfLoop?: boolean;
  isEpsilon?: boolean;
  isCurrent?: boolean;
  nodeRadius?: number;
}

export function Edge({
  x1,
  y1,
  x2,
  y2,
  label,
  isCurved = false,
  curveOffset = 40,
  isSelfLoop = false,
  isEpsilon = false,
  isCurrent = false,
  nodeRadius = 24,
}: EdgeProps) {
  const strokeColor = isCurrent ? 'var(--accent)' : 'var(--border)';
  const textColor = isCurrent ? 'var(--accent)' : 'var(--text)';
  const strokeWidth = isCurrent ? 2 : 1.5;

  // Self loop
  if (isSelfLoop) {
    const loopHeight = 35;
    const path = `M ${x1 - 10} ${y1 - nodeRadius} C ${x1 - 25} ${y1 - nodeRadius - loopHeight}, ${x1 + 25} ${y1 - nodeRadius - loopHeight}, ${x1 + 10} ${y1 - nodeRadius}`;
    return (
      <g className="transition-all duration-200">
        <path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={isEpsilon ? '4,4' : undefined}
          markerEnd={isCurrent ? 'url(#arrow-accent)' : 'url(#arrow-default)'}
        />
        {label && (
          <text
            x={x1}
            y={y1 - nodeRadius - loopHeight + 2}
            textAnchor="middle"
            className="font-mono text-xs font-semibold fill-[var(--text)] select-none bg-[var(--surface-2)]"
          >
            {label}
          </text>
        )}
      </g>
    );
  }

  // Calculate angle and start/end points outside circle radius
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist === 0) return null;

  const ux = dx / dist;
  const uy = dy / dist;

  const sx = x1 + ux * nodeRadius;
  const sy = y1 + uy * nodeRadius;
  const ex = x2 - ux * (nodeRadius + 4); // gap for arrowhead
  const ey = y2 - uy * (nodeRadius + 4);

  let pathD = `M ${sx} ${sy} L ${ex} ${ey}`;
  let labelX = (sx + ex) / 2;
  let labelY = (sy + ey) / 2 - 8;

  if (isCurved) {
    const mx = (sx + ex) / 2;
    const my = (sy + ey) / 2;
    // Perpendicular vector
    const px = -uy * curveOffset;
    const py = ux * curveOffset;
    const cx = mx + px;
    const cy = my + py;
    pathD = `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;
    labelX = mx + px * 0.7;
    labelY = my + py * 0.7 - 4;
  }

  return (
    <g className="transition-all duration-200">
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={isEpsilon ? '4,4' : undefined}
        markerEnd={isCurrent ? 'url(#arrow-accent)' : 'url(#arrow-default)'}
      />
      {label && (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          className="font-mono text-xs font-semibold select-none"
          fill={textColor}
        >
          {isEpsilon && !label ? 'ε' : label}
        </text>
      )}
    </g>
  );
}

export function StartArrow({ x, y, nodeRadius = 24 }: { x: number; y: number; nodeRadius?: number }) {
  const startX = x - nodeRadius - 30;
  const endX = x - nodeRadius - 4;
  return (
    <g>
      <line
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke="var(--accent)"
        strokeWidth="2"
        markerEnd="url(#arrow-accent)"
      />
      <text
        x={startX - 6}
        y={y + 3}
        textAnchor="end"
        className="font-mono text-[10px] font-bold fill-[var(--accent)] uppercase select-none"
      >
        Start
      </text>
    </g>
  );
}

export function SvgArrowDefs() {
  return (
    <defs>
      <marker
        id="arrow-default"
        viewBox="0 0 10 10"
        refX="7"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--border)" />
      </marker>
      <marker
        id="arrow-accent"
        viewBox="0 0 10 10"
        refX="7"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--accent)" />
      </marker>
      <marker
        id="arrow-success"
        viewBox="0 0 10 10"
        refX="7"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--success)" />
      </marker>
    </defs>
  );
}
