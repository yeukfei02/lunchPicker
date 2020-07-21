<p align="center">
    <img src="https://github.com/yeukfei02/lunchPicker/blob/master/readme-icon.png" width="200" height="200">
</p>

# lunchPicker

[![Build Status](https://travis-ci.com/yeukfei02/lunchPicker.svg?branch=master)](https://travis-ci.com/yeukfei02/lunchPicker)
[![codecov](https://codecov.io/gh/yeukfei02/lunchPicker/branch/master/graph/badge.svg)](https://codecov.io/gh/yeukfei02/lunchPicker)
[![Discord](https://img.shields.io/discord/709269779793444944)](https://discord.gg/HdXSpNg)

If you’re a working software engineer, you’ve probably encountered with one of the toughest questions, where should I have lunch?

Lunch picker is the tool you’ll turn to to answer this question.

The web hosted in below places:

https://lunchpicker.me/

https://lunchpicker-2232b.firebaseapp.com/

https://lunchpicker.netlify.app/

https://lunch-picker-web.herokuapp.com/

## Requirement:
 - install yarn
 - install node (v12+)
 - install firebase cli

## Testing and run:
```
$ yarn

// development
$ yarn run dev

// production
$ yarn run production

// run test case
$ yarn run test

// use eslint and prettier to format code
$ yarn run lint

// deploy to firebase
$ yarn run deploy-firebase
```

open localhost:5000

## Docker:

- Dockerfile

build images and start container
```
docker build -t <username>/lunch-picker:<tag> .
docker run -p 80:80 -d <username>/lunch-picker:<tag>
docker exec -it <containerId> /bin/bash
docker logs <containerId>
```

check images and container
```
docker images
docker ps
docker ps -a
```

open localhost

- docker-compose.yml

build images and start container
```
docker-compose build
docker-compose up
```

build images and start container in one line
```
docker-compose up -d --build
```

stop container
```
docker-compose stop
```

add tag to docker images
```
$ docker tag <imageId> <dockerHubUserName>/<imageName>:<tag>
```

push docker images to docker hub
```
$ docker push <dockerHubUserName>/<imageName>:<tag>
```

open localhost

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/yeukfei02/lunchPicker/blob/master/CONTRIBUTING.md)
