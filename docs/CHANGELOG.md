# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier dokumentiert.

Das Format orientiert sich an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung folgt [SemVer](https://semver.org/lang/de/).

---

## [Unreleased]

### Geplant
- Lehrer-Dashboard mit Klassen-Übersicht
- Übersetzungen für Beispielsätze und UI-Strings (bisher nur Vokabeln)
- Push-Notifications für Lern-Erinnerungen
- Review-Modus („Meine Fehler nochmal üben")
- Landscape-Support für Grid-Spiele

---

## [1.0.0] — 2026-04-14

Erste öffentliche Version auf GitHub. Vollständig funktionsfähige App mit allen Kern-Features.

### Hinzugefügt

**Lern-Content**
- 4 didaktische Phasen (Einleitung, Positionen, Präpositionen, Adjektive) mit je 3 Schwierigkeitsstufen
- 131 Phase-Übungen in 4 Typen: FillInBlank, MultipleChoice, ErrorCorrection, WordOrder
- 61 Beispiel-Komplettübungen (zusammengesetzte Bildbeschreibungen)
- 37 Grammatik-Übungen in 5 Topics (Akkusativ, Dativ, Präpositionen, Adjektive, Satzstellung)
- 357 kontextrelevante Vokabeln in 12 thematischen Kategorien

**Wortschatz-Games (5 Modi)**
- Lückentext (9 Texte in 3 Leveln)
- Artikel-Quiz (der/die/das-Drill in 12 Kategorien)
- Mix & Match (6 Runden)
- Gitternetz (6 Grids mit Artikel-Follow-Up)
- Kreuzworträtsel (4 Puzzles)

**Übersetzungen**
- 15 Sprachen: Englisch, Spanisch, Französisch, Ukrainisch, Russisch, Türkisch, Hebräisch, Arabisch, Mandarin, Taiwanesisch, Thailändisch, Persisch, Polnisch, Tschechisch, Rumänisch
- Vollständig für alle Vokabeln und Kategorien

**Game-Feel**
- XP-System mit Level-Progression
- Daily Goal mit 7-Tage-Visualisierung
- Streak-Zähler (Tages-Streaks + Hot-Streaks in Übungen)
- 10 Achievements
- Animationen: Scale-on-Press, Correct-Bounce, Error-Shake, Floating +XP, Slide-Transitions
- Wochenstatistik-Balkendiagramm

**UX**
- Onboarding-Flow (Welcome → Language → 3-Karten-Tour)
- 4-Tab-Struktur (Start, Lernen, Wortschatz, Ich)
- „Continue"-Hero-Card auf Home
- Automatisches Bild-Schrumpfen bei Tastatur-Öffnung (keyboardWillShow für iOS)
- 17 Demo-Accounts (Schüler + 1 Lehrer)
- Glassmorphic Dark-UI mit Plus Jakarta Sans + Be Vietnam Pro

**Technik**
- Expo SDK 54, React Native 0.81
- TypeScript 5.9 strict
- Zustand 5 + AsyncStorage (persistenter Fortschritt pro Account)
- expo-router v6 (File-Based Routing)
- react-native-reanimated 4 (alle Animationen auf UI-Thread)

### Projekt-Geschichte bis v1.0.0

Die App entstand in mehreren iterativen Phasen:

1. **Initiale Zusammensetzung** aus losen Einzeldateien zu funktionierender Expo-App
2. **Content-Ausbau**: Phasen-Übungen, Grammatik, Vokabeln, Bilder
3. **Multi-User-System** mit 17 Demo-Accounts
4. **Übersetzungs-Layer** für 15 Sprachen
5. **Wortschatz-Games**: 5 Spielmodi
6. **UI-/UX-Overhaul**: 4-Tab-Struktur, Glassmorphic Design
7. **Game-Feel**: Animationen, Streaks, Achievements
8. **Keyboard-UX**: Bild-Shrink + Instant-Scroll
9. **GitHub-Release**: Initial Commit + Dokumentation

### Bekannte Einschränkungen

- **Nur Vokabeln sind übersetzt** — Beispielsätze, Hints und UI-Strings sind nur auf Deutsch
- **Kein Backend** — alle Accounts und Stats sind lokal (AsyncStorage)
- **iOS: keyboardWillShow** erfordert iOS 14+ — unter älteren Versionen fällt die App auf `keyboardDidShow` zurück (geringfügig träger)
- **Lehrer-Dashboard** ist vorbereitet, aber noch nicht implementiert
- **Kein Audio**, keine Aussprache-Hilfen
- **Nur Portrait-Orientierung** getestet

---

## Legende

- **Hinzugefügt** — neue Features
- **Geändert** — Änderungen an existierenden Features
- **Veraltet** — Features, die bald entfernt werden
- **Entfernt** — gelöschte Features
- **Behoben** — Bugfixes
- **Sicherheit** — sicherheitsrelevante Änderungen
