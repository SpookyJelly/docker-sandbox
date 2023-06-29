목표

docker로 vite-react 프로젝트를 빌드하고, Nginx 웹 서버로 호스트 하기
dockerfile, docker-compose

lesson

컨테이너를 하나만 사용하더라도, docker-compose를 이용하는 것이 더 편한 것 같다. Port forwarding과 같은 설정들을 통상적으로 docker cli를 사용했는데, 이는 한번만 실행되는 명령어니, 기억이 잘 안난다. 그러나 Docker-compose를 이용하면 이와 같은 설정들을 텍스트로 남길수 있기에 추적이 용이하다.

--> 00 프로젝트에서도 얻은 교훈인데, 똑같은 교훈을 얻었네

이번 프로젝트에서도 컨테이너는 하나만 띄웠다. 컨테이너가 2개 필요한 이유가 없기 때문, react-vite 프로젝트는 그냥...빌드 결과물만 static으로 빠지니까, 그걸 nginx Index로 넘겨주면 되기 때문이다.

그래서 Dockerfile을 보면, 소스를 /usr/src/app에 다 집어 넣고, 빌드한 다음, 빌드가 끝나고 /usr/src를 통으로 삭제하는 것을 볼 수 있다.

nginx 같은 경우는 `/usr/share/nginx/html` 에 있는 index.html를 호스팅 한다.
따라서, 빌드 결과물을 `/usr/share/nginx/html`로 옮기면 된다. (물론, 연결된 Js,css 모두 포함이다)

docker-compose에서 services:의 하위 항목으로 build:가 있는데, 이것은 해당 서비스를 만드는 Image가 날 것 공식의 이미지가 아니라, 나만의 dockerfile을 사용해서 만드는 이미지 일 경우, 해당 Dockerfile의 위치를 알려주는 것이다.

이번 예제에서는 build: . 으로 되어있는데, 이 말은 곧, `docker-compose.yml`이 있는 위치의 `Dockerfile`을 사용하는 것이다.
