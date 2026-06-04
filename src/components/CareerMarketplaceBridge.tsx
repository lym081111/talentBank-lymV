import { ReadinessProfile } from '../types/evidence';

interface Props {
  profile: ReadinessProfile;
}

export function CareerMarketplaceBridge({ profile }: Props) {
  const score = profile.overall;

  const getMatchTier = () => {
    if (score >= 75) return { label: 'Active Candidate', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.4)', emoji: '🟢' };
    if (score >= 55) return { label: 'Developing Candidate', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.4)', emoji: '🟡' };
    return { label: 'Building Profile', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.4)', emoji: '🔴' };
  };

  const tier = getMatchTier();

  const employerSignals = [
    {
      icon: '🏢',
      company: 'Tech Unicorns (Grab, Shopee, GoTo)',
      requirement: '75+ score · 3+ evidence items · Production practices',
      match: score >= 75,
    },
    {
      icon: '🏦',
      company: 'MNCs & GLCs (DBS, Maybank, TM)',
      requirement: '60+ score · Internship evidence · Communication score',
      match: score >= 60,
    },
    {
      icon: '🚀',
      company: 'Startups & Scale-ups',
      requirement: '50+ score · Portfolio evidence · Any stack',
      match: score >= 50,
    },
    {
      icon: '🎓',
      company: 'Graduate Programs',
      requirement: '45+ score · University year 3–4',
      match: score >= 45,
    },
  ];

  const topSkills = profile.dimensions
    .filter(d => d.score >= 60)
    .slice(0, 3)
    .map(d => d.dimension);

  const gaps = profile.dimensions
    .filter(d => d.score < 55)
    .slice(0, 2)
    .map(d => d.dimension);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      borderRadius: '16px',
      padding: '28px',
      marginBottom: '32px',
      border: '1px solid rgba(30, 64, 175, 0.4)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            🌏 Career OS · Marketplace Bridge
          </div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'white', letterSpacing: '-0.3px' }}>
            Your Market Visibility
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
            How employers in Asia's Career OS would see your profile right now
          </p>
        </div>
        <div style={{
          background: tier.bg,
          border: `1px solid ${tier.border}`,
          borderRadius: '50px',
          padding: '8px 16px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span>{tier.emoji}</span>
          <span style={{ fontSize: '13px', fontWeight: '800', color: tier.color }}>{tier.label}</span>
        </div>
      </div>

      {/* Score + signals grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {/* Readiness score */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Readiness Score
          </div>
          <div style={{ fontSize: '36px', fontWeight: '900', color: tier.color, lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>/100 · {profile.level}</div>
        </div>

        {/* Strong dimensions */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Your Strengths
          </div>
          {topSkills.length > 0 ? topSkills.map(s => (
            <div key={s} style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginBottom: '3px' }}>✓ {s}</div>
          )) : (
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Add more evidence to reveal strengths</div>
          )}
        </div>
      </div>

      {/* Employer match table */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Employer Match Status · 10,000+ Active Employers in Network
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          {employerSignals.map((employer) => (
            <div key={employer.company} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: employer.match ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${employer.match ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '8px', padding: '10px 14px',
            }}>
              <span style={{ fontSize: '16px' }}>{employer.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: employer.match ? 'white' : 'rgba(255,255,255,0.4)' }}>
                  {employer.company}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                  {employer.requirement}
                </div>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '20px', whiteSpace: 'nowrap',
                background: employer.match ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                color: employer.match ? '#10b981' : 'rgba(255,255,255,0.3)',
              }}>
                {employer.match ? '✓ Visible' : '○ Not yet'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps to unlock next tier */}
      {gaps.length > 0 && (
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '10px', padding: '14px 16px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            🎯 Close These Gaps to Unlock Next Employer Tier
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {gaps.map(g => (
              <span key={g} style={{
                fontSize: '12px', fontWeight: '700', padding: '4px 12px',
                background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                borderRadius: '20px', border: '1px solid rgba(245,158,11,0.3)',
              }}>
                ↑ {g}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
