import { Evidence, ExtractedSkill } from '../types/evidence';
import { SkillExtractionCard } from '../components/SkillExtractionCard';
import { skillTaxonomy } from '../data/skillTaxonomy';
import { generateMarketInsights, categorizeSkills } from '../utils/marketInsights';
import styles from './SkillExtraction.module.css';

interface Props {
  evidence: Evidence[];
  extractedSkills: ExtractedSkill[];
  onContinue: () => void;
}

export function SkillExtraction({ evidence, extractedSkills, onContinue }: Props) {
  const skillCounts = new Map<string, number>();
  for (const skill of extractedSkills) {
    skillCounts.set(skill.skill, (skillCounts.get(skill.skill) || 0) + 1);
  }

  // Count unique high-demand skills detected
  const uniqueSkillNames = Array.from(skillCounts.keys());
  const highDemandCount = uniqueSkillNames.filter((name) => {
    const entry = skillTaxonomy.find((s) => s.name === name);
    return entry?.demand === 'high';
  }).length;

  // Market intelligence: alignment score + missing high-demand skills
  const marketInsights = generateMarketInsights(extractedSkills);
  const skillsByCategory = categorizeSkills(extractedSkills);
  const totalHighDemand = skillTaxonomy.filter(s => s.demand === 'high').length;
  const marketAlignmentPct = Math.round((marketInsights.highDemandSkillsCount / totalHighDemand) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>We Found Your Skills</h2>
          <p>We analyzed your evidence and extracted the real skills you demonstrated. Here's the breakdown:</p>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard} style={{ gridColumn: '1 / -1' }}>
            <div className={styles.summaryValue}>{skillCounts.size}</div>
            <div className={styles.summaryLabel}>Unique Skills Identified</div>
            <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              You've demonstrated {skillCounts.size} distinct technical competencies across your evidence
            </p>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>
              {extractedSkills.filter((s) => s.confidence === 'high').length}
            </div>
            <div className={styles.summaryLabel}>High Confidence</div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryValue}>
              {extractedSkills.filter((s) => s.confidence === 'medium').length}
            </div>
            <div className={styles.summaryLabel}>Emerging Skills</div>
          </div>
        </div>

        {/* Market Alignment Panel */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent-light) 100%)',
          border: '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
                🌏 Asia Tech Market Alignment
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Based on {totalHighDemand} high-demand skills tracked for SE Asia tech hiring
              </div>
            </div>
            {/* Alignment gauge */}
            <div style={{ textAlign: 'center', minWidth: '72px' }}>
              <div style={{
                fontSize: '26px', fontWeight: '800',
                color: marketAlignmentPct >= 60 ? 'var(--color-success)' : marketAlignmentPct >= 35 ? 'var(--color-warning)' : 'var(--color-danger)',
              }}>
                {marketAlignmentPct}%
              </div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Aligned
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: '6px', background: 'var(--color-surface-hover)', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
            <div style={{
              height: '100%', borderRadius: '3px',
              width: `${marketAlignmentPct}%`,
              background: marketAlignmentPct >= 60 ? 'var(--color-success)' : marketAlignmentPct >= 35 ? 'var(--color-warning)' : 'var(--color-danger)',
              transition: 'width 0.6s ease',
            }} />
          </div>

          {/* Skill category breakdown */}
          {Object.keys(skillsByCategory).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {Object.entries(skillsByCategory).map(([cat, catSkills]) => (
                <span key={cat} style={{
                  fontSize: '11px', fontWeight: '700', padding: '3px 10px',
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: '12px', color: 'var(--color-text-secondary)',
                  textTransform: 'capitalize',
                }}>
                  {cat} · {catSkills.length}
                </span>
              ))}
            </div>
          )}

          {/* Missing high-demand skills */}
          {marketInsights.topSkillsToLearn.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                🎯 Top missing high-demand skills to boost your profile:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {marketInsights.topSkillsToLearn.slice(0, 4).map((skill) => (
                  <span key={skill} style={{
                    fontSize: '12px', padding: '4px 10px',
                    background: 'var(--color-warning-light)', color: 'var(--color-warning)',
                    border: '1px solid var(--color-warning)', borderRadius: '10px',
                    fontWeight: '600',
                  }}>
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Market recommendation */}
          <div style={{
            marginTop: '12px', padding: '10px 12px',
            background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
            fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.5',
          }}>
            {marketInsights.marketRecommendation}
          </div>
        </div>

        {highDemandCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--color-success-light)',
            border: '1px solid var(--color-success)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '13px',
          }}>
            <span style={{ fontSize: '18px' }}>🔥</span>
            <span>
              <strong style={{ color: 'var(--color-success)' }}>{highDemandCount} high-demand skill{highDemandCount !== 1 ? 's' : ''}</strong>
              {' '}detected — Python, React, Cloud, and similar skills are among the most requested by Asia tech employers right now.
              {highDemandCount >= 4 && ' Strong market alignment!'}
            </span>
          </div>
        )}

        <div className={styles.explanation}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Transparent extraction:</strong> Keyword-matched against our taxonomy. Every skill comes directly from your evidence.
          </p>
          <p style={{ margin: '0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Want to add more skills? Go back and add more detail to your evidence descriptions.
          </p>
        </div>

        <button className={styles.continueButton} onClick={onContinue} style={{ marginBottom: '24px' }}>
          See Your Readiness Score
        </button>

        <div className={styles.extractionCards}>
          {evidence.map((item) => (
            <SkillExtractionCard key={item.id} evidence={item} extractedSkills={extractedSkills} />
          ))}
        </div>

        <div className={styles.nextSteps}>
          <p>
            <strong>Next Step:</strong> These skills get mapped to 6 readiness dimensions that matter for internships: Technical Depth, Portfolio Strength, Work Readiness, Communication, Production Mindset, and Role Fit.
          </p>
          <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            💡 <strong>Tip:</strong> If you see skills missing, you can go back and add more detail to your evidence before continuing.
          </p>
        </div>
      </div>
    </div>
  );
}
