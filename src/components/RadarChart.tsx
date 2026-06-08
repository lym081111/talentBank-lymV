import { useMemo } from 'react';
import { DimensionScore } from '../types/evidence';

interface Props {
  dimensions: DimensionScore[];
}

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const MAX_R = 110;

// 6 axes, starting from top (-90°), going clockwise
function getPoint(index: number, total: number, radius: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  };
}

function polygonPoints(values: number[], maxVal: number) {
  return values
    .map((v, i) => {
      const r = (v / maxVal) * MAX_R;
      const p = getPoint(i, values.length, r);
      return `${p.x},${p.y}`;
    })
    .join(' ');
}

const DIMENSION_LABELS: Record<string, string> = {
  'Technical Skills': 'Technical',
  'Portfolio Evidence': 'Portfolio',
  'Work Readiness': 'Work Ready',
  'Communication & Documentation': 'Comms',
  'Production Practices': 'Production',
  'Role-Specific Fit (Software Engineer)': 'Role Fit',
};

const STATUS_COLORS: Record<string, string> = {
  Strong: 'var(--color-success)',
  'Internship-Ready': 'var(--color-primary)',
  Developing: 'var(--color-warning)',
  Emerging: 'var(--color-danger)',
};

export function RadarChart({ dimensions }: Props) {
  const n = dimensions.length;
  const rings = [20, 40, 60, 80, 100];

  const dataPoints = useMemo(
    () => polygonPoints(dimensions.map((d) => d.score), 100),
    [dimensions]
  );

  const ringPolygons = useMemo(
    () =>
      rings.map((r) =>
        Array.from({ length: n }, (_, i) => getPoint(i, n, (r / 100) * MAX_R))
          .map((p) => `${p.x},${p.y}`)
          .join(' ')
      ),
    [n]
  );

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h3
        style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          fontWeight: '700',
          color: 'var(--color-text)',
          textAlign: 'center',
        }}
      >
        📡 Readiness Radar
      </h3>

      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ overflow: 'visible', maxWidth: '100%' }}
        aria-label="Radar chart of 6 readiness dimensions"
      >
        {/* Reference rings */}
        {ringPolygons.map((pts, ri) => (
          <polygon
            key={ri}
            points={pts}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={ri === rings.length - 1 ? 1.5 : 1}
            strokeDasharray={ri === rings.length - 1 ? 'none' : '3,3'}
            opacity={0.6}
          />
        ))}

        {/* Axis lines */}
        {Array.from({ length: n }, (_, i) => {
          const outer = getPoint(i, n, MAX_R);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--color-border)"
              strokeWidth={1}
              opacity={0.5}
            />
          );
        })}

        {/* Ring labels (20, 40, 60, 80, 100) — on the first axis */}
        {rings.map((val, ri) => {
          const p = getPoint(0, n, (val / 100) * MAX_R);
          return (
            <text
              key={ri}
              x={p.x + 4}
              y={p.y - 2}
              fontSize={9}
              fill="var(--color-text-muted)"
              opacity={0.7}
            >
              {val}
            </text>
          );
        })}

        {/* Data polygon */}
        <polygon
          points={dataPoints}
          fill="var(--color-primary-light)"
          stroke="var(--color-primary)"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dimensions.map((d, i) => {
          const r = (d.score / 100) * MAX_R;
          const p = getPoint(i, n, r);
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={5}
              fill={STATUS_COLORS[d.status] || 'var(--color-primary)'}
              stroke="white"
              strokeWidth={2}
            >
              <title>{d.dimension}: {d.score}/100</title>
            </circle>
          );
        })}

        {/* Axis labels */}
        {dimensions.map((d, i) => {
          const labelR = MAX_R + 22;
          const p = getPoint(i, n, labelR);
          const label = DIMENSION_LABELS[d.dimension] || d.dimension;
          const isLeft = p.x < CX - 5;
          const isRight = p.x > CX + 5;

          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor={isLeft ? 'end' : isRight ? 'start' : 'middle'}
              dominantBaseline="middle"
              fontSize={11}
              fontWeight="600"
              fill="var(--color-text)"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Legend — score pills */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginTop: '16px',
          width: '100%',
          maxWidth: `${SIZE}px`,
        }}
      >
        {dimensions.map((d) => (
          <div
            key={d.dimension}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              padding: '5px 8px',
              border: '1px solid var(--color-border)',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: STATUS_COLORS[d.status] || 'var(--color-primary)',
                flexShrink: 0,
              }}
            />
            <span style={{ color: 'var(--color-text-secondary)', flex: 1, minWidth: 0 }}>
              {DIMENSION_LABELS[d.dimension] || d.dimension}
            </span>
            <strong style={{ color: 'var(--color-text)', flexShrink: 0 }}>{d.score}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
