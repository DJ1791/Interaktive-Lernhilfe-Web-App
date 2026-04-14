# Features im Detail

Jedes Hauptfeature mit Zweck, Nutzung und technischen Details.

---

## 1. Onboarding-Flow

**Wann:** Nach erstem Login eines Accounts ohne vorherigen Fortschritt (`progress.xp === 0`).

**Ablauf:**

1. **Welcome** (`/onboarding/welcome`) — Begrüßung mit kurzem Pitch
2. **Language** (`/onboarding/language`) — Muttersprache wählen (15 Optionen). Wird in `nativeLanguage` gespeichert, aktiviert `showTranslations`
3. **Tour** (`/onboarding/tour`) — 3-Karten-Swipe: „So lernst du", „Dein Fortschritt", „Viel Spaß"

Nach Abschluss: `hasCompletedOnboarding = true`, Redirect auf `/`.

**Bestandsuser-Fix:** Wenn ein User bereits XP > 0 hat, aber `hasCompletedOnboarding` false ist (altes Konto ohne Onboarding), wird der Flow automatisch übersprungen.

---

## 2. Bildbeschreibung (4 Phasen × 3 Level)

Zentrale Lern-Schiene der App. Jede Phase hat ihre eigene Zielsetzung:

| Phase | Label | Ziel |
|---|---|---|
| `einleitung` | Einleitung | „Das Bild zeigt…", erster Eindruck, Fragesätze |
| `positionen` | Positionen + Verben | vorne/hinten/links/rechts + stehen/sitzen/liegen |
| `praepositionen` | Präpositionen + Dativ | auf/unter/hinter/zwischen + Artikel im Dativ |
| `adjektive` | Adjektive | Farben, Größen, Eigenschaften, Deklination |

**Level-Progression (pro Phase):**

- **Level 1** — Lückentext mit Wortbank oder Multiple Choice (A2-Kern)
- **Level 2** — Lückentext ohne Bank, Fehlerkorrektur, Multiple Choice mit Ablenkern
- **Level 3** — Satzstellung (WordOrder), freie Fehlerkorrektur, Kombinationen (A2→B1-Übergang)

**Übungstypen:**

- **FillInBlank** — Freitext-Eingabe mit `answer`-Match (case-insensitive, trim)
- **MultipleChoice** — 3-4 Optionen, ein richtiger Index
- **ErrorCorrection** — Satz mit absichtlichem Fehler → User tippt korrigierten Satz
- **WordOrder** — Scramble-Tokens, User ordnet per Tap

