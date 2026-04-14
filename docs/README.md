# DTZ Bildbeschreibung — Interactive Learning App

> Mobile learning app preparing learners for the image-description task of the **Deutsch-Test für Zuwanderer (DTZ, level A2/B1)**.

[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)](https://expo.dev/)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020)](https://docs.expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Active%20Development-orange)]()

📖 **Deutsche Version (primary):** [../README.md](../README.md)

> **Note:** German is the primary documentation language because the app's learners and teachers are primarily German-speaking. This English version is a condensed mirror for international readers.

---

## What is it?

An interactive React Native mobile app that systematically prepares DaZ learners (German as a Second Language) for the **image-description task** of the DTZ exam. The app walks through **4 didactic phases** (Introduction, Positions, Prepositions, Adjectives), combined with **contextual vocabulary building** and **targeted grammar drills** — translatable into 15 native languages.

## Who is it for?

- **Integration-course participants** (A2/B1) preparing for the DTZ
- **DaZ teachers** looking for a structured exercise resource for their students
- **Self-learners** working purposefully on their German

## Core features

### 🎯 Image description in 4 phases
1. **Introduction** — "The image shows..." / first impression
2. **Positions + verbs** — left, right, front, back; stand, lie, sit
3. **Prepositions + dative** — on the table, under the bench, between the cars
4. **Adjectives** — declension, colors, properties

Each phase has **3 difficulty levels**, progressing from simple fill-in-the-blank to free sentence construction with error correction.

### 📘 Vocabulary training
- **357 contextual words** across 12 thematic categories
- **Full-text search**, **favorites** ("hard words"), **5 game modes**: fill-in-blank, article quiz, mix & match, word grid, crossword

### 🔢 Grammar drills
Targeted exercises on the 5 most common stumbling blocks: accusative, dative, prepositions, adjective declension, word order.

### 🌍 Translations in 15 languages
English, Spanish, French, Ukrainian, Russian, Turkish, Hebrew, Arabic, Mandarin, Taiwanese (Hokkien), Thai, Persian, Polish, Czech, Romanian.

### 🎮 Game feel & motivation
Daily XP goal, streaks, 10 achievements, weekly chart, spring-physics animations, automatic image shrinking when the keyboard opens.

---

## Quickstart

```bash
git clone https://github.com/DJ1791/Interaktive-Lernhilfe-Web-App.git
cd Interaktive-Lernhilfe-Web-App/bildbeschreibung-app
npm install --legacy-peer-deps
npx expo start
```

Then scan the QR code with the Camera app (iOS) or Expo Go (Android).

**Demo logins:** `davis / DK17`, `aldijana / AR1`, `lehrkraft / TEACH99` (see [`bildbeschreibung-app/data/auth.ts`](../bildbeschreibung-app/data/auth.ts) for all 17 accounts).

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | React Native 0.81 · Expo SDK 54 |
| Routing | expo-router v6 (file-based) |
| Language | TypeScript 5.9 (strict) |
| State | Zustand 5 + AsyncStorage (persist) |
| Animation | react-native-reanimated 4 + gesture-handler 2 |
| UI | Custom glassmorphic design, LinearGradient, MaterialIcons |
| Haptics | expo-haptics |
| Fonts | Plus Jakarta Sans · Be Vietnam Pro |

---

## Further documentation

- 🏗️ **[ARCHITECTURE.md](./ARCHITECTURE.md)** — data flow, state management, routing, i18n, animation hooks
- 🎯 **[FEATURES.md](./FEATURES.md)** — every feature in detail
- 🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)** — setup, code style, adding content
- 📋 **[CHANGELOG.md](./CHANGELOG.md)** — version history

---

## License & contact

Private project · Davis-Jonathan Kientopf

Questions or interest: [GitHub Issues](https://github.com/DJ1791/Interaktive-Lernhilfe-Web-App/issues)
