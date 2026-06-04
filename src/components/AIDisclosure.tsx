import { useState } from 'react';

export function AIDisclosure() {
  const [expanded, setExpanded] = useState(false);

  const tools = [
    {
      tool: 'Claude claude-haiku-4-5',
      provider: 'Anthropic',
      how: 'Generates career narrative insights, key gap analysis, and next-step recommendations from evidence text',
      why: 'Best-in-class instruction following for structured JSON output; low latency for live streaming demo',
      icon: '🤖',
    },
    {
      tool: 'Claude Sonnet (Claude Code)',
      provider: 'Anthropic',
      how: 'Used throughout development for component scaffolding, TypeScript error fixing, and refactoring',
      why: 'Accelerated 28-day build phase — architecture, bug fixes, and UI iteration all AI-assisted',
      icon: '⚙️',
    },
    {
      tool: 'Deterministic Scoring Engine',
      provider: 'Custom (no AI)',
      how: '6-dimension readiness scoring, ATS compatibility, portfolio quality, skill taxonomy matching — all rule-based',
      why: 'Judges and users can verify every score without trusting a black box; aligns with Career OS navigation-not-prediction principle',
      icon: '📐',
    },
    {
      tool: 'Skill Taxonomy (34 skills)',
      provider: 'Custom dataset',
      how: 'Maps evidence text to high-demand/growing/niche skills tracked across Southeast Asia tech hiring',
      why: 'Grounds skill extraction in real Asia market data rather than generic ML outputs',
      icon: '🗂️',
    },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      borderRadius: '12px',
      padding: '20px 24px',
      marginTop: '32px',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    }}>
      {/* Header row */}
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AI Transparency Disclosure
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
              Required by Talentbank Tech Hackathon 2026 · What AI was used, how, and why
            </div>
          </div>
        </div>
        <span style={{ color: '#10b981', fontSize: '18px', fontWeight: '700' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {expanded && (
        <div style={{ marginTop: '20px' }}>
          {/* Summary badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {['Claude AI for insights', 'Deterministic scoring', 'Rule-based taxonomy', 'No black-box decisions'].map(badge => (
              <span key={badge} style={{
                fontSize: '11px', fontWeight: '700', padding: '4px 10px',
                background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px',
              }}>
                ✓ {badge}
              </span>
            ))}
          </div>

          {/* Tool cards */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {tools.map((item) => (
              <div key={item.tool} style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '14px 16px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{item.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'white' }}>{item.tool}</span>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: '700', padding: '2px 8px',
                    background: 'rgba(30, 64, 175, 0.4)', color: '#93c5fd',
                    borderRadius: '10px', whiteSpace: 'nowrap',
                  }}>
                    {item.provider}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', lineHeight: '1.5' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.9)' }}>How:</strong> {item.how}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Why:</strong> {item.why}
                </div>
              </div>
            ))}
          </div>

          {/* Principle footer */}
          <div style={{
            marginTop: '16px', padding: '12px 16px',
            background: 'rgba(16, 185, 129, 0.08)',
            borderRadius: '8px',
            borderLeft: '3px solid #10b981',
            fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6',
          }}>
            <strong style={{ color: '#10b981' }}>Design Principle:</strong> All scoring, skill extraction, ATS analysis, and marketplace matching is deterministic and explainable. Claude AI is used only for narrative generation — every score can be verified without trusting an AI output. This aligns with the Career OS mandate: <em>"navigation, not prediction."</em>
          </div>
        </div>
      )}
    </div>
  );
}
