FROM node:8.15.0

ENV PORT="3000"

RUN mkdir -p /usr/src/app
COPY . /usr/src/app/

WORKDIR /usr/src/app/app_public
RUN npm install && \
	npm i -g @angular/cli && \
	npm install elastic-apm-js-base --save && \
	ng build --prod --output-path build

WORKDIR /usr/src/app
RUN apt-get update -y \
    && apt-get -y install curl python build-essential git ca-certificates \
    && npm install --unsafe-perm \
    && npm install elastic-apm-node --save

EXPOSE 3000
CMD npm start