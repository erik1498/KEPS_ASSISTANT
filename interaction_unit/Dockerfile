FROM node:20.11.1-alpine

WORKDIR /usr/interaction_unit/workdir

COPY . .

RUN npm install

ARG PROCESS_HOST
ARG PROCESS_PORT

ENV VITE_BASE_API_KEPS_ASSISTANT_MANAGEMENT=http://${PROCESS_HOST}:${PROCESS_PORT}

EXPOSE 5173

CMD ["npm", "run", "dev"]