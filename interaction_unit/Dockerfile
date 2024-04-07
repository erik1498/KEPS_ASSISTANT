FROM node:20.11.1-slim

WORKDIR /usr/interaction_unit/workdir

COPY . .

RUN npm install

ENV VITE_BASE_API_KEPS_ASSISTANT_MANAGEMENT=http://localhost:2001

EXPOSE 5173

CMD ["npm", "run", "dev"]