import Anthropic from '@anthropic-ai/sdk';
import { Evidence, StudentProfile } from '../types/evidence';

export interface CareerInsight {
  narrative: string;
  keyGap: string;
  nextStep: string;
  isDemo: boolean;
}

// Pre-generated insights for demo personas — instant load for judges, no API latency
export const DEMO_INSIGHTS = {
  'Priya Sharma': {
    narrative:
      "Priya has built a rare senior-level profile — 4+ years of compounding evidence from SWE intern at Grab through to Senior SWE leading 40+ microservices for 8M+ daily users. Her system design mastery (Raft consensus, distributed ledgers, 99.99% uptime SLA) is the exact inflection point that drives SGD 15,000/month compensation in Singapore's market. The landscape from here is Staff Engineer or engineering management — both paths require cross-org influence evidence she is already accumulating.",
    keyGap:
      "Cross-Organisation Leadership — while Priya owns critical platform systems, her evidence shows team-of-2 management. Staff Engineer trajectory at Grab/SEA unicorns typically requires evidence of influencing 3+ teams on architectural decisions, not just owning them.",
    nextStep:
      "Document one RFC (Request for Comments) process you led or contributed to — write a 1-page case study showing the technical trade-off, who you aligned, and the outcome. This single artifact is the most common differentiator between Senior SWE and Staff Engineer candidates in Singapore.",
  } as CareerInsight,
  'Kai Chen': {
    narrative:
      "Kai has executed a textbook analyst-to-engineer transition — DBS Bank SQL foundation → ByteDance real-time pipeline architecture serving 500M events/day. His sub-second latency expertise and Kafka/Flink mastery place him in the top 5% of data engineers in Southeast Asia where this skill combination has 15% YoY demand growth. The landscape ahead has two clear forks: Staff Data Engineer (deeper infrastructure ownership) or Data Engineering Manager (team scaling and platform strategy).",
    keyGap:
      "ML Platform Integration — Kai's pipelines feed recommendation systems but his evidence shows limited ownership of the ML training/serving interface. Data engineering roles at ByteDance's next level (L6+) expect pipeline engineers who can own feature stores and model serving infrastructure.",
    nextStep:
      "Build a feature store prototype connecting one of your existing Kafka pipelines to a simple ML model serving endpoint. Document the latency trade-offs and consistency guarantees. This closes the pipeline-to-ML gap that separates senior data engineers from staff-level platform engineers.",
  } as CareerInsight,
  'Aisha Patel': {
    narrative:
      "Aisha has built a high-conviction PM profile across three market tiers — Flipkart analyst foundation, Amazon India product ownership (8% conversion uplift = INR 5Cr+ impact), and Lazada cross-border marketplace launch (100K+ sellers, INR 500Cr GMV run rate). Her geographic expansion expertise is rare in Asia's PM market where most candidates lack multi-country launch evidence. The landscape ahead is Group PM or Director of Product roles focused on international expansion.",
    keyGap:
      "Technical PM Depth — Aisha's evidence shows strong market analysis and stakeholder management but limited evidence of technical architecture involvement. Senior/Group PM roles at SEA unicorns (Grab, Shopee, GoTo) increasingly expect PMs who can engage meaningfully in system design trade-off discussions.",
    nextStep:
      "Write a 1-page technical deep-dive on one architectural decision from the Lazada cross-border platform — pick one: data consistency across 4 markets, seller onboarding API design, or GMV calculation methodology. Publishing this on LinkedIn positions you as a technical PM and opens Group PM roles that most product managers cannot access.",
  } as CareerInsight,
};

export const PRIYA_SHARMA_DEMO_INSIGHT = DEMO_INSIGHTS['Priya Sharma'];

