FROM node:22

WORKDIR /usr/src/app

COPY package*.json .
COPY tsconfig.json .
COPY typeorm.config.ts .

RUN npm ci

COPY src ./src

EXPOSE 3000

CMD ["npm", "run", "start"]
