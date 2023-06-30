목표

lesson

yarn berry를 활용하여 front , back 을 workspace 단위로 구분하기
react-todo에서 발생한 todo list를 db에 저장해서 기록하기 -> container가 죽다 살아나도 기록이 남도록 하기
이렇게 만든 프로젝트를 docker-compose로 묶어서 올리기,
front는 nginx를 이용하여 호스팅 하기

yarn berry는 yarn v.2 이상 버전이라고 생각하면 된다.
`yarn set version berry`라는 커맨드로 활성화 가능

그리고 yarn berry로 버전을 올린 다음, 팀에서 자주 쓰는 명령어인
`yarn workspaces foreach run xxx`을 사용하기 위해서는 , 플러그인 `workspace-tools`을
설치해야한다.

`yarn plugin import workspace-tools`로 설치 가능.
(plugin은 전부 위와 같이 설치 가능)`

근데 팀의 보일러플레이트에서는 ㄴ이런거 설치한 적이 없었는데 어떻게 된거지?
라는 생각이 들 수 있는데,이 커맨드를 실행하면 .yarn이라는 폴더가 생기고,
안에 plungins 폴더, cache 폴더 등등이 생기고, 내가 설치했던 플러그인들의 소스코드가
들어가있다. 이건 깃에 그대로 올라가니까, 깃 클론할때 같이 다운받아 지는 것.
그리고 yarn은 플러그인을 찾을때 현재 경로에서부터 찾는 것으로 (보이니) 내가
설치 하지 않았던 플러그인들도 그대로 사용할 수 있는 것.

각 워크스페이스마다 package의 버전을 특정 짓고 싶다면,
package.json의 "packageManager": 항목에 버전을 지정하면된다

`"packageManager": "yarn@3.6.0"`

PORT, MONGO_URI 같은 것은 env를 사용하자. -> docker로 올릴때도 말이다

express 서버에서 mongoDB를 사용하기 위해 ODM인 mongoosse 설치함.
ODM은 ORM과 동일한, 데이터-객체 매핑 도구임. 다만 MongoDB가 noSQL이기 때문에, ODM이라고 부르는 것임

여기까지 오면서 하나 착각하고 있었던 것이, 벡엔드 컨테이너만 띄우고 왜 연결이 안되지? 라고 생각하고 있었다.
당연히 안되는것이, MongoDB 컨테이너도 같이 띄우고, 네트워크로 연결 해줘야지 가상환경에서 서로 통신이 되는 것이다.
로컬에서는 내가 PC에서 ㄹ몽고를 깔았기 때문에 그냥 된거고... 어떤 머신에서 DB를 쓰고 싶으면 해당하는 DB가 돌고 있는 기기가
있어야하는 것을 알아야 한다.

위에서 말했듯, 컨테이너 간 데이터 교환을 하려면 (브리지) 네트워크로 이어져있어야한다.
이는 docker-compose를 사용하면 매우 간단하게 사용할 수 있는데, (docker-cli를 이용해도 된다 물론, 하지만 컨테이너를 띄울
때마다 플래그를 통한 휘발성 명령어를 사용해야하고, 이걸 N번 반복해야한다는 점에서 매우 번거롭다)

network의 생성은 간단하다

```
networks:
    - <YOUR_NETWORK_NAME>
```

일반적인 브릿지 네트워크면 이렇게 별도의 설정 없이 적기만 해도 된다.
만약 도커가 해당이름을 가진 네트워크를 보유하고 있지 않다면, docker-compose가 실행될때 만들어준다 (없으면 만들어준다 : 도커 컴포즈의 특징
)

새로 만드는게 아니라, 기 존재하는 네트워크에 붙이고 싶으면 external을 넣는다

```
networks:
    <YOUR_NETWORK_NAME>:
        - name : my-pre-existing-network
        - external: true
