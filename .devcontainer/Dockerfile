FROM node:22-alpine as ts-develop
WORKDIR /workspaces/situm-js-sdk
RUN apk update && apk upgrade && \
    apk add --no-cache bash git
EXPOSE 9229
USER node
HEALTHCHECK --interval=30s --timeout=3s CMD node --version || exit 1
ENTRYPOINT /bin/sh

FROM ts-develop as ts-compiler
WORKDIR /usr/app
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM ts-compiler as ts-test
COPY --from=ts-compiler /usr/app/package*.json ./
COPY --from=ts-compiler /usr/app/dist ./dist
RUN npm run test