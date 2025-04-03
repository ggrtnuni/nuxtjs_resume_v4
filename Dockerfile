FROM node:22-slim

RUN apt-get update \
    && apt-get install vim -y \
    && apt-get install git -y \
    && apt-get install bash -y \
    && npm install -g nuxi nuxt3

WORKDIR /opt/src

USER node
