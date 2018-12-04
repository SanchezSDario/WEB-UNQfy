FROM node:8

ENV NODE_ENV=development
ENV DEBUG=true

WORKDIR /home/node/my_node_app

COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 5002

COPY . /home/node/my_node_app/

RUN chown -R node:users /home/node/
RUN ls

USER node

CMD [ "npm", "start" ]
