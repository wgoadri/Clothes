# ─────────────────────────────────────────────────────────────────
#  Base: Node 22 LTS on Debian Bookworm (slim)
#  Includes: zsh + Oh-My-Zsh, dev tools, Android SDK, Claude Code
# ─────────────────────────────────────────────────────────────────
FROM node:22-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# ── 1. System packages ────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Shell & terminal
    zsh \
    zsh-syntax-highlighting \
    # Dev essentials
    git \
    curl \
    wget \
    unzip \
    zip \
    ca-certificates \
    gnupg \
    # Build tools
    build-essential \
    # Python (Expo / EAS scripts sometimes need it)
    python3 \
    python3-pip \
    # Java 17 — required by Android build tools
    openjdk-17-jdk \
    # Useful CLI tools
    jq \
    htop \
    less \
    nano \
    vim \
    ripgrep \
    fd-find \
    bat \
    fzf \
    sudo \
    openssh-client \
    locales \
    && rm -rf /var/lib/apt/lists/*

# ── 2. Locale ─────────────────────────────────────────────────────
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8

# ── 3. Android SDK ────────────────────────────────────────────────
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH="${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${PATH}"

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    curl -fsSL -o /tmp/cmdline-tools.zip \
      "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" && \
    unzip -q /tmp/cmdline-tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools \
       ${ANDROID_HOME}/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip && \
    yes | sdkmanager --licenses > /dev/null && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# ── 4. Rename the existing 'node' user (UID/GID 1000) to 'vscode' ─
#
#  node:22-bookworm-slim already ships a 'node' user at UID/GID 1000.
#  groupadd/useradd would crash because 1000 is taken.
#  Instead we simply rename node → vscode in-place.
ARG USERNAME=vscode

RUN groupmod  --new-name ${USERNAME} node && \
    usermod   --login     ${USERNAME} \
              --home      /home/${USERNAME} \
              --move-home \
              --shell     /usr/bin/zsh \
              node && \
    # Allow passwordless sudo
    echo "${USERNAME} ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} && \
    chmod 0440 /etc/sudoers.d/${USERNAME}

# ── 5. Root-owned global tools (NOT Claude Code) ──────────────────
#  These are shared dev tools that don't need to self-update.
#  Claude Code is intentionally excluded here — see step 6.
RUN npm install -g \
    expo-cli \
    eas-cli \
    @expo/ngrok \
    typescript \
    ts-node \
    nodemon \
    prettier \
    eslint \
    npm-check-updates

# ── 6. Claude Code — installed as the vscode user ─────────────────
#
#  Claude Code needs to be owned by the running user so it can
#  self-update without sudo. We set a user-local npm prefix and
#  install only Claude Code there. The devcontainer feature will
#  also attempt install; this ensures the right ownership either way.
#
#  ~/.npm-global is baked into the image but the named volume for
#  ~/.claude (auth tokens) overlays it at runtime — that's fine,
#  they are different directories.
USER ${USERNAME}
ENV HOME=/home/${USERNAME}
ENV NPM_CONFIG_PREFIX=${HOME}/.npm-global
ENV PATH="${HOME}/.npm-global/bin:${PATH}"

RUN mkdir -p ${HOME}/.npm-global && \
    mkdir -p ${HOME}/.claude && \
    sudo chown -R vscode:vscode /home/vscode/.claude
    # npm install -g @anthropic-ai/claude-code && \

# ── 7. Oh-My-Zsh + plugins ────────────────────────────────────────
# Install Oh-My-Zsh non-interactively
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" \
    "" --unattended

# Community plugins
RUN git clone --depth=1 \
      https://github.com/zsh-users/zsh-autosuggestions \
      ${HOME}/.oh-my-zsh/custom/plugins/zsh-autosuggestions && \
    git clone --depth=1 \
      https://github.com/zsh-users/zsh-syntax-highlighting \
      ${HOME}/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting && \
    git clone --depth=1 \
      https://github.com/zsh-users/zsh-completions \
      ${HOME}/.oh-my-zsh/custom/plugins/zsh-completions

# Powerlevel10k theme
RUN git clone --depth=1 \
      https://github.com/romkatv/powerlevel10k.git \
      ${HOME}/.oh-my-zsh/custom/themes/powerlevel10k

# Copy .zshrc (owns the file as vscode)
COPY --chown=${USERNAME}:${USERNAME} scripts/.zshrc ${HOME}/.zshrc

# ── 8. Git global config ──────────────────────────────────────────
RUN git config --global safe.directory /workspace && \
    git config --global init.defaultBranch main

WORKDIR /workspace
