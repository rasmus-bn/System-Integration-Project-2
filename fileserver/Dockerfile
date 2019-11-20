FROM node:8

WORKDIR /home/node/app
COPY . .

RUN npm install
RUN npm install ws@3.3.2 --save-dev --save-exact

CMD ["npm", "start"]