// Rule-based fallback when API is unavailable
function generateFallbackInsight(
  evidence: Evidence[],
  profile: StudentProfile
): CareerInsight {
  const evidenceCount = evidence.length;
  const hasInternship = evidence.some((e) => e.type === 'internship');
  const hasPortfolio = evidence.some((e) => e.type === 'portfolio');
  const combinedText = evidence.map((e) => e.description || '').join(' ').toLowerCase();
  const hasProduction = /test|ci\/cd|deploy|docker|monitoring/.test(combinedText);

  let narrative = '';
  let keyGap = '';
  let nextStep = '';

  if (evidenceCount >= 4 && hasInternship) {
    narrative = `${profile.name} has a well-rounded profile with ${evidenceCount} evidence items including real internship experience — a strong signal for hiring managers in Asia's tech market. The evidence shows practical project delivery and some exposure to real-world engineering environments.`;
  } else if (evidenceCount >= 3) {
    narrative = `${profile.name} has ${evidenceCount} evidence items demonstrating active learning and project delivery. The portfolio shows initiative and technical range, which is valued across Southeast Asia's growing tech sector.`;
  } else {
    narrative = `${profile.name} is building their career foundation with ${evidenceCount} evidence item${evidenceCount !== 1 ? 's' : ''}. Early-stage portfolios with focused, well-documented projects stand out to internship hiring managers across Asia.`;
  }

  if (!hasProduction) {
    keyGap =
      'Production Practices — no evidence of automated testing, CI/CD, or deployment workflows. This is the most common gap between strong students and those who get internship offers at tech companies.';
    nextStep =
      'Add a simple GitHub Actions workflow to one existing project: run tests on every push to main. This demonstrates production mindset and takes under 3 hours to set up.';
  } else if (!hasPortfolio) {
    keyGap =
      'Portfolio Evidence — limited public-facing project work. Hiring managers in Asia increasingly check GitHub and live demos before interviews.';
    nextStep =
      'Deploy one existing project to a live URL (Vercel or Railway) and write a clear README with a demo link. A live project is worth 10x a zip file.';
  } else {
    keyGap = `Communication & Documentation — project descriptions could be more specific about your individual contributions, the technical decisions you made, and the measurable outcomes achieved.`;
    nextStep =
      'Rewrite one project description using the format: "Built X using Y, which resulted in Z." Include a specific metric (e.g., "reduced load time by 40%", "processed 200+ requests/day").';
  }

  return { narrative, keyGap, nextStep, isDemo: false };
}

export async function generateCareerInsight(
  evidence: Evidence[],
  profile: StudentProfile
): Promise<CareerInsight> {
  // Instant demo for judges — no API call needed
  const demoInsight = DEMO_INSIGHTS[profile.name as keyof typeof DEMO_INSIGHTS];
  if (demoInsight) {
    return { ...demoInsight, isDemo: true };
  }

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return generateFallbackInsight(evidence, profile);
  }

  try {
    // API key is client-side for hackathon demo.
    // Production: proxy through a Vercel Edge Function to keep the key server-side.
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const evidenceSummary = evidence
      .map(
        (e) =>
          `- ${e.type.toUpperCase()}: "${e.title}"${e.link ? ` (${e.link})` : ''}
   Description: ${e.description || 'No description'}
   Technologies: ${e.technologies || 'Not specified'}`
      )
      .join('\n');

    const prompt = `You are a career intelligence system for Asia's tech job market. Analyse this student's career evidence and provide a realistic navigation insight — NOT a prediction, but a landscape description showing where they realistically stand and what paths exist.

Student Profile:
- Name: ${profile.name}
- University: ${(profile as any).university || 'Not specified'}
- Year: ${profile.year}
- Major: ${profile.major}
- Target Role: ${profile.targetRole}

Evidence (${evidence.length} items):
${evidenceSummary}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "narrative": "2-3 sentences describing where this student realistically stands in the career landscape based on their actual evidence. Reference specific evidence items. Frame as navigation — what the landscape looks like from here — not as a grade or prediction. Include Asia tech market context where relevant.",
  "keyGap": "The single most important specific gap for this student given their evidence and target role. Be specific — name the exact skill or practice that is missing from their evidence.",
  "nextStep": "One concrete, immediately actionable next step that directly addresses the key gap. Reference a specific project or evidence item if possible. Include a realistic time estimate."
}`;

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const parsed = JSON.parse(text);

    return {
      narrative: parsed.narrative || '',
      keyGap: parsed.keyGap || '',
      nextStep: parsed.nextStep || '',
      isDemo: false,
    };
  } catch {
    return generateFallbackInsight(evidence, profile);
  }
}

