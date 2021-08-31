FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

EXPOSE 3001

RUN npm install 

RUN npm install -g nodemon

USER node

CMD ["npm", "run", "dev"]