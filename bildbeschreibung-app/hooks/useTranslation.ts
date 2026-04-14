import { useCallback } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { LanguageCode, getLanguageMeta } from '../data/i18n';
import { vocabTranslations } from '../data/i18n/vocabTranslations';
import { categoryLabelTranslations } from '../data/i18n/categoryLabels';
import { phaseLabelTranslations } from '../data/i18n/phaseLabels';

export interface TranslationAPI {
  /** Active native language, or null if none selected */
  lang: LanguageCode | null;
  /** Whether translations should be shown (user toggle) */
  enabled: boolean;
  /** Meta for the active language (flag, name, rtl, ...), or undefined */
  meta: ReturnType<typeof getLanguageMeta>;
  /**
   * Translate a German vocabulary word. Returns the translation string,
   * or null if translations are disabled, no language is set, or no
   * translation exists for this word in the active language.
   * Since we ship complete coverage for all 15 supported languages, a null
   * return for a known word essentially indicates a missing dictionary entry.
   */
  tVocab: (germanWord: string) => string | null;
  /**
   * Translate a category id (e.g. "body", "home", "leisure").
   */
  tCategory: (categoryId: string) => string | null;
  /**
   * Translate a phase id (e.g. "phase1", "phase2").
   */
  tPhase: (phaseId: string) => string | null;
}

function lookup(
  dict: Record<string, Partial<Record<LanguageCode, string>>>,
  key: string,
  lang: LanguageCode
): string | null {
  // Try exact key
  const entry = dict[key];
  if (entry) {
    return entry[lang] ?? null;
  }
  // Try case-insensitive key match
  const lowerKey = key.toLowerCase();
  for (const k of Object.keys(dict)) {
    if (k.toLowerCase() === lowerKey) {
      return dict[k][lang] ?? null;
    }
  }
  return null;
}

export function useTranslation(): TranslationAPI {
  const lang = useAppStore((s) => s.nativeLanguage);
  const enabled = useAppStore((s) => s.showTranslations);
  const meta = getLanguageMeta(lang);

  const tVocab = useCallback(
    (germanWord: string): string | null => {
      if (!enabled || !lang) return null;
      // Strip article if present (e.g. "die Frau" → "Frau")
      const cleaned = germanWord.replace(/^(der|die|das)\s+/i, '').trim();
      return lookup(vocabTranslations, cleaned, lang);
    },
    [lang, enabled]
  );

  const tCategory = useCallback(
    (categoryId: string): string | null => {
      if (!enabled || !lang) return null;
      return lookup(categoryLabelTranslations, categoryId, lang);
    },
    [lang, enabled]
  );

  const tPhase = useCallback(
    (phaseId: string): string | null => {
      if (!enabled || !lang) return null;
      return lookup(phaseLabelTranslations, phaseId, lang);
    },
    [lang, enabled]
  );

  return { lang, enabled, meta, tVocab, tCategory, tPhase };
}
