export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
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
)

source "$ZSH/oh-my-zsh.sh"

HISTSIZE=10000
SAVEHIST=10000
HISTFILE="${HISTFILE:-$HOME/.history/.zsh_history}"
setopt SHARE_HISTORY HIST_IGNORE_DUPS

export EDITOR=nano

alias es="npx expo start"
alias ni="npm install"
alias nr="npm run"

# ── Powerlevel10k config (auto-generated on first run) ────────────
[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh