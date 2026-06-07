import { useState, useEffect } from 'react';
import { Evidence, StudentProfile } from '../types/evidence';
import { generateCareerInsightStreaming } from '../utils/aiInsights';
import styles from './AICareerInsight.module.css';

interface Props {
  evidence: Evidence[];
  profile: StudentProfile;
}

function getConfidence(evidenceCount: number): { label: string; color: string } {
  if (evidenceCount >= 5) return { label: 'High', color: 'var(--color-success)' };
  if (evidenceCount >= 3) return { label: 'Medium', color: 'var(--color-warning)' };
  return { label: 'Low', color: 'var(--color-danger)' };
}

export function AICareerInsight({ evidence, profile }: Props) {
  const [narrative, setNarrative] = useState('');
  const [keyGap, setKeyGap] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPromptInfo, setShowPromptInfo] = useState(false);

  const confidence = getConfidence(evidence.length);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setIsStreaming(true);
    setNarrative('');
    setKeyGap('');
    setNextStep('');

    generateCareerInsightStreaming(evidence, profile, (field, chunk) => {
      if (cancelled) return;
      if (field === 'narrative') setNarrative((p) => p + chunk);
      else if (field === 'keyGap') setKeyGap((p) => p + chunk);
      else if (field === 'nextStep') setNextStep((p) => p + chunk);
    })
      .then((result) => {
        if (!cancelled) {
          setNarrative(result.narrative);
          setKeyGap(result.keyGap);
          setNextStep(result.nextStep);
          setIsDemo(result.isDemo);
          setIsStreaming(false);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsStreaming(false);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [evidence, profile]);

  if (loading && !narrative) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>Career Intelligence</span>
          <span className={styles.badge}>AI-assisted explanation</span>
        </div>
        <div className={styles.skeleton}>
          <div className={styles.shimmer} style={{ width: '90%', height: '16px', marginBottom: '10px' }} />
          <div className={styles.shimmer} style={{ width: '75%', height: '16px', marginBottom: '10px' }} />
          <div className={styles.shimmer} style={{ width: '82%', height: '16px', marginBottom: '24px' }} />
          <div className={styles.shimmer} style={{ width: '60%', height: '14px', marginBottom: '8px' }} />
          <div className={styles.shimmer} style={{ width: '70%', height: '14px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} role="region" aria-label="AI-assisted career explanation">
      <div className={styles.header}>
        <span className={styles.title}>Career Intelligence</span>
        <div className={styles.headerRight}>
          <span
            className={styles.confidenceBadge}
            style={{ borderColor: confidence.color, color: confidence.color }}
            title={`Confidence based on ${evidence.length} evidence item${evidence.length !== 1 ? 's' : ''}`}
            aria-label={`AI confidence: ${confidence.label}, based on ${evidence.length} evidence item${evidence.length !== 1 ? 's' : ''}`}
          >
            Confidence: {confidence.label} · {evidence.length} item{evidence.length !== 1 ? 's' : ''}
          </span>
          <span className={styles.badge} aria-live="polite" aria-label={isStreaming ? 'AI is generating explanation' : 'AI explanation ready'}>
            AI-assisted explanation {isStreaming ? '•' : ''}
          </span>
        </div>
      </div>

      {narrative && (
        <div className={styles.narrative} aria-live="polite" aria-atomic="false">
          <p>{narrative}</p>
        </div>
      )}

      {keyGap && (
        <div className={styles.blocks}>
          <div className={styles.block} role="note" aria-label="Key focus area">
            <div className={styles.blockLabel}>Key Focus Area</div>
            <div className={styles.blockContent} aria-live="polite">{keyGap}</div>
          </div>

          {nextStep && (
            <div className={`${styles.block} ${styles.blockAction}`} role="note" aria-label="Recommended next step">
              <div className={styles.blockLabel}>Recommended Next Step</div>
              <div className={styles.blockContent} aria-live="polite">{nextStep}</div>
            </div>
          )}
        </div>
      )}

      {!isStreaming && keyGap && nextStep && (
        <>
          <div className={styles.footer}>
            {isDemo
              ? 'Demo insight · transparent evidence extraction + AI-assisted explanation'
              : 'transparent evidence extraction + AI-assisted explanation'}
            {' · '}
            <button
              className={styles.howLink}
              onClick={() => setShowPromptInfo((v) => !v)}
            >
              {showPromptInfo ? 'Hide' : 'How this AI works'}
            </button>
          </div>

          {showPromptInfo && (
            <div className={styles.promptInfo}>
              <p className={styles.promptInfoTitle}>AI Transparency</p>
              <ul className={styles.promptInfoList}>
                <li><strong>Model:</strong> claude-haiku-4-5 (Anthropic), used for narrative explanation only</li>
                <li><strong>Inputs used:</strong> evidence titles, descriptions, technologies, outcomes, and target role</li>
                <li><strong>Prompt approach:</strong> structured JSON for narrative, key gap, and next step</li>
                <li><strong>What AI does not decide:</strong> readiness score, extracted skill, matched phrase, or university intervention priority</li>
                <li><strong>What it does not have:</strong> grades, real job market APIs, actual code, or verified outcomes beyond entered evidence</li>
                <li><strong>Fallback:</strong> if the API is unavailable, deterministic rule-based insight runs in the same format</li>
                <li><strong>Limitations:</strong> this is not "AI predicts your career." It explains the evidence trail already shown on the page.</li>
              </ul>
              <p className={styles.promptInfoNote}>
                Confidence is <em>{confidence.label.toLowerCase()}</em> because you have {evidence.length} evidence item{evidence.length !== 1 ? 's' : ''}.
                {evidence.length < 5 && ' Add more evidence for a higher-confidence explanation.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
