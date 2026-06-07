# ─────────────────────────────────────────────────────────────────
#  .zshrc — Dev Container shell config
#  Powerlevel10k + Oh-My-Zsh + productivity plugins
# ─────────────────────────────────────────────────────────────────

# ── Powerlevel10k instant prompt (keep at top) ────────────────────
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# ── Path to Oh-My-Zsh ─────────────────────────────────────────────
export ZSH="$HOME/.oh-my-zsh"

# ── Theme ─────────────────────────────────────────────────────────
ZSH_THEME="powerlevel10k/powerlevel10k"

# ── Plugins ───────────────────────────────────────────────────────
plugins=(
  git                      # git aliases: gst, gco, glog, etc.
  node                     # node aliases & completions
  npm                      # npm completions
  docker                   # docker completions
  vscode                   # 'code' shortcut helpers
  fzf                      # fuzzy finder keybindings (Ctrl+R, Ctrl+T)
  zsh-autosuggestions      # fish-style inline suggestions (→ to accept)
  zsh-syntax-highlighting  # red = invalid cmd, green = valid
  zsh-completions          # extra completion definitions
  z                        # jump to frequent dirs: z myproject
  colored-man-pages        # colour in man pages
  command-not-found        # suggest package when cmd missing
)

source $ZSH/oh-my-zsh.sh

# ── Environment ───────────────────────────────────────────────────
# ── npm-global prefix (Claude Code lives here, can self-update) ──────
export NPM_CONFIG_PREFIX="$HOME/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"

# ── Android & Java ───────────────────────────────────────────────
export ANDROID_HOME=/opt/android-sdk
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export EDITOR=nano
export LANG=en_US.UTF-8

# ── History ───────────────────────────────────────────────────────
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=/workspace/.zsh_history
setopt HIST_IGNORE_DUPS
setopt SHARE_HISTORY
setopt APPEND_HISTORY

# ── fzf (if available) ────────────────────────────────────────────
[ -f /usr/share/doc/fzf/examples/key-bindings.zsh ] && \
  source /usr/share/doc/fzf/examples/key-bindings.zsh

# ── Useful aliases ────────────────────────────────────────────────
# Navigation
alias ..="cd .."
alias ...="cd ../.."
alias ll="ls -lahF --color=auto"
alias la="ls -lA --color=auto"

# bat as better cat (if installed)
alias cat="bat --pager=never 2>/dev/null || cat"

# fd as better find
alias find="fdfind 2>/dev/null || find"

# Expo shortcuts
alias es="npx expo start"
alias ea="npx expo start --android"
alias eb="eas build"
alias ep="npx expo prebuild"

# Node / npm shortcuts
alias ni="npm install"
alias nid="npm install --save-dev"
alias nr="npm run"
alias ncu="ncu -i"        # interactive upgrade via npm-check-updates

# TypeScript
alias tsc="npx tsc"
alias tsw="npx tsc --watch"

# Git safety wrappers (Claude cannot push, merge to main/master, or force-push)
git() {
  # ── Block: git push ───────────────────────────────────────────
  if [[ "$1" == "push" ]]; then
    echo ""
    echo "╔══════════════════════════════════════════════════╗"
    echo "║  🚫  git push is DISABLED in this container      ║"
    echo "║  Push from your host machine instead.            ║"
    echo "║  This prevents AI agents from pushing code.      ║"
    echo "╚══════════════════════════════════════════════════╝"
    echo ""
    return 1
  fi

  # ── Block: direct commit to main / master ─────────────────────
  if [[ "$1" == "commit" ]]; then
    local branch
    branch=$(command git rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [[ "$branch" == "main" || "$branch" == "master" ]]; then
      echo ""
      echo "╔══════════════════════════════════════════════════╗"
      echo "║  🚫  Direct commit to '$branch' is blocked       ║"
      echo "║  Create a feature branch first:                  ║"
      echo "║    git checkout -b feat/my-feature               ║"
      echo "╚══════════════════════════════════════════════════╝"
      echo ""
      return 1
    fi
  fi

  # ── Block: --no-verify bypass ─────────────────────────────────
  if [[ "$1" == "commit" ]]; then
    for arg in "$@"; do
      if [[ "$arg" == "--no-verify" || "$arg" == "-n" ]]; then
        echo ""
        echo "╔══════════════════════════════════════════════════╗"
        echo "║  🚫  --no-verify is FORBIDDEN in this container  ║"
        echo "║  Pre-commit hooks exist for code quality.        ║"
        echo "╚══════════════════════════════════════════════════╝"
        echo ""
        return 1
      fi
    done
  fi

  # ── Block: force push ─────────────────────────────────────────
  if [[ "$1" == "push" ]] || [[ "$*" == *"--force"* ]] || [[ "$*" == *"-f"* && "$1" == "push" ]]; then
    echo ""
    echo "╔══════════════════════════════════════════════════╗"
    echo "║  🚫  Force push is DISABLED in this container    ║"
    echo "╚══════════════════════════════════════════════════╝"
    echo ""
    return 1
  fi

  # All other git commands pass through normally
  command git "$@"
}

# ── Powerlevel10k config (auto-generated on first run) ────────────
[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh
