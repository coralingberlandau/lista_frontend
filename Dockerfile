
FROM node:20-bullseye

WORKDIR /app

RUN npm install -g expo-cli

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 19000 19001 19002

CMD ["npm", "start"]
