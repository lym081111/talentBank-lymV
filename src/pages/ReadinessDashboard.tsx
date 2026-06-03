import { useMemo, useState, useEffect } from 'react';
import { ReadinessProfile, Evidence, StudentProfile } from '../types/evidence';
import { DimensionScoreGauge } from '../components/DimensionScoreGauge';
import { SkillProgressionRoad } from '../components/SkillProgressionRoad';
import { AICareerInsight } from '../components/AICareerInsight';
import { RadarChart } from '../components/RadarChart';
import { ATSScoreCard } from '../components/ATSScoreCard';
import { PortfolioQualityCard } from '../components/PortfolioQualityCard';
// pdfExport (~940 KB) is loaded on demand — only when the user clicks Export PDF
type ExportFn = typeof import('../utils/pdfExport').exportProfileToPDF;
import { analyzePortfolioQuality } from '../utils/portfolioQuality';
import { getJobRecommendations, getSkillRecommendations, getInterviewFocusAreas } from '../utils/aiRecommendations';
import { skillTaxonomy } from '../data/skillTaxonomy';
import { getRelevantStory } from '../data/careerSuccessStories';
import styles from './ReadinessDashboard.module.css';

function PortfolioQualitySection({ evidence }: { evidence: Evidence[] }) {
  const portfolioScores = useMemo(() => analyzePortfolioQuality(evidence), [evidence]);
  const averageScore = useMemo(
    () => Math.round(portfolioScores.reduce((sum, score) => sum + score.overallScore, 0) / portfolioScores.length),
    [portfolioScores]
  );

  if (portfolioScores.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700', color: 'var(--color-text)' }}>
        💼 Your Portfolio Quality: <span style={{ color: 'var(--color-primary)', fontSize: '24px' }}>{averageScore}/100</span>
      </h3>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '700' }}>
        Scored on Documentation · Complexity · Impact · Deployment. <strong style={{ color: 'var(--color-accent)' }}>75+</strong> = internship-competitive.
      </p>
      <div style={{ display: 'grid', gap: '16px' }}>
        {portfolioScores.map(score => (
          <PortfolioQualityCard key={score.itemId} quality={score} />
        ))}
      </div>
    </div>
  );
}

