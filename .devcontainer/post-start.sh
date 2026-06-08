#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
#  post-start.sh
#  Runs on EVERY container start, including after a rebuild.
#  Seeds named volumes from image defaults on first run.
#  Idempotent — safe to run many times with no side effects.
#
#  Volume layout:
#    ~/.zsh-persist/      ← zsh history, p10k config, any zsh tweaks
#    ~/.gitconfig-persist ← git global config (name, email, aliases)
#    ~/.ssh/              ← container SSH key (if generated)
#    ~/.claude/           ← Claude Code auth + settings (separate volume)
# ─────────────────────────────────────────────────────────────────
set -uo pipefail

ZSH_VOL="$HOME/.zsh-persist"
GIT_VOL="$HOME/.gitconfig-persist"

# ── 1. Zsh persist volume ─────────────────────────────────────────
mkdir -p "$ZSH_VOL"

# Seed history file
if [[ ! -f "$ZSH_VOL/.zsh_history" ]]; then
  touch "$ZSH_VOL/.zsh_history"
fi

# Seed p10k config — copy from image default if not yet personalised
if [[ ! -f "$ZSH_VOL/.p10k.zsh" ]]; then
  if [[ -f "$HOME/.p10k.zsh" ]]; then
    cp "$HOME/.p10k.zsh" "$ZSH_VOL/.p10k.zsh"
  else
    # Write a minimal p10k config so zsh doesn't prompt the wizard
    # The user can run `p10k configure` at any time to customise it
    cat > "$ZSH_VOL/.p10k.zsh" << 'P10K'
# Minimal Powerlevel10k config — run `p10k configure` to customise
# Generated automatically by post-start.sh
'builtin' 'local' '-a' 'p10k_config_opts'
[[ ! -o 'aliases'         ]] || p10k_config_opts+=('aliases')
[[ ! -o 'sh_glob'         ]] || p10k_config_opts+=('sh_glob')
[[ ! -o 'no_brace_expand' ]] || p10k_config_opts+=('no_brace_expand')
'builtin' 'setopt' 'no_aliases' 'no_sh_glob' 'brace_expand'

() {
  emulate -L zsh
  setopt no_unset

  typeset -g POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(
    dir            # current directory
    vcs            # git status
    prompt_char    # prompt symbol
  )
  typeset -g POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(
    status         # exit code
    command_execution_time  # last cmd duration
    node_version   # node version
  )

  typeset -g POWERLEVEL9K_MODE=nerdfont-complete
  typeset -g POWERLEVEL9K_PROMPT_ADD_NEWLINE=true
  typeset -g POWERLEVEL9K_PROMPT_CHAR_OK_{VIINS,VICMD,VIVIS,VIOWR}_FOREGROUND=76
  typeset -g POWERLEVEL9K_PROMPT_CHAR_ERROR_{VIINS,VICMD,VIVIS,VIOWR}_FOREGROUND=196
  typeset -g POWERLEVEL9K_DIR_FOREGROUND=31
  typeset -g POWERLEVEL9K_VCS_CLEAN_FOREGROUND=76
  typeset -g POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND=214
  typeset -g POWERLEVEL9K_VCS_MODIFIED_FOREGROUND=214
  typeset -g POWERLEVEL9K_NODE_VERSION_FOREGROUND=70
  typeset -g POWERLEVEL9K_COMMAND_EXECUTION_TIME_THRESHOLD=3
}

(( ${#p10k_config_opts} )) && setopt ${p10k_config_opts[@]}
'builtin' 'unset' 'p10k_config_opts'
P10K
    echo "  ℹ️  Minimal p10k config written. Run 'p10k configure' to customise your prompt."
  fi
fi

# ── 2. Git config persist volume ──────────────────────────────────
#
#  ~/.gitconfig can't be a named volume directly (Docker would make
#  it a directory). Instead we store the file in the volume and
#  symlink it to ~/.gitconfig.
if [[ ! -f "$GIT_VOL/.gitconfig" ]]; then
  # Seed from current ~/.gitconfig if it has content
  if [[ -s "$HOME/.gitconfig" && ! -L "$HOME/.gitconfig" ]]; then
    cp "$HOME/.gitconfig" "$GIT_VOL/.gitconfig"
  else
    # Create a blank one — post-create.sh fills in name/email
    touch "$GIT_VOL/.gitconfig"
  fi
fi

# Symlink ~/.gitconfig → volume (replace file with symlink)
if [[ ! -L "$HOME/.gitconfig" ]]; then
  rm -f "$HOME/.gitconfig"
  ln -s "$GIT_VOL/.gitconfig" "$HOME/.gitconfig"
fi

# ── 3. SSH directory ──────────────────────────────────────────────
#  The ~/.ssh volume is mounted directly, so just ensure perms.
if [[ -d "$HOME/.ssh" ]]; then
  chmod 700 "$HOME/.ssh"
  [[ -f "$HOME/.ssh/known_hosts" ]] && chmod 600 "$HOME/.ssh/known_hosts"
  [[ -f "$HOME/.ssh/id_ed25519"  ]] && chmod 600 "$HOME/.ssh/id_ed25519"
fi

# ── 4. Claude config directory ────────────────────────────────────
#  Mounted as a named volume — just ensure it exists and is writable.
mkdir -p "$HOME/.claude"

# ── 5. Print status summary ───────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  🔄  Container started — persistent state loaded     ║"
echo "║                                                      ║"

# Claude auth status
if [[ -f "$HOME/.claude/.credentials.json" ]]; then
  echo "║  ✅  Claude Code: authenticated                      ║"
else
  echo "║  ⚠️   Claude Code: run 'claude auth login'            ║"
fi

# Git identity
GIT_NAME=$(git config --global user.name 2>/dev/null || true)
if [[ -n "$GIT_NAME" ]]; then
  echo "║  ✅  Git identity: $GIT_NAME"
else
  echo "║  ⚠️   Git identity: not set (post-create will prompt) ║"
fi

# SSH key
if [[ -f "$HOME/.ssh/id_ed25519.pub" ]]; then
  echo "║  ✅  SSH key: present                                 ║"
else
  echo "║  ℹ️   SSH key: none (using HTTPS for git)             ║"
fi

echo "║                                                      ║"
echo "║  Tip: run 'p10k configure' to customise your prompt  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
