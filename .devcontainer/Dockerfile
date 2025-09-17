FROM debian:trixie-slim

ENV DEBIAN_FRONTEND=noninteractive

# Install required packages and Node.js (via NodeSource)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        git zsh curl wget \
        gnupg \
        build-essential \
        sudo \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user 'vscode' (uid/gid 1000) and grant sudo without password
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=1000
RUN groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME} \
    && usermod -aG sudo ${USERNAME} \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME}

ENV TERM=xterm-256color \
    ZSH_THEME=agnoster

# Setup zsh for the root user
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN echo "ZSH" && \
    apt-get update && apt-get install --no-install-recommends --assume-yes \
    zsh fontconfig jq && \
    # Download and install fonts-powerline
    # An installation via apt-get is not possible for trixie,
	# because the package is only available in unstable(sid).
    # https://packages.debian.org/sid/fonts-powerline
	# https://api.ftp-master.debian.org/madison?package=fonts-powerline&table=debian
    FONTS_POWERLINE_VERSION=$(curl -s 'https://api.ftp-master.debian.org/madison?package=fonts-powerline&table=debian&s=unstable&f=json' | jq -r '.[0]["fonts-powerline"].unstable | keys[0]'); echo "Latest Version: \"$FONTS_POWERLINE_VERSION\"" && \
    FONTS_POWERLINE_URL="http://ftp.de.debian.org/debian/pool/main/p/powerline/fonts-powerline_${FONTS_POWERLINE_VERSION}_all.deb" && \
    curl -o fonts-powerline.deb -L ${FONTS_POWERLINE_URL} && \
    dpkg -i fonts-powerline.deb && \
    rm fonts-powerline.deb && \
    # Install Oh My Zsh
    curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh | sh && \
    # Add Zsh plugins
    git clone --depth=1 --no-tags https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions && \
    git clone --depth=1 --no-tags https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions && \
    git clone --depth=1 --no-tags https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search && \
    # Update .zshrc
    sed -i "s/plugins=(git)/plugins=(git zsh-completions zsh-autosuggestions zsh-history-substring-search)/" /root/.zshrc && \
    sed -i "s/ZSH_THEME=\"agnoster\"/ZSH_THEME=\"robbyrussell\"/" /root/.zshrc && \
	  sed -i "s/# DISABLE_AUTO_UPDATE=\"true\"/DISABLE_AUTO_UPDATE=\"true\"/" /root/.zshrc && \
	  # Cleanup
	  apt-get autoremove -y && \
    apt-get clean autoclean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copy root's Oh My Zsh and .zshrc into the non-root user's home
# Make zsh their login shell
RUN if [ -d /root/.oh-my-zsh ] || [ -f /root/.zshrc ]; then \
      cp -a /root/.oh-my-zsh /home/${USERNAME}/.oh-my-zsh 2>/dev/null || true; \
      cp -a /root/.zshrc /home/${USERNAME}/.zshrc 2>/dev/null || true; \
    fi && \
    chown -R ${USER_UID}:${USER_GID} /home/${USERNAME}/.oh-my-zsh /home/${USERNAME}/.zshrc 2>/dev/null || true && \
    # Ensure the user's login shell is zsh
    if command -v chsh >/dev/null 2>&1; then \
      chsh -s /usr/bin/zsh ${USERNAME} || true; \
    else \
      usermod -s /usr/bin/zsh ${USERNAME} || true; \
    fi

# Install Node.js 20 (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g npm@latest \
    && npm install -g gulp-cli @antora/cli \
    && rm -rf /var/lib/apt/lists/* /root/.npm /root/.cache

WORKDIR /workspace
USER ${USERNAME}

ENV SHELL=/usr/bin/zsh

CMD ["bash"]
