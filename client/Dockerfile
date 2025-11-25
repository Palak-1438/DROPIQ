FROM node:20-alpine

WORKDIR /app
COPY package.json tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs ./
COPY app ./app
COPY components ./components
RUN npm install && npm run build

EXPOSE 3000
CMD ["npm", "start"]
