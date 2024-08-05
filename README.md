## This is a repository for Nestjs starter code

Features:

- Authentication
- ...

Prerequisites

- Node version 20.x\*\*

#### Cloning the repository

```shell
git clone https://github.com/alulamoke/nestjs-starter.git
```

#### Setup .env file

- Create .env file and include those 👇 to the .env

```js
PORT=3000
LOCAL_FILE_UPLOAD_DEST=./uploads

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=
DB_NAME=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

FRONTEND_URL=
```

#### Install packages

```shell
npm i
```

#### Start app

```shell
npm run start:dev
```
