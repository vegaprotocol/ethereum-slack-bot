FROM node:16-alpine AS builder
RUN apk update
RUN apk add g++ gcc make musl-dev python3
WORKDIR /app
ADD package*.json ./
RUN npm install

FROM node:16-alpine
ENTRYPOINT [ "node", "/app/src/index.js" ]
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
ADD abi abi
ADD contract_addresses contract_addresses
ADD src src
