<p align="center">
<h1 align="center"> 👨‍💻🚘CarAppDemoBackend </h1>
</p>
<p align="center">
  • <a href="mailto:juanlh182@gmail.com">Contact</a>
<br><br>
</p>
A car rental app demo backend on Node.js

## Running locally
CarAppDemo is built on Express, routing-controllers, TypeORM  therefore assumes you have [node](https://nodejs.org/en/) version `v18.12.1` installed, [nvm](https://github.com/nvm-sh/nvm) is recommended as is easy to install out of the box running the latest `lts/hydrogen` version. The MySQL Database is run on [docker](https://docs.docker.com/engine/install/).
```sh
# clone the project and cd into it
git clone https://github.com/SkullCarverCoder/carAppDemoBackend.git && cd ./carAppDemoBackend
# install dependencies
# replace 'npm' with 'yarn' if preferred
npm install
# start db docker dettached
docker compose up -d
# start web server
# replace with `yarn dev` to run if yarn
npm run dev
```
## Test

You can test this backend with a collection of requests made on [Postman](https://www.postman.com/) make sure to import [this file](carAppDemoBackend.postman_collection.json)