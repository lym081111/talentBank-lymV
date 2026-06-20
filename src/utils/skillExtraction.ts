import { Evidence, ExtractedSkill } from '../types/evidence';
import { skillTaxonomy } from '../data/skillTaxonomy';

/**
 * Extracts skills from a list of evidence items using keyword matching against
 * the PathLens skill taxonomy (34 skills, 120+ keywords across 6 categories).
 *
 * Each skill is deduplicated — only the highest-confidence match per skill is kept.
 * Confidence is determined by the specificity of the matching keyword:
 *   - Exact skill name → high
 *   - Specific technology keyword → medium
 *   - Generic/partial keyword → low
 *
 * @param evidence - Array of evidence items to scan
 * @returns Array of unique ExtractedSkill with source phrase for transparency
 */
export function extractSkillsFromEvidence(evidence: Evidence[]): ExtractedSkill[] {
  const skillMap = new Map<string, ExtractedSkill>();

  for (const item of evidence) {
    const text = `${item.title} ${item.description} ${item.technologies || ''}`.toLowerCase();

    for (const skill of skillTaxonomy) {
      for (const keyword of skill.keywords) {
        if (matchesKeyword(text, keyword)) {
          const sourcePhrase = extractSourcePhrase(item, keyword);
          const confidence = getConfidence(keyword);

          const key = `${skill.name}`;
          const existing = skillMap.get(key);

          // Keep the highest confidence match
          if (!existing || confidenceRank(confidence) > confidenceRank(existing.confidence)) {
            skillMap.set(key, {
              skill: skill.name,
              confidence,
              sourceEvidenceId: item.id,
              sourcePhrase,
            });
          }
        }
      }
    }
  }

  return Array.from(skillMap.values());
}

function extractSourcePhrase(evidence: Evidence, keyword: string): string {
  const combinedText = `${evidence.title} ${evidence.description} ${evidence.technologies || ''}`;
  const words = combinedText.split(/\s+/);
  const keywordTokens = normalizeForMatching(keyword).split(' ').filter(Boolean);

  for (let i = 0; i < words.length; i++) {
    if (matchesKeyword(words.slice(i, i + Math.max(1, keywordTokens.length)).join(' '), keyword)) {
      const start = Math.max(0, i - 2);
      const end = Math.min(words.length, i + Math.max(1, keywordTokens.length) + 2);
      return words.slice(start, end).join(' ');
    }
  }

  return keyword;
}

function matchesKeyword(text: string, keyword: string): boolean {
  const normalizedText = text.toLowerCase();
  const normalizedKeyword = keyword.toLowerCase().trim();

  if (normalizedKeyword === 'c++') {
    return /(^|[^a-z0-9])c\+\+([^a-z0-9]|$)/i.test(text);
  }

  if (/^[a-z0-9]+$/.test(normalizedKeyword)) {
    return new RegExp(`\\b${escapeRegExp(normalizedKeyword)}\\b`, 'i').test(text);
  }

  if (normalizedKeyword.startsWith('.')) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalizedKeyword)}([^a-z0-9]|$)`, 'i').test(text);
  }

  const textForMatching = normalizeForMatching(normalizedText);
  const keywordForMatching = normalizeForMatching(normalizedKeyword);

  if (!keywordForMatching) {
    return false;
  }

  return new RegExp(`(^|\\s)${escapeRegExp(keywordForMatching)}(?=\\s|$)`, 'i').test(textForMatching);
}

function normalizeForMatching(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getConfidence(keyword: string): 'high' | 'medium' | 'low' {
  if (keyword.includes(' ') || keyword.length > 6) {
    return 'high';
  }
  if (keyword.length <= 4) {
    return 'medium';
  }
  return 'high';
}

function confidenceRank(conf: 'high' | 'medium' | 'low'): number {
  return { high: 3, medium: 2, low: 1 }[conf];
}
