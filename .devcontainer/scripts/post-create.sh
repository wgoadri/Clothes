#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
#  post-create.sh
#  Runs ONCE after the container is built for the first time.
#  Sets up: git identity prompt, git hooks, Claude Code settings.
#
#  Note: intentionally NO "set -e" — one failing step (husky,
#  missing .git, etc.) must not abort the entire setup.
# ─────────────────────────────────────────────────────────────────
set -uo pipefail

WORKSPACE=/workspace
HOOKS_DIR="$WORKSPACE/.git/hooks"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  🛠  Dev Container — post-create setup               ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── 1. Git identity ───────────────────────────────────────────────
#  We do NOT mount the host ~/.gitconfig (isolation by design).
#  Ask once; stored in the named volume so it survives rebuilds.
echo "──────────────────────────────────────────────────────"
echo "  Git identity setup (used for commits inside the container)"
echo "──────────────────────────────────────────────────────"

GIT_NAME=$(git config --global user.name 2>/dev/null || true)
GIT_EMAIL=$(git config --global user.email 2>/dev/null || true)

if [[ -z "$GIT_NAME" ]]; then
  read -rp "  Enter your git name  [e.g. Adrien Dupont]: " GIT_NAME
  git config --global user.name "$GIT_NAME"
fi
if [[ -z "$GIT_EMAIL" ]]; then
  read -rp "  Enter your git email [e.g. adrien@example.com]: " GIT_EMAIL
  git config --global user.email "$GIT_EMAIL"
fi

git config --global core.editor    "vim"
git config --global init.defaultBranch main
git config --global pull.rebase    false
git config --global safe.directory "$WORKSPACE"
echo "  ✅  Git identity: $GIT_NAME <$GIT_EMAIL>"

# ── 2. Git hooks ──────────────────────────────────────────────────
echo ""
echo "──────────────────────────────────────────────────────"
echo "  Installing git hooks"
echo "──────────────────────────────────────────────────────"

if [[ -d "$WORKSPACE/.git" ]]; then
  mkdir -p "$HOOKS_DIR"

  # pre-push: blocks ALL pushes from inside the container
  cat > "$HOOKS_DIR/pre-push" << 'HOOK'
#!/usr/bin/env bash
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  🚫  git push is DISABLED inside this dev container  ║"
echo "║                                                      ║"
echo "║  This container is an isolated sandbox.              ║"
echo "║  To push your changes:                               ║"
echo "║    1. Commit here  (git commit is fine)              ║"
echo "║    2. Push from your HOST machine terminal           ║"
echo "║                                                      ║"
echo "║  This also prevents Claude Code from auto-pushing.   ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
exit 1
HOOK

  # pre-commit: blocks direct commits to main/master
  cat > "$HOOKS_DIR/pre-commit" << 'HOOK'
#!/usr/bin/env bash
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [[ "$BRANCH" == "main" || "$BRANCH" == "master" ]]; then
  echo ""
  echo "╔══════════════════════════════════════════════════════╗"
  echo "║  🚫  Direct commit to '$BRANCH' is blocked           ║"
  echo "║                                                      ║"
  echo "║  Create a feature branch first:                      ║"
  echo "║    git checkout -b feat/my-feature                   ║"
  echo "╚══════════════════════════════════════════════════════╝"
  echo ""
  exit 1
fi
exit 0
HOOK

  chmod +x "$HOOKS_DIR/pre-push" "$HOOKS_DIR/pre-commit"
  echo "  ✅  Git hooks installed (pre-push blocks all push, pre-commit blocks main/master)"
else
  echo "  ⚠️  No .git directory found — hooks will be installed on first 'git init'"
fi

# ── 3. Claude Code settings ───────────────────────────────────────
echo ""
echo "──────────────────────────────────────────────────────"
echo "  Writing Claude Code settings"
echo "──────────────────────────────────────────────────────"

mkdir -p "$WORKSPACE/.claude"
cat > "$WORKSPACE/.claude/settings.json" << 'JSON'
{
  "permissions": {
    "allow": [
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git checkout:*)",
      "Bash(git branch:*)",
      "Bash(git status)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git fetch:*)",
      "Bash(git stash:*)",
      "Bash(git merge:*)",
      "Bash(git rebase:*)",
      "Bash(npm:*)",
      "Bash(npx:*)",
      "Bash(node:*)",
      "Bash(expo:*)",
      "Bash(eas:*)",
      "Bash(ls:*)",
      "Bash(cat:*)",
      "Bash(find:*)",
      "Bash(grep:*)",
      "Bash(mkdir:*)",
      "Bash(cp:*)",
      "Bash(mv:*)",
      "Bash(rm:*)",
      "Bash(echo:*)",
      "Bash(touch:*)",
      "Bash(chmod:*)"
    ],
    "deny": [
      "Bash(git push:*)",
      "Bash(git push --force:*)",
      "Bash(ssh:*)",
      "Bash(scp:*)",
      "Bash(curl * | bash:*)",
      "Bash(wget * | bash:*)",
      "Bash(sudo rm -rf /*:*)"
    ]
  }
}
JSON
echo "  ✅  Claude Code settings written to .claude/settings.json"

# ── 4. npm install (bypassing the husky prepare script) ───────────
#
#  Husky's "prepare" script calls `husky install` which tries to
#  copy a shim into .husky/_/h — this fails with EPERM when the
#  container user doesn't yet own the workspace during postCreate.
#
#  NPM_CONFIG_IGNORE_SCRIPTS=true skips ALL scripts (including
#  prepare/husky) for this one install.  We then manually reinstate
#  husky so the hooks work normally afterward.
if [[ -f "$WORKSPACE/package.json" ]]; then
  echo ""
  echo "──────────────────────────────────────────────────────"
  echo "  Installing npm dependencies (husky prepare skipped)"
  echo "──────────────────────────────────────────────────────"
  cd "$WORKSPACE"

  # Install deps without running any lifecycle scripts
  NPM_CONFIG_IGNORE_SCRIPTS=true npm install

  # Now re-run husky install manually if husky is present
  if [[ -f "$WORKSPACE/node_modules/.bin/husky" ]]; then
    echo "  🐶  Initialising husky..."
    npx husky install 2>/dev/null && echo "  ✅  Husky initialised" \
      || echo "  ⚠️  Husky init skipped (not blocking)"
  fi

  echo "  ✅  npm install complete"
fi


echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  Dev Container ready!                            ║"
echo "║                                                      ║"
echo "║  Run 'claude' to sign in to Claude Code              ║"
echo "║  Run 'expo start' to start your Expo dev server      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
