# Employee Happiness API

## Setup the project

To start the project you will first need a few requirments.

You need to have [nodejs](https://nodejs.org/dist/latest-v12.x/), [Redis](https://redis.io/download) installed aswell as have a mysql server running for example using [xampp](https://www.apachefriends.org/index.html).

You then need to globally install the following npm packages: [typescript](https://www.npmjs.com/package/typescript), [ts-node](https://www.npmjs.com/package/ts-node), [nodemon](https://www.npmjs.com/package/nodemon).

This can be done with the following command: `npm install -g package_name`

And lastly you use `npm install` for all other packages and `npm start` to start the API.

## Create a .env file with the following parameters.

You can change the variables to match your enviorment.

```
DATABASENAME="employeehappiness"
DATABSE_USER="root"
DATABASE_PASSWORD=""
PORT=4000
REDIS_IP = 6373

WEBSITE_IP="localhost"
WEBSITE_PORT="3000"
```

## Run using docker

### TODO update docker

Run the following command to start a docker container with the API in it.

You might need to wait with starting the pi untill the mysql database is setup.

Note that the mysql password should match the one in the .env file and the API port aswell.

```
docker run -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_ROOT_HOST='%' -d --name=mysql mysql/mysql-server:latest

docker build -t employeehappiness_api .

docker run -it -d -p4000:4000 --name employeehappiness_api employeehappiness_api
```
