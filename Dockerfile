FROM node:18

WORKDIR /api

COPY package*.json ./
RUN npm install

COPY . .

ENV SERVER_PORT=5000

EXPOSE 5000

CMD [ "npm", "start" ]