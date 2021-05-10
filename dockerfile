FROM node:12.10.0

WORKDIR /app

RUN apt-get update


COPY package.json /app

RUN npm install

RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install -g nodemon

COPY . /app

CMD [ "npm", "start" ] 