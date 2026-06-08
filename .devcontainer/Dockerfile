# Node 22 LTS on Debian Bookworm + zsh and a few QoL CLIs.
# Claude Code is installed by the devcontainer feature (see devcontainer.json).
FROM node:22-bookworm-slim
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
      zsh git curl ca-certificates gnupg \
      less nano vim ripgrep jq openssh-client sudo locales \
 && rm -rf /var/lib/apt/lists/*
# Need to compile a native npm dep later? add: build-essential python3

RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8

# The base image ships a 'node' user at UID/GID 1000. Rename it to 'vscode'
# (the user Claude Code and VS Code expect) and grant passwordless sudo.
ARG USERNAME=vscode
RUN groupmod --new-name ${USERNAME} node \
 && usermod --login ${USERNAME} --home /home/${USERNAME} --move-home --shell /usr/bin/zsh node \
 && echo "${USERNAME} ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} \
 && chmod 0440 /etc/sudoers.d/${USERNAME}

USER ${USERNAME}
ENV HOME=/home/${USERNAME}

# Pre-create the mount targets as vscode so the named volumes inherit ownership.
RUN mkdir -p ${HOME}/.claude ${HOME}/.history

# Oh My Zsh + 2 plugins. Default theme, no special fonts needed.
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
 && git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions \
      ${HOME}/.oh-my-zsh/custom/plugins/zsh-autosuggestions \
 && git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting \
      ${HOME}/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting

      
# Powerlevel10k theme
RUN git clone --depth=1 \
      https://github.com/romkatv/powerlevel10k.git \
      ${HOME}/.oh-my-zsh/custom/themes/powerlevel10k
COPY --chown=${USERNAME}:${USERNAME} .zshrc ${HOME}/.zshrc

WORKDIR /workspace