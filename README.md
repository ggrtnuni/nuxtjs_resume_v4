# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## 動作確認環境

- Windows 11 Pro
- WSL2
- Ubuntu 22.04.5 LTS
- Docker version 28.0.1, build 068a01e

## Nuxt3 の Docker 作成

格納先ディレクトリを作る。

```bash
mkdir nuxtjs_resume_v4
cd nuxtjs_resume_v4
```

`Dockerfile` を作る。

```dockerfile
FROM node:22-slim

RUN apt-get update \
    && apt-get install vim -y \
    && apt-get install git -y \
    && npm install -g nuxi nuxt3

WORKDIR /opt/src

USER node
```

`docker-compose.yml` を作る。

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

ホスト側とボリュームを共有する `/opt/src` とその中の `/opt/src/nuxt-app/node_modules` はコンテナ起動前に作っておく。
- コンテナ起動時に docker に作らせると所有者が root になってしまうため。
- ホスト側ユーザとコンテナ側ユーザ (node) が共に uid:1000, gid:1000 前提。
- uid, gid が食い違う場合は別途調整が必要。

```bash
mkdir -p src/nuxt-app/node_modules
```

コンテナ起動、起動していることを確認、コンテナのシェルに入る。

```bash
docker compose up -d
docker compose ps
docker compose exec app sh
```

nuxt のプロジェクトをウィザードに従って作る。

```bash
npx nuxi init
```

- アプリ名はデフォルト`./nuxt-app`のままにする（先に作ったディレクトリ名に合わせるため）。
- 事前に src/nuxt-app/node_modules を作っておいたため上書きするかと聞かれる。
- パッケージマネージャはとりあえず npm。 
- モジュールはとりあえず ESLint だけ入れておく。

nuxt2 を開発サーバで起動する。

```bash
cd nuxt-app
npm install
npm run dev
```

下記でアクセスする。
ソースコードを編集したら即座に変更が反映されたら OK。

http://localhost:3000


## 公開用ビルド

```bash
npm run build
```

ローカルでプレビューしたい場合。


```bash
# npm
npm run preview
```

より詳しくは→ [deployment documentation](https://nuxt.com/docs/getting-started/deployment)

