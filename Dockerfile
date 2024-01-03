FROM node:18-alpine as base

FROM base as development
WORKDIR /usr/src/app
RUN npm install yarn
COPY package* .
COPY yarn.lock .
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn","dev"]

