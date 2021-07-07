FROM node:6 as builder

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD ./package.json /usr/src/app
RUN npm install
ADD ./src /usr/src/app/src
ADD ./public /usr/src/app/public
RUN npm run build

FROM nginx:1.13

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
