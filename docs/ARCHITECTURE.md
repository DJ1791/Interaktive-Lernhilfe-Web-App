# Architektur

Technisches Deep-Dive in die Struktur der App. Zielgruppe: Entwickler:innen, die am Code arbeiten oder ihn erweitern wollen.

---

## 1. Überblick

Die App ist eine **Expo Managed React Native App** mit **File-Based Routing** via `expo-router`. Der gesamte State lebt in **einem Zustand-Store** (`stores/useAppStore.ts`), der per `persist`-Middleware in `AsyncStorage` gespiegelt wird. Content (Übungen, Vokabeln, Übersetzungen) ist **statisch im Bundle** — keine Netzwerkaufrufe, keine Backend-Abhängigkeit.

```
┌─────────────────────────────────────────────┐
│  User Input (Screen/Component)              │
└──────────────────┬──────────────────────────┘
                   │ handler call
                   ▼
┌─────────────────────────────────────────────┐
│  useAppStore (Zustand)                      │
│  - Actions mutieren State                   │
│  - Selectors werden in Components abonniert │
└──────────────────┬──────────────────────────┘
                   │ persist middleware
                   ▼
┌─────────────────────────────────────────────┐
│  AsyncStorage (Key: "dtz-app-storage")      │
└─────────────────────────────────────────────┘
```

---

## 2. Routing (expo-router v6)

Jede Datei unter `bildbeschreibung-app/app/` ist automatisch eine Route.

```
app/
├── _layout.tsx                    # Root: Font loading, Gate für Auth
├── (auth)/login.tsx               # /login
├── (tabs)/
│   ├── _layout.tsx                # Bottom-Tab-Bar
│   ├── index.tsx                  # / (Start)
│   ├── lernen.tsx                 # /lernen
│   ├── wortschatz.tsx             # /wortschatz
│   └── ich.tsx                    # /ich
├── onboarding/
│   ├── welcome.tsx                # /onboarding/welcome
│   ├── language.tsx               # /onboarding/language
│   └── tour.tsx                   # /onboarding/tour
├── exercise/[phaseId].tsx         # /exercise/einleitung, /exercise/positionen, …
├── grammar/[topicId].tsx          # /grammar/akkusativ, /grammar/dativ, …
├── vocab-games/
│   ├── cloze/[bildId].tsx         # /vocab-games/cloze/bild1
│   ├── artikel-quiz/[cat].tsx     # /vocab-games/artikel-quiz/personen
│   ├── mix-match/[round].tsx      # /vocab-games/mix-match/1
│   ├── wordsearch/[gridId].tsx    # /vocab-games/wordsearch/grid1
│   └── crossword/[puzzleId].tsx   # /vocab-games/crossword/puzzle1
└── profile/settings.tsx           # /profile/settings
```

**Wichtige Entscheidung:** Der Ordner heißt `vocab-games/` (nicht `wortschatz/`), um eine Route-Kollision mit `(tabs)/wortschatz.tsx` zu vermeiden. Expo Router würde sonst nicht deterministisch eine der beiden als Default wählen.

---

## 3. State Management (Zustand + AsyncStorage)

### Store-Shape

```ts
type AppStore = {
  // Auth
  currentUser: User | null;

  // Progress (persistiert pro User)
  progress: {
    xp: number;
    level: number;
    streak: number;
    lastActiveDate: string;        // ISO-Date
    dailyXpHistory: { date: string; xp: number }[];
    dailyGoal: number;
    unlockedAchievements: string[];
    phaseResults: Record<string, Record<number, { attempts: number; correct: number }>>;
    fokusGrammar: Record<string, { attempts: number; correct: number }>;
    vocabGames: Record<string, { attempts: number; correct: number; bestPercent: number }>;
  };

  // UX
  nativeLanguage: LanguageCode;    // 'en', 'es', 'ar', …
  showTranslations: boolean;
  hasCompletedOnboarding: boolean;
  lastActivity: { type; routePath; title; subtitle?; timestamp } | null;
  favoriteWords: string[];
  pendingUnlockedAchievements: string[];
};
```

### Persistence

