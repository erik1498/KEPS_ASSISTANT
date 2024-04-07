FROM node:20.11.1-slim

WORKDIR /usr/process_unit/workdir

COPY . .

RUN npm install

EXPOSE 2001

CMD ["npm", "run", "start"]