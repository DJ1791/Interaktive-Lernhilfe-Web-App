// ============================================================================
// i18n: Languages + Types
// ============================================================================

export type LanguageCode =
  | 'en'   // Englisch
  | 'es'   // Spanisch
  | 'fr'   // Französisch
  | 'pt'   // Portugiesisch (aus Legacy-HTML vorhanden, nicht in User-Liste)
  | 'uk'   // Ukrainisch
  | 'ru'   // Russisch
  | 'tr'   // Türkisch
  | 'he'   // Hebräisch
  | 'ar'   // Arabisch
  | 'zh'   // Mandarin (Hochchinesisch)
  | 'nan'  // Taiwanesisch (Hokkien / Min Nan)
  | 'th'   // Thailändisch
  | 'fa'   // Persisch (Farsi)
  | 'pl'   // Polnisch
  | 'cs'   // Tschechisch
  | 'ro';  // Rumänisch

export interface LanguageMeta {
  code: LanguageCode;
  name: string;           // Deutsche Bezeichnung der Sprache
  nativeName: string;     // Name in der Sprache selbst
  flag: string;           // Unicode-Flagge
  rtl: boolean;           // Right-to-left (Hebräisch, Arabisch, Persisch)
}

// Die 15 Sprachen aus der User-Wunschliste, die wir tatsächlich mit Daten haben.
// Italienisch (it) und Vietnamesisch (vi) wurden auf User-Wunsch ganz weggelassen.
// Portugiesisch (pt) ist im Datensatz vorhanden, aber hier nicht freigegeben,
// da es nicht Teil der User-Wunschliste ist.
export const availableLanguages: LanguageMeta[] = [
  { code: 'en',  name: 'Englisch',          nativeName: 'English',     flag: '🇬🇧', rtl: false },
  { code: 'es',  name: 'Spanisch',          nativeName: 'Español',     flag: '🇪🇸', rtl: false },
  { code: 'fr',  name: 'Französisch',       nativeName: 'Français',    flag: '🇫🇷', rtl: false },
  { code: 'uk',  name: 'Ukrainisch',        nativeName: 'Українська',  flag: '🇺🇦', rtl: false },
  { code: 'ru',  name: 'Russisch',          nativeName: 'Русский',     flag: '🇷🇺', rtl: false },
  { code: 'tr',  name: 'Türkisch',          nativeName: 'Türkçe',      flag: '🇹🇷', rtl: false },
  { code: 'he',  name: 'Hebräisch',         nativeName: 'עברית',       flag: '🇮🇱', rtl: true  },
  { code: 'ar',  name: 'Arabisch',          nativeName: 'العربية',     flag: '🇸🇦', rtl: true  },
  { code: 'zh',  name: 'Mandarin',          nativeName: '中文',         flag: '🇨🇳', rtl: false },
  { code: 'nan', name: 'Taiwanesisch',      nativeName: '臺語',         flag: '🇹🇼', rtl: false },
  { code: 'th',  name: 'Thailändisch',      nativeName: 'ไทย',         flag: '🇹🇭', rtl: false },
  { code: 'fa',  name: 'Persisch',          nativeName: 'فارسی',       flag: '🇮🇷', rtl: true  },
  { code: 'pl',  name: 'Polnisch',          nativeName: 'Polski',      flag: '🇵🇱', rtl: false },
  { code: 'cs',  name: 'Tschechisch',       nativeName: 'Čeština',     flag: '🇨🇿', rtl: false },
  { code: 'ro',  name: 'Rumänisch',         nativeName: 'Română',      flag: '🇷🇴', rtl: false },
];

export function getLanguageMeta(code: LanguageCode | null | undefined): LanguageMeta | undefined {
  if (!code) return undefined;
  return availableLanguages.find((l) => l.code === code);
}