```

docker에서 ports는 <외부로 노출되는것>:<내꺼> 순이다 항상 잘 기억하자.

mongoose를 express 백엔드 서버와 연결할 때 어려웠던점은 아래와 같다

1. dev / prod 에 따라 포트와 몽구스 서버 주소 바꾸는 것
2. 익스프레스가 몽구스에 커넥트 하는 것

처음에 나는 서로 같은 네트워트에만 연결하면 되는줄 알았는데, 그게 아니다.
로컬과는 다르게, 도커에서는 서로 별도의 컨테이너로 연결되어있지 않는가?(디비와 벡엔드가)
로컬에서는 서로 같은 머신에서 두 서비스가 돌고 있기 때문에, 루프백 주소인 localhost를 사용해도 벡엔드는
자기 머신에서 돌고 있는 db에 접속할 수 있었다.

하지만, 도커는 DB와 벡엔드가 서로 다른 머신에서 돈다. 말인 곧 즉, 벡엔드 소스에서 루프백 주소인 localhost로 연결하려고 해도,
백엔드 컨테이너에서는 몽고가 띄워져있지 않기에, localhost 주소에서 아무것도 찾을수가 없고, 커넥션 에러가 뜨는 것이다.

그렇기 때문에,docker를 사용하는 prod 환경에서는 다른 url을 사용할 수 있게 해야한다.
먼저 mongoDB URL은 아래와 같은 구조를 이루고 있다

`mongodb://<호스트>:<포트>/<DBname>`

그런데 여기서 호스트는, docker-compose를 사용한다면* 컨테이너의 이름*이나*서비스의 이름* 을 사용할 수 있다.
나는 docker-compose.yml에서 db의 컨테이너 이름을 mongo로 사용했으므로, prod 환경에서의 mongo URL은 아래와 같다

`mongodb://mongo:<포트>/<DBname>`

이런 놀라운 비밀이 있다는걸 기억해라

prod와 dev의 env를 구분하기 위해서 .dotenv 라는 라이브러리를 사용했음.
이 친구 덕분에 별도의 ARG, ENVIROMENT를 docker-compose, Dockerfile에 지정하지 않고도 편하게 사용 가능.
다만, 벡엔드 서비스 시작시에, 어떤 파일을 사용할건지 지정하는 것만 주의한다

나와 같은 경우는, 동일한 스크립트인데, NODE_ENV를 설정하는것만 서로 다르게 하고, 서버가 시작할때 process.env.NODE_ENV
를 확인한 다음 사용할 파일의 경로를 지정했다.

docker volume

이번에 볼륨 마운트를 사용했는데, 이것도 docker-compose를 사용하면 간단하다
네트워크를 생성할때와 동일한 요령으로

<docker가 관리할 볼륨의 이름>:<저장할 데이터> 인데,

<저장할 데이터> 는 각 서비스 (DB 및 데이터 저장이 되는 서비스) 에 따라 다르다. 이건 개별적으로 서비스에 익숙해지면서
숙지하는 수 밖에 없다

- mongoDB와 같은 경우는, 도큐먼트와 디비가 모두 /data/db\* 에 저장된다.

따라서, "02-mongo:/data/db"의 뜻은, 02-mongo라는 이름의 도커 볼륨에, 컨테이너의 /data/db를 백업해라 라는 뜻으로 바다 들이면된다.
정확히 말하면 02-mongo 라는 볼륨이 컨테이너의 /data/db 경로에 마운트 되어 파일 및 데이터를 저장ㄷ하는데 사용된다.
즉, \* 컨테이너 내부의 '/data/db' 경로에 저장되는 모든 파일 및 데이터는 이제 '02-mongo'라는 볼륨에 저장된다는 소리이다

-> 볼륨은 컨테이너의 파일시스템과 별도로 유지되며, 컨테이너가 종료되어도 데이터를 유지하기에, 컨테이너가 종료되어도 데이터를 유지한다.
--> 데이터의 영속성 보장, 컨테이너 교체, 업그레이드시 손실 방지

쉽게 말하자면 02-mongo 볼륨은 컨테이너에 /data/db 경로 연결된 하드드라이브와 같다.

만약 짖ㅁㅇ한 볼륨 경로가 컨테이너의 내부에 없다면 컨테이너가 실행되지 않는 오류가 있는데, 아주 우연히도 내가 실수로 지정한 back 컨테이너에도 /data/db 경로가 있었다.

_만약 docker-compose에 의해 Dockerfile이 실행된다면, Dockerfile 내에 기재된 상대경로는 docker-compose의 위치를 따른다_