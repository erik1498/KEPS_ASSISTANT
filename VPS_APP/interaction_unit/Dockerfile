FROM node:20.11.1-alpine

WORKDIR /usr/interaction_unit/workdir

COPY . .

RUN npm install -g npm@latest
# RUN npm install -g serve // AKTIVKAN JIKA BUKAN UNTUK SERVER KEPS
RUN npm install -g pnpm@latest
RUN pnpm install
# RUN pnpm run build // AKTIVKAN JIKA BUKAN UNTUK SERVER KEPS

# EXPOSE 3000 // AKTIVKAN JIKA BUKAN UNTUK SERVER KEPS
EXPOSE 5173

# CMD ["serve", "-s", "dist"] // AKTIVKAN JIKA BUKAN UNTUK SERVER KEPS
CMD ["pnpm", "run", "dev"]