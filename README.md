<p align="center">
  <img width="200px" src="https://github.com/yeukfei02/lunchPicker/blob/master/readme-icon.png"><br/>
  <h2 align="center">lunchPicker</h2>
</p>

<p align="center">
  <a href="https://codecov.io/gh/yeukfei02/lunchPicker"><img src="https://codecov.io/gh/yeukfei02/lunchPicker/branch/master/graph/badge.svg" alt=""></a>
  <a href="https://discord.gg/HdXSpNg"><img src="https://img.shields.io/discord/709269779793444944" alt=""></a>
</p>

If you’re a working software engineer, you’ve probably encountered with one of the toughest questions, where should I have lunch?

Lunch picker is the tool you’ll turn to to answer this question.

The web hosted in below places:

<https://lunchpicker.me/>

<https://lunchpicker-2232b.firebaseapp.com/>

<https://lunch-picker.vercel.app/>

<https://lunchpicker.netlify.app/>

## Requirement

- install yarn
- install node (v16)
- install firebase cli

## Testing and run

```zsh
$ yarn

// development
$ yarn run dev

// production
$ yarn run production

// run test case
$ yarn run test

// lint code
$ yarn run lint

// format code
$ yarn run format

// deploy to firebase
$ yarn run deploy-firebase
```

open localhost:5100

## Docker

```zsh
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
