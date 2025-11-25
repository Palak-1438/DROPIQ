FROM node:20-alpine

WORKDIR /app
COPY package.json tsconfig.json jest.config.cjs prisma ./
COPY src ./src
RUN npm install && npx prisma generate && npm run build

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
