FROM node:current-alpine as ts-develop
WORKDIR /workspaces/situm-js-sdk
RUN apk update && apk upgrade && \
    apk add --no-cache bash git
EXPOSE 9229
ENTRYPOINT /bin/sh

FROM ts-development as ts-compiler
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