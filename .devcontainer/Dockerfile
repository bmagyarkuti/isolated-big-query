FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-12

WORKDIR /code
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
  && apt-get -y install --no-install-recommends git \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists/*

ENV DEBIAN_FRONTEND=dialog

