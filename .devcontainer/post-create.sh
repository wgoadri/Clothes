#!/usr/bin/env bash
# Runs once after the container is built.
set -uo pipefail
WORKSPACE=/workspace

# git defaults (identity is copied from your host ~/.gitconfig by VS Code)
git config --global --add safe.directory "$WORKSPACE"
git config --global init.defaultBranch main
git config --global core.editor vim

# Pre-trust common hosts so SSH doesn't hang on first connection
mkdir -p "$HOME/.ssh" && chmod 700 "$HOME/.ssh"
ssh-keyscan -H github.com gitlab.com >> "$HOME/.ssh/known_hosts" 2>/dev/null
chmod 600 "$HOME/.ssh/known_hosts" 2>/dev/null || true

# Backstop push-block (the Claude deny rule below is the primary one)
if [[ -d "$WORKSPACE/.git" ]]; then
  cat > "$WORKSPACE/.git/hooks/pre-push" << 'HOOK'
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
  chmod +x "$WORKSPACE/.git/hooks/pre-push"
fi

# Claude Code permissions.
# defaultMode "default": Claude asks before any command not in "allow".
# "deny" always wins, so it also covers --no-verify / --force.
mkdir -p "$WORKSPACE/.claude"
cat > "$WORKSPACE/.claude/settings.json" << 'JSON'
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "defaultMode": "default",
    "allow": [
      "Bash(npm:*)", "Bash(npx:*)", "Bash(node:*)",
      "Bash(expo:*)", "Bash(eas:*)", "Bash(tsc:*)",
      "Bash(eslint:*)", "Bash(prettier:*)",
      "Bash(git add:*)", "Bash(git commit:*)", "Bash(git checkout:*)",
      "Bash(git switch:*)", "Bash(git branch:*)", "Bash(git status:*)",
      "Bash(git log:*)", "Bash(git diff:*)", "Bash(git fetch:*)",
      "Bash(git stash:*)", "Bash(git merge:*)", "Bash(git rebase:*)",
      "Bash(ls:*)", "Bash(cat:*)", "Bash(find:*)", "Bash(grep:*)",
      "Bash(rg:*)", "Bash(mkdir:*)", "Bash(cp:*)", "Bash(mv:*)",
      "Bash(touch:*)", "Bash(echo:*)"
    ],
    "deny": [
      "Bash(git push:*)",
      "Bash(npm publish:*)",
      "Bash(sudo:*)",
      "Bash(rm -rf /:*)",
      "Bash(chmod 777:*)"
    ]
  }
}
JSON

# Install dependencies (husky/prepare scripts run normally now)
if [[ -f "$WORKSPACE/package.json" ]]; then
  cd "$WORKSPACE" && npm install
fi

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  Dev Container ready!                            ║"
echo "║                                                      ║"
echo "║  Run 'claude' to sign in to Claude Code              ║"
echo "║  Run 'expo start' to start your Expo dev server      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
