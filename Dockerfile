FROM node:alpine

WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

RUN yarn build
RUN yarn typeorm migration:run

EXPOSE 3333

CMD ["yarn", "start"]
