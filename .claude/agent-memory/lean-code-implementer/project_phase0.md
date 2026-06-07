---
name: project-phase-0-foundation
description: Phase 0 stabilization decisions for the wardrobe Expo app — language, SDK, tooling
metadata:
  type: project
---

Language is JavaScript (ES2021+), not TypeScript — no migration planned.

Firebase: web `firebase` SDK only; `@react-native-firebase/*` packages removed.

ESLint flat config (`eslint.config.js`) uses `@eslint/js` + `globals` (browser + node). JSX parsed via `ecmaFeatures.jsx`. Pre-existing lint warnings (~238) are known/deferred; 1 pre-existing error (`Alert` not defined in `WardrobeScreen.js`).

**Why:** User locked these two decisions explicitly before Phase 0 began.

**How to apply:** Never suggest TS migration or `@react-native-firebase`. When adding new lint rules, edit `eslint.config.js` flat config style.
