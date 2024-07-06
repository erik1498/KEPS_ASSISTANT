FROM node:20.11.1-alpine

WORKDIR /usr/interaction_unit/workdir

COPY . .

RUN npm install -g npm@latest
RUN npm install -g pnpm@latest
RUN pnpm install

EXPOSE 5173

CMD ["pnpm", "run", "dev"]
