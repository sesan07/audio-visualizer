FROM node:16.16-alpine as build-env

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci

COPY ./src ./src
COPY ./angular.json .
COPY ./tsconfig.json .
COPY ./tsconfig.app.json .
RUN npm run build

FROM nginx:latest

COPY --from=build-env /app/dist/audio-visualizer /usr/share/nginx/html
COPY ./nginx/default.conf.template /etc/nginx/templates/

EXPOSE 80