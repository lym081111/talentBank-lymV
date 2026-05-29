import { Dimension } from '../types/evidence';

interface Props {
  dimension: Dimension;
  index: number;
}

export function DimensionScoreGauge({ dimension, index }: Props) {
  const score = dimension.score;
  const getGaugeColor = () => {
    if (score >= 75) return 'var(--color-success)';
    if (score >= 55) return 'var(--color-accent)';
    if (score >= 30) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const getStatusEmoji = () => {
    if (score >= 75) return '✅';
    if (score >= 55) return '📈';
    if (score >= 30) return '⚠️';
    return '🔧';
  };

  const getDimensionIcon = (dim: string) => {
    switch (dim) {
      case 'Technical Depth': return '🔧';
      case 'Portfolio Strength': return '📂';
      case 'Work Readiness': return '💼';
      case 'Communication': return '💬';
      case 'Production Mindset': return '⚙️';
      case 'Role Fit': return '🎯';
      default: return '📊';
    }
  };

  const percentFill = (score / 100) * 100;

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top header with dimension name and score */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span>{getDimensionIcon(dimension.dimension)}</span>
            {dimension.dimension}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            marginTop: '4px',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.03em',
          }}>
            {dimension.status}
          </div>
        </div>
        <div style={{
          fontSize: '28px',
          fontWeight: '900',
          background: `linear-gradient(135deg, ${getGaugeColor()} 0%, var(--color-primary) 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {score}
        </div>
      </div>

      {/* Visual progress bar */}
      <div style={{
        width: '100%',
        height: '8px',
        background: 'var(--color-bg)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '16px',
      }}>
        <div style={{
          height: '100%',
          width: `${percentFill}%`,
          background: getGaugeColor(),
          borderRadius: '4px',
          transition: 'width 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        }} />
      </div>

      {/* Target indicator */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: 'var(--color-text-muted)',
        fontWeight: '600',
      }}>
        <span>0</span>
        <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>Target: 75+</span>
        <span>100</span>
      </div>

      {/* Key strength */}
      {dimension.topStrengths && dimension.topStrengths.length > 0 && (
        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--color-border)',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
        }}>
          <div style={{ fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>
            ✨ Strength
          </div>
          <div>{dimension.topStrengths[0]}</div>
        </div>
      )}

      {/* Improvement area */}
      {dimension.improvementAreas && dimension.improvementAreas.length > 0 && (
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
        }}>
          <div style={{ fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>
            💡 Next Focus
          </div>
          <div>{dimension.improvementAreas[0]}</div>
        </div>
      )}
    </div>
  );
}
