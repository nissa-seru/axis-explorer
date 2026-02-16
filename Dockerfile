FROM node:22-alpine
WORKDIR /app
COPY package.json server.js index.html ./
COPY data/ data/
EXPOSE 3000
CMD ["node", "server.js"]
