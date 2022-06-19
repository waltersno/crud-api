CRUD API

## Install dependencies

npm install

## Run app in development mode(nodemom/ts-node)

npm run start:dev

PORT=5000 or it can be changed in .env

## Npm start multiple instances of your application using the Node.js Cluster

npm run start:multi

## Build app in production mode(webpack/ts-loader) and run app

npm run start:prod

## Run the tests(jest/supertest)

npm run test

## Get all users

### Request

`GET /api/users`

### Response

status code 200 and all users records

## Create a new user

### Request

`POST /api/users`

body: {
username — user's name (string, required)
age — user's age (number, required)
hobbies — user's hobbies (array of strings or empty array, required)
}

example {"username": "Andrey", "age":20, hobbies: []}

### Response

status code 201 and newly created record

body {"id":"uuid","username":"Andrey","age":20, hobbies: []}

status code 400 and corresponding message if request body does not contain required fields or fields are invalid

body 'Body does not contain required fields'

## Get a specific user by id

### Request

`GET /api/users/${userId}`

userId - valid uuid identifier

### Response

status code 200 and newly created record

{"id":"f8ccd33f-f817-4f09-89e1-99fdfde62157","username":"SomeName","age": 45, hobbies: ['flex']}

status code 400 and corresponding message if userId is invalid (not uuid)

`User id ${idFromReq} is invalid`

status code 404 and corresponding message if record with id === userId doesn't exist

`User with id ${idFromReq} does not exist`

## Update a specific user by id(can update all or some fields)

### Request

`PUT /api/users/${userId}`

userId - valid uuid identifier

### Response

status code 200 and updated record

{"id":"f8ccd33f-f817-4f09-89e1-99fdfde62157","username":"NewName", "age": 15, hobbies: ["reading"]}

status code 400 and corresponding message if userId is invalid (not uuid)

Body `User id ${idFromReq} is invalid`

status code 400 and corresponding message if request body does not contain required fields or fields are invalid

Body `Body does not contain required fields`

status code 404 and corresponding message if record with id === userId doesn't exist

Body `User with id ${idFromReq} does not exist`

## Delete a specific user by id

### Request

`DELETE /api/users/${userId}`

userId - valid uuid identifier

### Response

status code 204 if the record is found and deleted

status code 400 and corresponding message if userId is invalid (not uuid)

body `User id ${idFromReq} is invalid`

status code 404 and corresponding message if record with id === userId doesn't exist

body `User with id ${idFromReq} does not exist`

## Other errors

status code 500

'Internal Server Error'
