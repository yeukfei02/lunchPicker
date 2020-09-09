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

```
// build images and start container in one line
docker-compose up -d --build

// go inside container
docker exec -it <containerId> /bin/bash

// check container logs
docker logs <containerId>

// remove and stop container
docker-compose down
```

open localhost

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/yeukfei02/lunchPicker/blob/master/CONTRIBUTING.md)