// Streaming version for live token-by-token rendering
export async function generateCareerInsightStreaming(
  evidence: Evidence[],
  profile: StudentProfile,
  onStream: (field: 'narrative' | 'keyGap' | 'nextStep', chunk: string) => void
): Promise<CareerInsight> {
  // Instant demo for judges — use pre-generated with simulated streaming effect
  const demoInsight = DEMO_INSIGHTS[profile.name as keyof typeof DEMO_INSIGHTS];
  if (demoInsight) {
    // Simulate streaming for demo (faster for judges, more impressive)
    const speedMs = 8; // ms per token
    for (const char of demoInsight.narrative) {
      await new Promise((r) => setTimeout(r, speedMs));
      onStream('narrative', char);
    }
    await new Promise((r) => setTimeout(r, 200));
    for (const char of demoInsight.keyGap) {
      await new Promise((r) => setTimeout(r, speedMs));
      onStream('keyGap', char);
    }
    await new Promise((r) => setTimeout(r, 200));
    for (const char of demoInsight.nextStep) {
      await new Promise((r) => setTimeout(r, speedMs));
      onStream('nextStep', char);
    }
    return { ...demoInsight, isDemo: true };
  }

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    const fallback = generateFallbackInsight(evidence, profile);
    // Simulate streaming effect for fallback too
    for (const char of fallback.narrative) {
      onStream('narrative', char);
      await new Promise((r) => setTimeout(r, 3));
    }
    for (const char of fallback.keyGap) {
      onStream('keyGap', char);
      await new Promise((r) => setTimeout(r, 3));
    }
    for (const char of fallback.nextStep) {
      onStream('nextStep', char);
      await new Promise((r) => setTimeout(r, 3));
    }
    return fallback;
  }

  try {
    const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

    const evidenceSummary = evidence
      .map(
        (e) =>
          `- ${e.type.toUpperCase()}: "${e.title}"${e.link ? ` (${e.link})` : ''}
   Description: ${e.description || 'No description'}
   Technologies: ${e.technologies || 'Not specified'}`
      )
      .join('\n');

    const prompt = `You are a career intelligence system for Asia's tech job market. Analyse this student's career evidence and provide a realistic navigation insight — NOT a prediction, but a landscape description showing where they realistically stand and what paths exist.

Student Profile:
- Name: ${profile.name}
- University: ${(profile as any).university || 'Not specified'}
- Year: ${profile.year}
- Major: ${profile.major}
- Target Role: ${profile.targetRole}

Evidence (${evidence.length} items):
${evidenceSummary}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "narrative": "2-3 sentences describing where this student realistically stands in the career landscape based on their actual evidence. Reference specific evidence items. Frame as navigation — what the landscape looks like from here — not as a grade or prediction. Include Asia tech market context where relevant.",
  "keyGap": "The single most important specific gap for this student given their evidence and target role. Be specific — name the exact skill or practice that is missing from their evidence.",
  "nextStep": "One concrete, immediately actionable next step that directly addresses the key gap. Reference a specific project or evidence item if possible. Include a realistic time estimate."
}`;

    let fullText = '';
    // Track how many chars of each field we've already streamed
    const streamed = { narrative: 0, keyGap: 0, nextStep: 0 };

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        fullText += chunk.delta.text;

        // Extract and stream each field incrementally from partial JSON
        const fields: Array<['narrative' | 'keyGap' | 'nextStep', RegExp]> = [
          ['narrative', /"narrative"\s*:\s*"((?:[^"\\]|\\.)*)(?:"|$)/],
          ['keyGap', /"keyGap"\s*:\s*"((?:[^"\\]|\\.)*)(?:"|$)/],
          ['nextStep', /"nextStep"\s*:\s*"((?:[^"\\]|\\.)*)(?:"|$)/],
        ];

        for (const [field, regex] of fields) {
          const match = fullText.match(regex);
          if (match) {
            const raw = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            const newContent = raw.slice(streamed[field]);
            if (newContent) {
              onStream(field, newContent);
              streamed[field] = raw.length;
            }
          }
        }
      }
    }

    const parsed = JSON.parse(fullText);
    return {
      narrative: parsed.narrative || '',
      keyGap: parsed.keyGap || '',
      nextStep: parsed.nextStep || '',
      isDemo: false,
    };
  } catch {
    const fallback = generateFallbackInsight(evidence, profile);
    for (const char of fallback.narrative) {
      onStream('narrative', char);
    }
    for (const char of fallback.keyGap) {
      onStream('keyGap', char);
    }
    for (const char of fallback.nextStep) {
      onStream('nextStep', char);
    }
    return fallback;
  }
}