**UI-Besonderheit:** Bild schrumpft automatisch auf halbe Höhe, sobald die Tastatur öffnet (siehe [ARCHITECTURE.md § 6](./ARCHITECTURE.md#6-keyboard-ux)).

---

## 3. Wortschatz (357 Wörter, 12 Kategorien)

**Datenquelle:** `data/vocabulary.json` — 200 Nomen, 86 Verben, 71 Adjektive.

**Kategorien (12):** Personen, Körper, Kleidung, Zuhause, Essen, Einkaufen, Arbeit, Medien, Reisen, Freizeit, Gefühle, Wahrnehmung.

**Features:**

- **Volltextsuche** — filtert nach Wort, Übersetzung, Beispielsatz
- **Favoriten** — Herzchen-Button, wird in `favoriteWords[]` persistiert
- **Übersetzung sichtbar** — wenn `showTranslations === true` und `nativeLanguage !== 'de'`
- **Kategorien-Filter** — horizontale Chip-Row

---

## 4. Wortschatz-Games (5 Spielmodi)

Alle Games folgen demselben Shell-Pattern (`components/vocab-games/GameShell`) und enden im `GameResults`-Screen mit Count-Up-Animation.

### 4.1 Lückentext (Cloze)
- **3 Bilder × 3 Level = 9 Texte**
- Bildbeschreibung mit N Lücken (Level 1: 3, Level 2: 5, Level 3: 7+)
- User tippt jede Lücke
- Jede richtige Lücke = +5 XP

### 4.2 Artikel-Quiz
- **12 Kategorien** à ~30 Fragen
- Jede Nomen-Karte: der / die / das drei Buttons
- Richtige Antwort: Button bounced, grüner Glow
- Falsche Antwort: Shake + Farbe rot + zeigt korrekten Artikel

### 4.3 Mix & Match
- **6 Runden**
- 10 Wörter, 3-4 Kategorien als Drop-Zones
- User tippt Wort → tippt Kategorie
- Richtig: Wort bounced kurz, verschwindet. Falsch: Shake

### 4.4 Gitternetz (Word Search)
- **6 Grids** à 10×10 Felder
- 8-12 Wörter versteckt (horizontal, vertikal, diagonal)
- Drag zum Auswählen, Release = Check
- Jedes gefundene Wort fragt direkt nach dem Artikel (der/die/das)

### 4.5 Kreuzworträtsel
- **4 Puzzles** mit 15-20 Wörtern
- Umschreibungen als Hinweise, nicht Übersetzungen
- Automatisches Crossing-Validation
- Hinweis-Modus: ein Buchstabe kostet -5 XP

---

## 5. Grammatik (5 Topics)

`app/grammar/[topicId].tsx` mit 5 Topics:

| Topic | Übungen | Fokus |
|---|---|---|
| `akkusativ` | ~10 | Direktes Objekt mit `-en`-Endung |
| `dativ` | ~8 | Indirektes Objekt + Präpositionen mit Dativ |
| `praepositionen` | ~8 | Wechselpräpositionen, typische Muster |
| `adjektive` | ~6 | Schwache/starke/gemischte Deklination |
| `satzstellung` | ~5 | V2-Regel, Nebensatz, TeKaMoLo |

Übungen werden per **Filter aus den Phasen-Exercises** gezogen (`data/exercises/grammar.ts` → `getExercisesForTopic`). So bleibt der Content konsistent mit den Phasen.

---

## 6. Game-Feel (Motivation-Layer)

### XP & Level
- Richtig beantwortet: +10 XP (Übungen), +5 XP (Vocab-Lücken)
- Level = `Math.floor(xp / 100) + 1`
- Sichtbar als Badge in Home-Header

### Streak
- Tagesstreak: zählt aufeinanderfolgende Tage mit `dailyXp > 0`
- Hot-Streak (in-session): 3+ richtige in Folge → `🔥 3 in Folge!` Badge mit ZoomIn
- Falsche Antwort resettet Hot-Streak

### Daily Goal
- Konfigurierbar (Default 20 XP)
- 7-Tage-Visualisierung als Dots (volle Kreise = Ziel erreicht, Outline = teilweise)
- Heutiger Tag mit primary-color-Border

### Achievements (10)
| ID | Name | Bedingung |
|---|---|---|
| `first-steps` | Erste Schritte | Erste Übung gemacht |
| `first-100-xp` | Erste 100 XP | `xp >= 100` |
| `streak-3` | 3 Tage in Folge | `streak >= 3` |
| `streak-7` | Wochen-Streak | `streak >= 7` |
| `perfect-round` | Perfekte Runde | 100% in einem Level |
| `phase-1-done` | Einleitung gemeistert | Phase 1 zu 100% |
| `all-phases` | Alle Phasen | Alle 4 Phasen zu 100% |
| `polyglot` | Polyglott | Sprache gewechselt |
| `vocab-explorer` | Wortschatz-Forscher | 1. Vocab-Game gespielt |
| `master` | Meister | Alle Achievements (außer diesem) |

Neue Achievements triggern einen Popup-Toast (`pendingUnlockedAchievements`).

### Wochenstatistik
Auf Home + Ich-Tab: Balkendiagramm der letzten 7 Tage (XP pro Tag).

---

## 7. 15-Sprachen-System

Unterstützte Sprachen:
`en, es, fr, uk, ru, tr, he, ar, zh, nan-tw, th, fa, pl, cs, ro`

**Vollständigkeit:**
- ✅ Alle 357 Vokabeln
- ✅ Alle 12 Kategorien
- 🟡 Noch nicht übersetzt: Beispielsätze, UI-Strings, Hints

**Nutzung:**
```tsx
const { t } = useTranslation();
const translated = t(word);  // → aktuelle Sprache oder English-Fallback
```

Sprachwechsel jederzeit möglich in `/profile/settings`.

---

## 8. Home-Screen (Dashboard)

Elemente von oben nach unten:

1. **Header** — Greeting mit User-Name + Level-Badge
2. **Continue-Card** (bedingt) — „Weiter lernen", wenn lastActivity < 30 Tage alt
3. **Daily Goal Card** — Heute XP + Progress + 7-Tage-Dots + Streak
4. **Schnellzugriff** — 3 Buttons: Bildbeschreibung, Wortschatz, Grammatik
5. **Gesamtfortschritt** — Mittelwert über alle Phasen
6. **Empfohlen** — erste Phase mit <100%

---

## 9. Ich-Tab (Profil)

- **Avatar-Placeholder** + Name + Level
- **Stats-Grid**: XP, Streak, Übungen gemacht, Lieblingswörter
- **Achievements-Grid** (10 Icons, grau wenn nicht freigeschaltet)
- **Einstellungen** → `/profile/settings` (Sprache, Tagesziel, Übersetzungen ein/aus, Logout)

---

## 10. Lehrer-Rolle (Vorbereitung)

- Account mit Flag `role: 'teacher'` (z.B. `lehrkraft / TEACH99`)
- Aktuell: Login funktioniert, eigener Fortschritt, gleiche Features
- **Geplant:** Dashboard mit Klassen-Übersicht, Schüler-Statistiken, Content-Editor

---

## Was NICHT drin ist (bewusst)

- **Kein Login-Server** — alle Accounts hardcoded in `data/auth.ts`
- **Kein Backend** — alle Stats lokal (AsyncStorage)
- **Keine Push-Notifications** — geplant, aber nicht implementiert
- **Keine Audio-Aussprache** — Kandidat für v2
- **Kein Hörverstehen/Mündliche Prüfung** — Scope-Beschränkung auf Bildbeschreibung
