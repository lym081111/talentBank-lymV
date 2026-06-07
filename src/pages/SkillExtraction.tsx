import { Evidence, ExtractedSkill } from '../types/evidence';
import { SkillExtractionCard } from '../components/SkillExtractionCard';
import { SkillsByDemandVisualization } from '../components/SkillsByDemandVisualization';
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
  // const uniqueSkillNames = Array.from(skillCounts.keys());
  // const highDemandCount = uniqueSkillNames.filter((name) => {
  //   const entry = skillTaxonomy.find((s) => s.name === name);
  //   return entry?.demand === 'high';
  // }).length;

  // Market intelligence: alignment score + missing high-demand skills
  const marketInsights = generateMarketInsights(extractedSkills);
  const skillsByCategory = categorizeSkills(extractedSkills);
  const totalHighDemand = skillTaxonomy.filter(s => s.demand === 'high').length;
  const marketAlignmentPct = Math.round((marketInsights.highDemandSkillsCount / totalHighDemand) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>Lens Scan: Skill Signals Found</h2>
          <p>Transparent evidence extraction + AI-assisted explanation. PathLens shows the extracted skill, evidence source, matched phrase, and confidence before any readiness score is calculated.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}>
          {[
            ['Evidence scanned', evidence.length.toString(), 'Proof Passport blocks read'],
            ['Skill signals', extractedSkills.length.toString(), 'Each one cites a source phrase'],
            ['High confidence', extractedSkills.filter((s) => s.confidence === 'high').length.toString(), 'Strong phrase-level match'],
            ['Mapped next', '6 dimensions', 'Readiness, blockers, sprint'],
          ].map(([label, value, body]) => (
            <div key={label} style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                {label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--color-text)', marginBottom: '4px' }}>{value}</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{body}</p>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard} style={{ gridColumn: '1 / -1' }}>
            <div className={styles.summaryValue}>{skillCounts.size}</div>
            <div className={styles.summaryLabel}>Unique Signals Identified</div>
            <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              These are traceable skill signals, not keywords copied from a resume summary.
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
            <div className={styles.summaryLabel}>Medium Confidence Signals</div>
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

        {/* Grouped Skills by Demand */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>
            Skill Signals Organized by Market Value
          </h3>
          <SkillsByDemandVisualization extractedSkills={extractedSkills} />
        </div>

        {/* Evidence breakdown - visual cards */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '24px',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
            📋 Skills by Evidence Item
          </h3>
          <div className={styles.extractionCards}>
            {evidence.map((item) => (
              <SkillExtractionCard key={item.id} evidence={item} extractedSkills={extractedSkills} />
            ))}
          </div>
        </div>

        {/* Next step - visual card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent-light) 100%)',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>
            Ready to Open Your Career Signal Map?
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            The scan now maps into 6 readiness dimensions: <strong>Technical Depth</strong> • <strong>Portfolio Strength</strong> • <strong>Work Readiness</strong> • <strong>Communication</strong> • <strong>Production Mindset</strong> • <strong>Role Fit</strong>
          </p>
          <button className={styles.continueButton} onClick={onContinue}>
            Open Career Signal Map
          </button>
        </div>
      </div>
    </div>
  );
}
