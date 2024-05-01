FROM node:20.11.1-alpine

WORKDIR /usr/interaction_unit/workdir

COPY . .

RUN npm install -g pnpm@latest

RUN pnpm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
