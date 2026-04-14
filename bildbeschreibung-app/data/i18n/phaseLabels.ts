import { LanguageCode } from './index';

// Translations for the 4 image-description phase labels (phase1..phase4).
// Covers all 15 available languages.
export const phaseLabelTranslations: Record<string, Partial<Record<LanguageCode, string>>> = {
  "phase1": {
    "en": "First Impression",
    "es": "Primera impresión",
    "fr": "Première impression",
    "uk": "Перше враження",
    "ru": "Первое впечатление",
    "tr": "İlk İzlenim",
    "he": "רושם ראשון",
    "ar": "الانطباع الأول",
    "zh": "第一印象",
    "nan": "頭一印象",
    "th": "ความประทับใจแรก",
    "fa": "اولین برداشت",
    "pl": "Pierwsze wrażenie",
    "cs": "První dojem",
    "ro": "Prima impresie"
  },
  "phase2": {
    "en": "Positions + Verbs",
    "es": "Posiciones y verbos",
    "fr": "Positions et verbes",
    "uk": "Положення та дієслова",
    "ru": "Положения и глаголы",
    "tr": "Konumlar ve Fiiller",
    "he": "מיקומים ופעלים",
    "ar": "المواقع والأفعال",
    "zh": "位置和动词",
    "nan": "位置佮動詞",
    "th": "ตำแหน่งและคำกริยา",
    "fa": "موقعیت‌ها و افعال",
    "pl": "Pozycje i czasowniki",
    "cs": "Polohy a slovesa",
    "ro": "Poziții și verbe"
  },
  "phase3": {
    "en": "Prepositions + Dative",
    "es": "Preposiciones y dativo",
    "fr": "Prépositions et datif",
    "uk": "Прийменники та давальний відмінок",
    "ru": "Предлоги и дательный падеж",
    "tr": "Edatlar ve -e Hâli",
    "he": "מילות יחס ודאטיב",
    "ar": "حروف الجر وحالة المفعول غير المباشر",
    "zh": "介词和与格",
    "nan": "介詞佮與格",
    "th": "คำบุพบทและการก Dativ",
    "fa": "حروف اضافه و حالت مفعولی",
    "pl": "Przyimki i celownik",
    "cs": "Předložky a 3. pád",
    "ro": "Prepoziții și cazul dativ"
  },
  "phase4": {
    "en": "Adjectives",
    "es": "Adjetivos",
    "fr": "Adjectifs",
    "uk": "Прикметники",
    "ru": "Прилагательные",
    "tr": "Sıfatlar",
    "he": "שמות תואר",
    "ar": "الصفات",
    "zh": "形容词",
    "nan": "形容詞",
    "th": "คำคุณศัพท์",
    "fa": "صفت‌ها",
    "pl": "Przymiotniki",
    "cs": "Přídavná jména",
    "ro": "Adjective"
  }
};
