## SimpleApp

## Installation

```bash
$ npm install
```

## Running the app

```bash
#migrations
$ npm run migration:generate
$ npm run migration:run

# development
$ npm start

```

## Configure .env file

```bash
POSTGRES_USER='some user'

POSTGRES_PASSWORD='some password'

POSTGRES_DB='some db name'

POSTGRES_PORT='some port'

JWT_SECRET='secretKay'
```


# Examples of requests
# CreateUser
### POST

### http://localhost:3000/users/create
``` bash 
{
    "email": "regular545@gmail.com",
    "password": "regula54r443254",
    "username": "regul45ar54",
    "role": "regular",
    "bossId": 3
}
```
# Login
### POST
### http://localhost:3000/users/login
``` bash 
{
    "email": "boss@gmail.com",
    "username": "boss",
    "password": "boss111",
    "role": "boss"
}
```

# Get users by id
### GET
### http://localhost:3000/users/7

# Change boss
### PATCH
### http://localhost:3000/users/7/change-boss

``` bash 
{
    "email": "regular545@gmail.com",
    "password": "regula54r443254",
    "username": "regul45ar54",
    "role": "regular",
    "bossId": 4
}
```
