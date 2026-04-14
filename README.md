# DTZ Bildbeschreibung — Interaktive Lernhilfe

> Mobile Lern-App zur Vorbereitung auf die Bildbeschreibung im **Deutsch-Test für Zuwanderer (DTZ, Niveau A2/B1)**.

[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)](https://expo.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020)](https://docs.expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Active%20Development-orange)]()

📖 **English version:** [docs/README.md](./docs/README.md)

---

## Was ist das?

Eine interaktive React Native Mobile-App, die DaZ-Lernende (Deutsch als Zweitsprache) systematisch auf die **Bildbeschreibungs-Aufgabe des DTZ-Prüfungsteils** vorbereitet. Die App führt durch **4 didaktische Phasen** (Einleitung, Positionen, Präpositionen, Adjektive), begleitet vom Aufbau eines **kontextbezogenen Wortschatzes** und **gezielten Grammatik-Übungen** — alles in 15 Muttersprachen übersetzbar.

## Für wen?

- **Teilnehmer:innen von Integrationskursen** (A2/B1), die sich auf den DTZ vorbereiten
- **DaZ-Lehrkräfte**, die ihren Schüler:innen eine strukturierte Übungsressource an die Hand geben möchten
- **Selbstlernende**, die zielgerichtet an ihrem Deutsch arbeiten

## Kern-Features

### 🎯 Bildbeschreibung in 4 Phasen
Systematische Progression durch alle didaktischen Bausteine einer Bildbeschreibung:
1. **Einleitung** — „Das Bild zeigt..." / erster Eindruck
2. **Positionen + Verben** — links, rechts, vorne, hinten; stehen, liegen, sitzen
3. **Präpositionen + Dativ** — auf dem Tisch, unter der Bank, zwischen den Autos
4. **Adjektive** — Deklination, Farben, Eigenschaften

Jede Phase hat **3 Schwierigkeitsstufen** mit steigendem Anspruch — von einfachem Lückentext bis zu freien Satzbildungen mit Fehlerkorrektur.

### 📘 Wortschatz-Training
- **357 kontextrelevante Vokabeln** in 12 thematischen Kategorien (Personen, Körper, Kleidung, Zuhause, Essen, Einkaufen, Arbeit, Medien, Reisen, Freizeit, Gefühle, Wahrnehmung)
- **Volltextsuche** über alle Vokabeln
- **Favoriten-System** („schwere Wörter" markieren)
- **5 spielerische Übungsformen:**
  - 🃏 **Lückentext** — Bildbeschreibungen mit Lücken (3 Level)
  - 🏷️ **Artikel-Quiz** — der/die/das drillen
  - 🔀 **Mix & Match** — Wörter den richtigen Kategorien zuordnen
  - 🔡 **Gitternetz** — Buchstabensuche mit Artikel-Drill
  - 🧩 **Kreuzworträtsel** — Umschreibungen → Wörter

### 🔢 Grammatik-Vertiefung
Gezielte Übungen zu den 5 häufigsten Stolpersteinen:
- Akkusativ · Dativ · Präpositionen · Adjektivdeklination · Satzstellung

### 🌍 Übersetzungen in 15 Sprachen
Lerner:innen können ihre Muttersprache wählen und sehen dann bei jeder Vokabel die Übersetzung. Verfügbar: **Englisch, Spanisch, Französisch, Ukrainisch, Russisch, Türkisch, Hebräisch, Arabisch, Mandarin, Taiwanesisch (Hokkien), Thailändisch, Persisch, Polnisch, Tschechisch, Rumänisch**.

### 🎮 Game-Feel & Motivation
- **Daily Goal** — konfigurierbares XP-Tagesziel mit 7-Tage-Visualisierung
- **Streaks** — „🔥 X in Folge!" mit Animation
- **10 Achievements** (Erste Schritte, Wochen-Streak, 100 XP, Perfekte Runde, ...)
- **Wochenstatistik** — Balkendiagramm der letzten 7 Tage
- **Physische Animationen** — Scale-Bounces bei richtig, Shake bei falsch, „+10 XP" Popups
- **Sanfte UX** — Bild schrumpft automatisch beim Öffnen der Tastatur, damit die Aufgabe sichtbar bleibt

### 🚪 Weiteres
- **Onboarding-Flow** beim Erstlogin (Welcome → Sprachauswahl → 3-Karten-Tour)
- **Multi-User-fähig** mit persistentem Fortschritt pro Account (AsyncStorage)
- **Lehrer-Rolle** (vorbereitet, Features folgen)

---

## Schnellstart

### Voraussetzungen
- **Node.js** ≥ 18
- **npm** (oder yarn/pnpm)
- **Expo Go** auf deinem Handy ([iOS](https://apps.apple.com/de/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation
```bash
git clone https://github.com/DJ1791/Interaktive-Lernhilfe-Web-App.git
cd Interaktive-Lernhilfe-Web-App/bildbeschreibung-app
npm install --legacy-peer-deps
npx expo start
```

Dann QR-Code mit der Kamera-App (iOS) oder Expo Go (Android) scannen.

### Beispiel-Login
Zum Testen sind im Code **17 Demo-Accounts** hinterlegt (siehe [`bildbeschreibung-app/data/auth.ts`](./bildbeschreibung-app/data/auth.ts)):

| Username | Passwort |
|---|---|
| `davis` | `DK17` |
| `aldijana` | `AR1` |
| `lehrkraft` | `TEACH99` |

---

## Projekt-Struktur

```
Interaktive-Lernhilfe-Web-App/
├── bildbeschreibung-app/          # Die eigentliche Expo/React Native App
│   ├── app/                       # Expo-Router File-Based Routing
│   │   ├── (auth)/login.tsx       # Login-Screen
│   │   ├── (tabs)/                # 4 Haupt-Tabs: Start, Lernen, Wortschatz, Ich
│   │   ├── onboarding/            # Welcome → Language → Tour
│   │   ├── exercise/[phaseId].tsx # Phasen-Übungsflow
│   │   ├── grammar/[topicId].tsx  # Grammatik-Übungsflow
│   │   ├── vocab-games/           # 5 Spiel-Modi (cloze, artikel-quiz, ...)
│   │   └── profile/settings.tsx   # Sprachauswahl
│   │
│   ├── components/                # Wiederverwendbare UI-Komponenten
│   │   ├── ui/                    # Basis (GlassCard, GradientButton, ...)
│   │   ├── exercises/             # 4 Übungstypen (FillInBlank, MultipleChoice, ...)
│   │   └── vocab-games/           # GameShell, GameResults, ...
│   │
│   ├── data/                      # Gesamter Content
│   │   ├── exercises/*.json       # Übungen pro Phase (JSON)
│   │   ├── vocabulary.json        # 357 Vokabeln in 12 Kategorien
│   │   ├── i18n/                  # Übersetzungen in 15 Sprachen
│   │   ├── vocab-games/           # Spiel-Content (Cloze-Texte, Crosswords, …)
│   │   ├── achievements.ts        # 10 Achievement-Definitionen
│   │   ├── auth.ts                # User-Accounts
│   │   └── phases.ts              # Phasen-Metadaten
│   │
│   ├── stores/useAppStore.ts      # Zustand-Store (persistiert via AsyncStorage)
│   ├── hooks/                     # useTranslation, useGameAnimations
│   ├── theme/index.ts             # Farben, Fonts, Spacing
│   └── assets/images/             # Bilder für alle Phasen
│
└── docs/                          # Dokumentation
    ├── README.md                  # English version
    ├── ARCHITECTURE.md            # Technisches Deep-Dive
    ├── FEATURES.md                # Feature-Details
    ├── CONTRIBUTING.md            # Mitarbeits-Guide
    └── CHANGELOG.md               # Versionshistorie
```

---

## Tech-Stack

| Bereich | Technologie |
|---|---|
| **Framework** | React Native 0.81 · Expo SDK 54 |
| **Routing** | expo-router v6 (File-Based) |
| **Sprache** | TypeScript 5.9 (strict) |
| **State** | Zustand 5 + AsyncStorage (persist) |
| **Animationen** | react-native-reanimated 4 + gesture-handler 2 |
| **UI** | Custom Glassmorphic Design, LinearGradient, MaterialIcons |
| **Haptics** | expo-haptics |
| **Fonts** | Plus Jakarta Sans · Be Vietnam Pro (Google Fonts) |

---

## Inhaltlicher Umfang

| Content-Typ | Menge |
|---|---|
| Phasen-Übungen | **131** (Phase 1-4 zusammen) |
| Beispiel-Komplettübungen | **61** (Extra-Level) |
| Grammatik-Übungen | **37** (5 Topics, gefiltert aus Phasen-Content) |
| Vokabeln | **357** (200 Nomen, 86 Verben, 71 Adjektive) |
| Lückentexte | **9** (3 Bilder × 3 Level) |
| Mix-&-Match-Runden | **6** |
| Gitternetze | **6** |
| Kreuzworträtsel | **4** |
| Bilder | **41** (31 Phasen-Bilder + 6 Fokus-Szenen + Extra) |
| Sprachen | **15** |

---

## Aktueller Status & Roadmap

**✅ Fertig:**
- Alle 4 Phasen + Level-Progression
- Wortschatz mit 5 Spielmodi + Suche + Favoriten
- Grammatik-Übungen (5 Topics)
- 15-sprachiges Übersetzungssystem (vollständig für Vokabeln + Kategorien)
- Onboarding + Profil + Fortschritt + Achievements
- Game-Feel-Animationen

**🟡 In Entwicklung / geplant:**
- Lehrer-Dashboard (Klassen-Übersicht, Schüler-Statistiken)
- Übersetzungen für Beispielsätze und Hints (bisher nur Vokabeln übersetzt)
- Push-Notifications für Lern-Erinnerungen
- Review-Modus („Meine Fehler nochmal üben")
- Landscape-Support für Grid-Spiele
- Weitere Lückentext-Inhalte

**🔴 Langfristig:**
- App-Store-Release (Apple / Google Play)
- Web-Version (Expo unterstützt das nativ)
- Weitere Prüfungsteile (Mündliche Prüfung, Hörverstehen)

---

## Weiterführende Dokumentation

- 🏗️ **[Architektur](./docs/ARCHITECTURE.md)** — Datenfluss, State Management, Routing, i18n-System, Animation-Hooks
- 🎯 **[Features im Detail](./docs/FEATURES.md)** — jedes Feature mit Screenshots und Nutzungsbeispielen
- 🤝 **[Beitragen](./docs/CONTRIBUTING.md)** — Setup, Code-Style, neue Übungen/Vokabeln hinzufügen
- 📋 **[Changelog](./docs/CHANGELOG.md)** — Versionshistorie

---

## Lizenz & Kontakt

Privates Projekt · Davis-Jonathan Kientopf

Bei Fragen oder Interesse: [GitHub Issues](https://github.com/DJ1791/Interaktive-Lernhilfe-Web-App/issues)