```ts
persist(store, {
  name: 'dtz-app-storage',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({
    // Nur diese Felder landen in AsyncStorage:
    currentUser, progress, nativeLanguage, showTranslations,
    hasCompletedOnboarding, favoriteWords,
  }),
});
```

`pendingUnlockedAchievements` und `lastActivity` sind **Session-State** — sie werden nicht persistiert.

### Actions (wichtigste)

| Action | Zweck |
|---|---|
| `login(user)` | Setzt `currentUser`, lädt dessen `progress` |
| `logout()` | Clear `currentUser`, reset `progress` |
| `updateExerciseResult(phase, level, correct)` | +XP, +Streak, Phase-Stats updaten |
| `updateFokusGrammar(topic, correct)` | Grammatik-Topic-Stats |
| `updateVocabGame(gameKey, percent)` | Vocab-Game-Stats + Best-Score |
| `checkAndUnlockAchievements()` | Prüft alle 10 Achievement-Bedingungen |
| `setLastActivity(act)` | Hero „Continue"-Card auf Home |
| `toggleFavoriteWord(word)` | Favoriten-System |

### Selectors

Immer mit Subscription (verhindert unnötige Re-Renders):

```tsx
const xp = useAppStore((s) => s.progress.xp);     // ✅ gut
const store = useAppStore();                       // ⚠️ re-rendert bei jedem State-Change
```

---

## 4. Daten-Layer (statische JSON)

### Übungen

```
data/exercises/
├── phase1.json      # 36 Übungen in Level 1-3
├── phase2.json      # 33 Übungen
├── phase3.json      # 32 Übungen (Level 2 mit prepositionChoice + errorCorrection)
├── phase4.json      # 30 Übungen (Level 2 mit adjective declension)
├── examples.json    # 61 Extra-Übungen (zusammengesetzte Bildbeschreibungen)
├── grammar.ts       # Filtert Exercises aus Phasen für Grammar-Topics
└── index.ts         # Typen + `getExercisesForLevel(phase, level)`
```

**Exercise-Typen:**

```ts
type Exercise =
  | { type: 'fillInBlank'; question; answer; img?; hint? }
  | { type: 'multipleChoice'; question; options; correctIndex; img? }
  | { type: 'errorCorrection'; sentence; correct; img? }
  | { type: 'wordOrder'; scrambled; correct; img? };
```

### Vokabeln

`data/vocabulary.json` — **357 Einträge**, jeder:

```ts
{ word, article?, plural?, category, pos, example? }
```

**Kategorien:** personen, körper, kleidung, zuhause, essen, einkaufen, arbeit, medien, reisen, freizeit, gefuehle, wahrnehmung (12 total).

### i18n

```
data/i18n/
├── vocabTranslations.ts    # Record<Word, Record<LangCode, string>>
├── categoryTranslations.ts # Record<CatKey, Record<LangCode, string>>
├── languages.ts            # 15 Sprach-Metadaten
└── index.ts                # Hook `useTranslation()`
```

**Lookup-Strategie:** `translations[word]?.[lang] ?? translations[word]?.en ?? word`.

---

## 5. Animation-System

### `hooks/useGameAnimations.ts`

6 wiederverwendbare Reanimated-Hooks, alle auf dem **UI-Thread** (Worklets):

| Hook | Zweck | Timing |
|---|---|---|
| `useScaleOnPress(to=0.96)` | Drück-Scale | Spring stiffness 400 |
| `useCorrectBounce()` | Bounce bei richtig | `withTiming` 1→1.03→1, 180ms |
| `useShake()` | Horizontal-Shake bei falsch | ±4px in `withSequence`, 200ms |
| `useFloatingText()` | "+10 XP" hochfliegen | `withTiming` 60px up + fade, 600ms |
| `useStreakCounter()` | Scale-Bump bei Increment | `withSequence` scale 1→1.2→1, 200ms |
| `useCountUp(target, ms)` | Animierter Zähler für Results | `withTiming`, JS-Thread interpoliert |

**Performance-Garantie:** Alle Hooks nutzen `useSharedValue` + `useAnimatedStyle`. Keine `setInterval`-Schleifen. Shared Values werden bei Unmount automatisch cleaned.

### Layout-Animations

