# Mitarbeit

Anleitung für Entwickler:innen und Content-Ersteller:innen.

---

## Setup

### Voraussetzungen
- Node.js ≥ 18
- npm (mitgeliefert mit Node)
- **Expo Go** auf dem Testgerät
- Optional: Xcode (iOS Simulator) oder Android Studio (Android Emulator)

### Klonen & Installieren

```bash
git clone https://github.com/DJ1791/Interaktive-Lernhilfe-Web-App.git
cd Interaktive-Lernhilfe-Web-App/bildbeschreibung-app
npm install --legacy-peer-deps
```

Der `--legacy-peer-deps`-Flag ist nötig, weil einige Expo-Pakete strengere Peer-Dep-Ranges deklarieren als React 19 zulässt.

### Dev-Server starten

```bash
npx expo start
```

QR-Code mit Kamera-App (iOS) oder Expo Go (Android) scannen.

### Typecheck

```bash
npx tsc --noEmit
```

Muss **0 Fehler** produzieren, bevor committed wird.

---

## Code-Style

### Allgemeines
- **TypeScript strict** — keine `any`, keine `// @ts-ignore`
- **Funktionale Komponenten** mit Hooks, keine Klassen
- **2 Spaces** Einrückung, Single Quotes, Semicolons
- Keine Emoji-Abkürzungen in Variablennamen

### Imports
Reihenfolge:
1. React / React Native
2. Third-Party (expo-*, react-native-*)
3. Store / Data
4. Components (ui/ → exercises/ → vocab-games/)
5. Theme

### State
- **Persistenz-Würdiges** → Zustand-Store (`useAppStore`)
- **Ephemeres (UI-State, Eingaben, Animation)** → `useState` oder `useSharedValue`
- Selektor statt voller Store: `useAppStore((s) => s.xyz)`

### Animationen
- **Nur Reanimated** — kein `Animated` aus React Native (veraltet)
- Timings: **kurz** (150-300ms Standard). Wenn etwas länger als 500ms braucht, hinterfragen
- Keine `setInterval`-Schleifen — immer Reanimated Worklets

### Komponenten
- Neue UI-Primitives in `components/ui/`
- Neue Exercise-Typen in `components/exercises/` + Typ in `data/exercises/index.ts`
- Styles als `StyleSheet.create` am Dateiende — keine Inline-Styles außer dynamische Werte

---

## Content-Änderungen

### Neue Übung hinzufügen

**Phase-Exercise (z.B. Phase 1, Level 2):**

1. Öffne `data/exercises/phase1.json`
2. Neuen Eintrag hinzufügen:
```json
{
  "id": "p1-l2-10",
  "level": 2,
  "type": "fillInBlank",
  "question": "Das Bild ___ eine Familie.",
  "answer": "zeigt",
  "img": "p1-01"
}
```
3. `img` muss ein gültiger Key aus `data/images.ts` sein (siehe unten)
4. `id` muss eindeutig sein

**Tipp:** Der Helper `getExercisesForLevel('einleitung', 2)` liest automatisch neu — kein Code-Änderung nötig.

### Neues Bild hinzufügen

1. Bild in `bildbeschreibung-app/assets/images/` ablegen (empfohlen: 1024×768, JPG, <200KB)
2. `data/images.ts` öffnen, Mapping erweitern:
```ts
'neu-01': require('../assets/images/neu-01.jpg'),
```
3. In Übungen als `img: 'neu-01'` referenzieren

### Neue Vokabel

1. `data/vocabulary.json`:
```json
{
  "word": "der Kühlschrank",
  "article": "der",
  "plural": "die Kühlschränke",
  "category": "zuhause",
  "pos": "noun",
  "example": "Der Kühlschrank ist voll."
}
```
2. Für **jede der 15 Sprachen** Übersetzung in `data/i18n/vocabTranslations.ts`:
```ts
'der Kühlschrank': {
  en: 'the fridge', es: 'la nevera', fr: 'le frigo', /* ... */
},
```

Ohne vollständige Übersetzungen fällt die Anzeige auf Englisch zurück.

### Neue Sprache

1. `data/i18n/languages.ts`: Eintrag mit `code`, `label`, `nativeLabel`, `flag`, `rtl?`
2. `data/i18n/vocabTranslations.ts`: alle 357 Wörter übersetzen
3. `data/i18n/categoryTranslations.ts`: alle 12 Kategorien

### Neues Achievement

1. `data/achievements.ts`, neuen Eintrag:
```ts
{
  id: 'vocab-master',
  title: 'Wortschatz-Meister',
  description: 'Alle 5 Vocab-Games mindestens einmal gespielt',
  icon: 'style',
  condition: (progress) =>
    Object.keys(progress.vocabGames).length >= 5,
}
```
2. `checkAndUnlockAchievements()` ruft dies automatisch auf

### Neuer User-Account (Demo)

`data/auth.ts`:
```ts
{ username: 'neuer', password: 'PW123', displayName: 'Neuer User', role: 'student' }
```

---

## Pull Request Workflow

1. **Branch** von `main` aus: `git checkout -b feat/meine-aenderung`
2. **Commits:** Konventionelle Prefixe (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`)
3. **Vor dem Push:**
   - `npx tsc --noEmit` → 0 Fehler
   - App in Expo Go einmal komplett durchklicken
4. **PR-Beschreibung:** Was geändert, warum, Screenshots wenn UI

---

## Debugging-Tipps

### App bootet nicht
- `rm -rf node_modules && npm install --legacy-peer-deps`
- `npx expo start --clear` (löscht Metro-Cache)

### Änderung im JSON wird nicht sichtbar
- Metro-Cache: `npx expo start --clear`
- In Expo Go: kräftig shaken → „Reload"

### AsyncStorage prüfen (im Debug-Menü via Expo Dev Tools)
```js
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getItem('dtz-app-storage').then(console.log);
```

### Store resetten (für saubere Tests)
In Dev-Build: Im Profil → Logout → Login als anderer User.

---

## Ordner, die du NICHT ändern solltest

- `ios/`, `android/` — werden von Expo Prebuild generiert
- `.expo/` — Metro-Cache
- `node_modules/` — Package-Manager-Domain

Im .gitignore ausgeschlossen.