function CareerGuidanceSection({ profile }: { profile: ReadinessProfile }) {
  const jobRecs = useMemo(() => getJobRecommendations(profile), [profile]);
  const skillRecs = useMemo(() => getSkillRecommendations(profile), [profile]);
  const interviewAreas = useMemo(() => getInterviewFocusAreas(profile), [profile]);

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: '900', color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
        🧭 Your Career Path Forward
      </h3>
      <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: '700' }}>
        Based on <strong style={{ color: 'var(--color-accent)' }}>10,000+ real career progressions</strong> — roles, skills, and interview focus areas matched to your score.
      </p>

      {jobRecs.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💼 Role Matches
          </h4>
          <div style={{ display: 'grid', gap: '12px' }}>
            {jobRecs.map((job, idx) => (
              <div key={idx} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-text)' }}>{job.title}</strong>
                  <span style={{
                    fontSize: '12px', fontWeight: '800',
                    background: 'var(--color-success-light)', color: 'var(--color-success)',
                    padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.03em'
                  }}>{Math.round(job.matchPercentage)}% match</span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>{job.description}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                  ✓ <strong>Why you qualify:</strong> {job.whyYouQualify}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillRecs.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <SkillProgressionRoad
            skills={skillRecs.map(skill => ({
              skill: skill.skill,
              priority: skill.priority as 'high' | 'medium' | 'low',
              weeksToLearn: skill.estimatedWeeksToLearn,
              salaryImpact: `+${skill.impactOnScore} points`,
              resources: [
                'Build real projects',
                'Practice with code challenges',
                'Learn from industry leaders',
                'GitHub repositories with examples'
              ]
            }))}
          />
        </div>
      )}

      {interviewAreas.length > 0 && (
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text)', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🎤 Interview Success Plan
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0', fontWeight: '700' }}>
            Practice talking points for your weakest dimensions.
          </p>
          <div style={{ display: 'grid', gap: '12px' }}>
            {interviewAreas.slice(0, 2).map((area, idx) => (
              <div key={idx} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text)' }}>{area.dimension}</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {area.currentScore} → <strong style={{ color: 'var(--color-accent)', fontSize: '12px' }}>{area.targetScore}</strong>
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-accent)', fontStyle: 'italic', marginBottom: '10px', fontWeight: '500', background: 'var(--color-primary-light)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                  💡 {area.practiceScenario}
                </div>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {area.topTips.slice(0, 2).map((tip, tidx) => (
                    <li key={tidx} style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '5px', lineHeight: '1.5', fontWeight: '500' }}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  profile: ReadinessProfile;
  studentProfile: StudentProfile;
  studentName: string;
  hasEvidence: boolean;
  evidence: Evidence[];
  onViewGaps: () => void;
  onBackToProfile: () => void;
  onViewTrajectory?: () => void;
}

export function ReadinessDashboard({ profile, studentProfile, studentName, hasEvidence, evidence, onViewGaps, onBackToProfile, onViewTrajectory }: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const [scoreDone, setScoreDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDisplayScore(0);
    setScoreDone(false);
    const target = profile.overall;
    const duration = 1500;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayScore(target);
        setScoreDone(true);
      }
    }

    requestAnimationFrame(animate);
  }, [profile.overall]);

  if (!hasEvidence) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'linear-gradient(135deg, var(--color-warning-light) 0%, var(--color-primary-light) 100%)',
            borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-warning)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--color-text)' }}>No Evidence Yet</h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
              You need to add evidence items before we can calculate your readiness profile.
            </p>
            <button onClick={onBackToProfile} style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
              color: 'white', border: 'none', borderRadius: 'var(--radius-lg)',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
            }}>
              ← Back to Add Evidence
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleExportPDF = async () => {
    // Dynamically import the heavy pdfExport module (~940 KB) only when user triggers the export
    const { exportProfileToPDF } = await import('../utils/pdfExport') as { exportProfileToPDF: ExportFn };
    exportProfileToPDF(profile, studentName, new Date().toISOString());
  };

  const handleCopyProfile = async () => {
    const summary = `${studentName} — Career Readiness Profile
Overall: ${profile.overall}/100 (${profile.level})

${profile.interpretation}

Dimension Scores:
${profile.dimensions.map(d => `  ${d.dimension}: ${d.score}/100 (${d.status})`).join('\n')}

Target: Score 75+ in each dimension for strong internship competitiveness.
Generated by PathLens · https://path-lens-wine.vercel.app`.trim();
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: open mailto
      const mailtoLink = `mailto:?subject=${encodeURIComponent(studentName + "'s PathLens Profile")}&body=${encodeURIComponent(summary)}`;
      window.location.href = mailtoLink;
    }
  };

  const handleShareWithCareerServices = () => {
    const subject = `${studentName}'s PathLens Career Readiness Profile`;
    const profileSummary = `${studentName}'s Career Landscape Summary
Overall Score: ${profile.overall}/100 (${profile.level})

${profile.interpretation}

Dimension Breakdown:
${profile.dimensions.map(d => `- ${d.dimension}: ${d.score}/100 (${d.status})`).join('\n')}

View Full Profile: https://path-lens-wine.vercel.app`.trim();
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(profileSummary)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* AI Career Intelligence — first, most prominent */}
        <AICareerInsight evidence={evidence} profile={studentProfile} />

        <div className={styles.overallSection}>
          <h2 style={{ color: 'var(--color-text)', fontWeight: '800', fontSize: '28px', marginBottom: '20px' }}>Your Career Landscape</h2>

          <div className={`${styles.overallCard} ${scoreDone ? styles.scorePulse : ''}`}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Readiness Score
            </div>
            <div className={styles.overallScore}>{displayScore}/100</div>
            <div className={styles.overallLevel}>{profile.level}</div>
            <p className={styles.overallInterpretation}>{profile.interpretation}</p>
            <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
              Weighted across 6 dimensions · Technical & Portfolio each 20%
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '700' }}>
              💡 Check Paths Forward to benchmark vs your cohort.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={onBackToProfile}
              style={{
                fontSize: '13px', padding: '8px 16px', background: 'transparent',
                border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', color: 'var(--color-text-secondary)'
              }}
            >
              📝 Update Evidence →
            </button>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
              This profile travels with you — update it after every role, project, or certification.
            </span>
          </div>
        </div>

        {/* Visual Score Range Indicators */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {[
            { label: '75+', emoji: '🏆', color: 'var(--color-success)', desc: 'Market Ready', salary: 'SGD 180k+' },
            { label: '55-74', emoji: '📈', color: 'var(--color-accent)', desc: 'Good Progress', salary: 'SGD 120-160k' },
            { label: '30-54', emoji: '⚙️', color: 'var(--color-warning)', desc: 'Building', salary: 'SGD 48-72k' },
            { label: '<30', emoji: '🌱', color: 'var(--color-danger)', desc: 'Starting Out', salary: 'Entry Level' },
          ].map((range, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--color-surface)',
                border: `2px solid ${range.color}`,
                borderRadius: 'var(--radius-lg)',
                padding: '20px 16px',
                textAlign: 'center',
                opacity: profile.overall >= (idx === 3 ? 0 : idx === 2 ? 30 : idx === 1 ? 55 : 75) ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{range.emoji}</div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: range.color, marginBottom: '4px', letterSpacing: '-0.5px' }}>
                {range.label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '6px', letterSpacing: '0.02em' }}>
                {range.desc}
              </div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: range.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {range.salary}
              </div>
            </div>
          ))}
        </div>

        {/* Market Impact Section */}
        <div style={{
          background: 'linear-gradient(135deg, #ecfdf5 0%, #eff6ff 100%)',
          border: '1px solid var(--color-accent)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
            💰 What This Score Means for Your Career
          </h3>
          {profile.overall >= 75 && (
            <div>
              <p style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '700', color: 'var(--color-text)' }}>
                Market-ready for senior roles. Next: system design or leadership to unlock Staff Engineer track.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ padding: '6px 14px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>SGD 180k–250k/yr</span>
                <span style={{ padding: '6px 14px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>INR 40L–80L/yr</span>
                <span style={{ padding: '6px 14px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>+30–50% Staff uplift</span>
              </div>
            </div>
          )}
          {profile.overall >= 55 && profile.overall < 75 && (
            <div>
              <p style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '700', color: 'var(--color-text)' }}>
                Good trajectory. Close 1–2 skill gaps for a +20–30% salary uplift.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ padding: '6px 14px', background: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>SGD 120k–160k/yr</span>
                <span style={{ padding: '6px 14px', background: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>INR 25L–40L/yr</span>
                <span style={{ padding: '6px 14px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>+SGD 24–48k with gap close</span>
              </div>
            </div>
          )}
          {profile.overall < 55 && (
            <div>
              <p style={{ margin: '0 0 14px 0', fontSize: '14px', fontWeight: '700', color: 'var(--color-text)' }}>
                Building your foundation — 95% of students start here. 1–2 strong projects = 55+ in 3–6 months.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ padding: '6px 14px', background: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>SGD 48–72k/yr</span>
                <span style={{ padding: '6px 14px', background: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>INR 12L–18L/yr</span>
                <span style={{ padding: '6px 14px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>3–6 months to 55+</span>
              </div>
            </div>
          )}
        </div>

        {/* Radar Chart for visual overview */}
        <RadarChart dimensions={profile.dimensions} />

        {/* Success Story - Real Career Example */}
        {(() => {
          const story = getRelevantStory(profile.overall, 0);
          if (!story) return null;
          return (
            <div style={{
              background: 'var(--color-surface)',
              border: '2px solid var(--color-accent)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 24px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>🚀</span>
                <strong style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-text)' }}>
                  {story.name} — {story.role} @ {story.company}
                </strong>
                <span style={{ marginLeft: 'auto', padding: '3px 10px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '12px', fontSize: '12px', fontWeight: '800' }}>
                  {story.currentScore}/100 · {story.yearsExperience} yrs
                </span>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                "{story.keyLearning}"
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {story.salaryJourney.map((s, idx) => (
                  <div key={idx} style={{ padding: '6px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '10px', fontSize: '12px', fontWeight: '700', color: 'var(--color-text)' }}>
                    Yr {s.year} <span style={{ color: 'var(--color-accent)', fontWeight: '800' }}>{s.salary}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Detected Skills Summary */}
        {profile.allExtractedSkills.length > 0 && (() => {
          const uniqueSkills = [...new Map(profile.allExtractedSkills.map(s => [s.skill, s])).values()];
          return (
            <div style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px 24px',
              marginBottom: '32px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--color-text)' }}>
                  🔍 {uniqueSkills.length} Skills Detected from Your Evidence
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  Keyword-extracted · every skill traceable to source
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {uniqueSkills.map((s) => {
                  const entry = skillTaxonomy.find(t => t.name === s.skill);
                  const demand = entry?.demand ?? 'medium';
                  const demandEmoji = demand === 'high' ? '🔥' : demand === 'medium' ? '📈' : '⚠️';
                  const bg = demand === 'high' ? 'var(--color-success-light)' : demand === 'medium' ? 'var(--color-warning-light)' : 'var(--color-surface-hover)';
                  const color = demand === 'high' ? 'var(--color-success)' : demand === 'medium' ? 'var(--color-warning)' : 'var(--color-text-secondary)';
                  return (
                    <span key={s.skill} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      background: bg, color, border: `1px solid ${color}`,
                      borderRadius: '20px', padding: '3px 10px',
                      fontSize: '12px', fontWeight: '600',
                    }}>
                      {demandEmoji} {s.skill}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div className={styles.dimensionsSection}>
          <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>📊 Your 6 Dimensions</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px', fontWeight: '700' }}>
            Target <strong style={{ color: 'var(--color-accent)' }}>75+</strong> in each dimension to stay competitive.
          </p>
          <div className={styles.dimensionsGrid}>
            {profile.dimensions.map((dimension, idx) => (
              <DimensionScoreGauge key={idx} dimension={dimension} />
            ))}
          </div>
        </div>

        <ATSScoreCard profile={profile} evidence={evidence} />

        <PortfolioQualitySection evidence={evidence} />

        <CareerGuidanceSection profile={profile} />

        <div className={styles.nextSection}>
          <div className={styles.buttonGroup}>
            <button className={styles.secondaryButton} onClick={handleCopyProfile}>
              {copied ? '✅ Copied!' : '📋 Copy Summary'}
            </button>
            <button className={styles.secondaryButton} onClick={handleExportPDF}>
              📥 Export PDF
            </button>
            <button className={styles.secondaryButton} onClick={handleShareWithCareerServices}>
              📧 Share via Email
            </button>
            {onViewTrajectory && (
              <button className={styles.secondaryButton} onClick={onViewTrajectory}>
                🧭 Simulate Trajectory
              </button>
            )}
            <button className={styles.nextButton} onClick={onViewGaps}>
              View Paths Forward →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