- `LinearTransition.duration(220)` am Bild-Container — sorgt für **smoothes Schrumpfen** auf halbe Größe, wenn Tastatur geöffnet wird
- `FadeIn.duration(300)` beim Remount von Exercise-Karten

---

## 6. Keyboard-UX

**Problem:** Auf iOS überdeckt die Tastatur oft den Input unter dem Bild.

**Lösung (in `exercise/[phaseId].tsx` und `grammar/[topicId].tsx`):**

1. Bild-Höhe wird auf 50% reduziert (200 → 100px) mit `LinearTransition`-Animation
2. ScrollView `scrollToEnd({ animated: false })` — **instant** (nicht animiert, kein Warten)
3. Trigger ist `keyboardWillShow` (iOS, ~250ms früher als `keyboardDidShow`)
4. Android fällt auf `keyboardDidShow` zurück

```ts
const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
Keyboard.addListener(showEvent, () => {
  setIsImageMinimized(true);
  scrollRef.current?.scrollToEnd({ animated: false });
});
```

---

## 7. Theme

`theme/index.ts` exportiert **4 Tokens**:

```ts
colors = { background, text, textMuted, textDim, primary, secondary, tertiary, error, success }
fonts  = { body, bodyMedium, headline, headlineMedium, headlineBlack }
spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 }
radius = { sm: 6, md: 10, lg: 14, xl: 20, full: 999 }
```

Alle Komponenten importieren aus `theme/index.ts`. Keine Magic Numbers.

---

## 8. Komponenten-Hierarchie

```
components/
├── ui/                          # Design-System-Primitives
│   ├── GlassCard.tsx            # Border + semi-transparent bg
│   ├── GradientButton.tsx       # LinearGradient + scale-on-press
│   ├── IconButton.tsx           # Circular, wrapped TouchableOpacity
│   └── ProgressBar.tsx          # Animated width
├── exercises/                   # 4 Übungstypen
│   ├── FillInBlank.tsx
│   ├── MultipleChoice.tsx
│   ├── ErrorCorrection.tsx
│   └── WordOrder.tsx
└── vocab-games/
    ├── GameShell.tsx            # Header + Body-Wrapper für alle 5 Games
    └── GameResults.tsx          # Ergebnis-Screen mit Count-Up + Trophy-Bounce
```

**Pattern bei Exercise-Komponenten:** Der "Weiter"-Button liegt **außerhalb** des Shake/Bounce-Animated.View, damit die Transform-Matrix Touch-Events nicht blockiert.

---

## 9. Daten-Fluss (Beispiel: Übung lösen)

```
User tippt "Antwort" in FillInBlank
  → onSubmit
  → handleAnswer(correct)
      → updateExerciseResult(phase, level, correct)    [Store]
          → progress.xp += 10 / 0
          → progress.streak update
          → checkAndUnlockAchievements()
      → streakCounter.bump() / reset()                  [Animation]
      → setResults([...results, correct])               [Local State]
      → setTimeout(200) → nextIndex / 'results' mode
```

---

## 10. Typische Erweiterungs-Aufgaben

### Neue Übung in Phase 1 hinzufügen

1. Eintrag in `data/exercises/phase1.json` hinzufügen (passendes Level)
2. `img`-Feld: Referenz auf Key in `data/images.ts`
3. Fertig — `getExercisesForLevel('einleitung', level)` liest automatisch neu

### Neue Sprache hinzufügen

1. `data/i18n/languages.ts`: Eintrag mit `code`, `label`, `flag`, `rtl?`
2. `data/i18n/vocabTranslations.ts`: Für jede der 357 Vokabeln Übersetzung
3. `data/i18n/categoryTranslations.ts`: Für alle 12 Kategorien

### Neues Achievement

1. `data/achievements.ts`: Eintrag mit `id`, `title`, `description`, `icon`, `condition(progress)`
2. Wird automatisch in `checkAndUnlockAchievements()` aufgerufen

---

## 11. Was NICHT im Store liegt

- **Animation-State** → in Reanimated Shared Values
- **Laufende Exercise-Session** (currentIndex, results) → Local State der Screen-Komponente
- **Search-Query** im Wortschatz → Local State

Faustregel: **Persistenz-Würdiges** → Store. **Ephemer** → `useState`.
