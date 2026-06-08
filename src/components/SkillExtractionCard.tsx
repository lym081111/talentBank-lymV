import { ExtractedSkill, Evidence } from '../types/evidence';
import { skillTaxonomy } from '../data/skillTaxonomy';
import styles from './SkillExtractionCard.module.css';

interface Props {
  evidence: Evidence;
  extractedSkills: ExtractedSkill[];
}

const DEMAND_CONFIG = {
  high: { label: 'High demand', className: 'demandHigh' },
  medium: { label: 'Growing', className: 'demandMedium' },
  low: { label: 'Niche', className: 'demandLow' },
} as const;

function getSkillDemand(skillName: string): 'high' | 'medium' | 'low' {
  const entry = skillTaxonomy.find((s) => s.name === skillName);
  return entry?.demand ?? 'medium';
}

export function SkillExtractionCard({ evidence, extractedSkills }: Props) {
  const evidenceSkills = extractedSkills.filter((s) => s.sourceEvidenceId === evidence.id);

  const typeLabels: Record<string, string> = {
    fyp: 'Final Year Project',
    internship: 'Internship',
    portfolio: 'Portfolio',
    certificate: 'Certificate',
    hackathon: 'Hackathon',
  };

  return (
    <article className={styles.card} aria-label={`${typeLabels[evidence.type]}: ${evidence.title} - ${evidenceSkills.length} skills extracted`}>
      <div className={styles.header}>
        <h4>{evidence.title}</h4>
        <span className={styles.badge} aria-label={`Type: ${typeLabels[evidence.type]}`}>{typeLabels[evidence.type]}</span>
      </div>

      {evidenceSkills.length > 0 ? (
        <div className={styles.skills} role="list" aria-label={`Skills from ${evidence.title}`}>
          {evidenceSkills.map((skill, idx) => {
            const demand = getSkillDemand(skill.skill);
            const demandCfg = DEMAND_CONFIG[demand];

            return (
              <div key={idx} className={styles.skill} role="listitem">
                <div className={styles.skillTop}>
                  <div>
                    <div className={styles.fieldLabel}>Extracted skill</div>
                    <div className={styles.skillName}>{skill.skill}</div>
                  </div>
                  <span
                    className={`${styles.demandBadge} ${styles[demandCfg.className]}`}
                    title={`Market demand: ${demandCfg.label}`}
                    aria-label={`Market demand: ${demandCfg.label}`}
                  >
                    {demandCfg.label}
                  </span>
                </div>

                <div className={styles.skillSource}>
                  <span className={styles.fieldLabel}>Evidence source</span>
                  <strong>{evidence.title}</strong>
                </div>

                <div className={styles.skillConfidence} aria-label={`Confidence: ${skill.confidence}`}>
                  <span className={styles.fieldLabel}>Confidence</span>
                  {skill.confidence === 'high' && <span className={styles.high}>High confidence</span>}
                  {skill.confidence === 'medium' && <span className={styles.medium}>Medium confidence</span>}
                  {skill.confidence === 'low' && <span className={styles.low}>Low confidence</span>}
                </div>

                <div className={styles.skillPhrase} aria-label={`Evidence phrase: ${skill.sourcePhrase}`}>
                  <span className={styles.fieldLabel}>Matched phrase</span>
                  <em>"{skill.sourcePhrase}"</em>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty} aria-live="polite">No skills extracted from this evidence.</div>
      )}
    </article>
  );
}
