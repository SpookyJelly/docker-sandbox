#docker file : image roll up
ARG IMG_VERSION=latest


FROM node:${IMG_VERSION} AS BUILD
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

# make build files
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install
# RUN npm run build


# 포트 연결
EXPOSE 3000
CMD ["dumb-init","npm","run","dev"]

#####
# # dockerfile command for vite
# FROM node
# WORKDIR /app
# COPY package.json .
# RUN npm i
# COPY . .
# EXPOSE 3000
# CMD ["npm","run","dev"]