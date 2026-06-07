# Claude Code — Project Instructions

This file is read automatically by Claude Code on every session.
It defines rules, conventions, and constraints for this project.

---

## 🚫 Hard rules (never break these)

- **NEVER run `git push`** — pushing is disabled in this container by design. Commits are fine; pushing is done from the host machine.
- **NEVER commit directly to `main` or `master`** — always work on a feature branch.
- **NEVER use `git commit --no-verify`** — pre-commit hooks exist for a reason.
- **NEVER run `sudo rm -rf` on directories outside `/workspace`**.
- **NEVER install packages globally** with `npm install -g` unless explicitly asked.

---

## 📁 Project structure

```
/workspace/
├── .devcontainer/       # Container config — do not modify
├── .claude/             # Claude Code settings — do not modify
├── src/                 # App source code
├── assets/              # Static assets (images, fonts)
├── package.json
└── CLAUDE.md            # ← you are here
```

---

## 🛠 Tech stack

- **Framework**: Expo (React Native)
- **Language**: JavaScript (ES2021+)
- **Package manager**: npm
- **Runtime**: Node.js 22

---

## 🌿 Git workflow

1. Always `git status` before starting work.
2. Create a feature branch: `git checkout -b feat/description`
3. Make small, focused commits with clear messages.
4. Commit format: `type(scope): short description`
   - Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`
   - Example: `feat(auth): add login screen`

---

## 💅 Code style

- **Formatter**: Prettier (runs on save)
- **Linter**: ESLint
- **Indentation**: 2 spaces
- **Quotes**: single quotes in JS/TS
- **Max line length**: 100 characters

---

## 🧪 Before committing

- Run `npm run lint` and fix all errors before every commit.
- Keep commits small and atomic.
