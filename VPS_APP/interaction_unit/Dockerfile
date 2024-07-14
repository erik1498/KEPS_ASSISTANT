FROM node:20.11.1-alpine

WORKDIR /usr/interaction_unit/workdir

COPY . .

RUN npm install -g npm@latest
RUN npm install -g serve
RUN npm install -g pnpm@latest
RUN pnpm install
RUN pnpm run build

EXPOSE 3000

CMD ["serve", "-s", "dist"]
