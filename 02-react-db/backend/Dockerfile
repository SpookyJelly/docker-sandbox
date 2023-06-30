ARG NODE_IMAGE_VER=lts-slim

FROM node:${NODE_IMAGE_VER}
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
# Dockerfile이 docker-compose에 의해 실행된다면, 상대경로는 docker-compose의 위치를 기준으로 한다.
COPY ./backend .
RUN yarn install
CMD ["yarn","run","prod"]
EXPOSE 8002