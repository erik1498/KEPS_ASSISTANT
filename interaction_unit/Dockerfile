FROM node:20.11.1-alpine

WORKDIR /usr/interaction_unit/workdir

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]