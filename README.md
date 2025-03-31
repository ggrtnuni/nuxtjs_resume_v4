# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## version

Ubuntu 22.04.5 LTS
Docker version 28.0.1, build 068a01e

## Docker

```bash
mkdir nuxtjs_resume_v4
cd nuxtjs_resume_v4
vi Dockerfile
```

```dockerfile
FROM node:22-slim

RUN apt-get update \
    && apt-get install vim -y \
    && apt-get install git -y \
    && npm install -g nuxi nuxt3

WORKDIR /opt/src

USER node
```

```bash
vi docker-compose.yml
```

```yaml
services:
  app:
    build: .
    volumes:
      - ./src:/opt/src:cached
      - node_modules:/opt/src/nuxt-app/node_modules
    working_dir: "/opt/src"
    ports:
      - "3000:3000"
    tty: true
    environment:
      - HOST=0.0.0.0
      - port=3000
volumes:
  node_modules:
    driver: local
    driver_opts:
      type: none
      device: ./src/nuxt-app/node_modules
      o: bind
```

ホスト側とコンテナ側でパーミッションエラーを回避するため事前にホスト側で作っておく。
※ ホスト側ユーザが uid:1000, gid:1000 前提。

```bash
mkdir -p src/nuxt-app/node_modules
```

```bash
docker compose up -d
docker compose ps
docker compose exec app sh
```

コンテナのシェル。

```bash
npx nuxi init
```

- アプリ名はデフォルトのままにする。 ./nuxt-app
- 上書きするかと聞かれるので上書きを選ぶ。(事前に src/nuxt-app/node_modules を作っておいたため)
- パッケージマネージャは npm
- git リポジトリ初期化は yes
- 公式モジュールはとりあえず ESLint だけ入れておく。

```bash
cd nuxt-app
npm install
npm run dev
```

下記でアクセスする。

http://localhost:3000


## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
