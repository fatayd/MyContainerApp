FROM node:latest 

WORKDIR /jeu_cont
COPY package.json .
RUN npm install && npm install  -g typescript 
COPY . .
RUN tsc main.ts
CMD [ "node", "main.js"]