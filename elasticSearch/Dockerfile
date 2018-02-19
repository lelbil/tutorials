FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN apt-get update && apt-get install -f -y unzip

ADD https://cdn.patricktriest.com/data/books.zip ./
RUN unzip books.zip -x __MACOSX/*

COPY . .

CMD ["npm", "start"]
