목표

docker로 vite-react 개발서버를 띄우기.
dockerfile, dockerCompose

lesson

Docker 이미지를 만들때, 현재 호스트에 있는 소스코드들도 같이 이미지에 딸려가는게 아니다. 소스코드 까지 같이 넣기 위해서 사용하는거다

컨테이너를 하나만 띄우는거라면, 굳이 docker-compose를 사용하지 않아도 된다.
다만, compose를 쓰면 포트 설정, 볼륨 설정(필요한 경우)를 기록 할 수 있다는게 좋은 것이다.

실제 이번 프로젝트에서는 dockerfile로만 컨테이너를 만들었는데, docker run 할때 포트 매핑만 잘해주면된다

`docker run -d -p 3000:3000 <image>`

또, SPA에 사용되는 esbuild는 네이티브로 작성되었다. 이 말은 곧, 각 플랫폼에 적합한 바이너리를 사용해야한다는 것인데, 아까 말했듯, 호스트의 소스를 이미지에 넣고 싶어 COPY . . 를 하는 경우가 있다. 이때, 만약 node_modules까지 딸려간다면, docker의 리눅스에서 macOS용 esbuild를 사용하게 되어 오류가 난다. (이는 친절하게 도커 터미널에서 알려줌)

그렇기 때문에, .dockerignore에 node_moudles를 입력하여, COPY . . 하더라도 node_modules가 딸려가지 않도록 주의하자 (어짜피 이후 `npm install` 할 떄 적절하게 깔린다)
