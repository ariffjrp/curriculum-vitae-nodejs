# Curriculum Vitae

Back-end for Curriculum vitae Node JS

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Create .env file that contains your database setting such as hostname, username, password, database name, and secret key for authentication purpose.

```
# Port
SERVER_PORT=8000
CORS_PORT=8001

# DB Config
DB_HOST = localhost
DB_USER = postgres
DB_PASSWORD = dewa1234
DB_DATABASE = curriculum_vitae

# DB Test
DB_HOST_TEST = localhost
DB_USER_TEST = postgres
DB_PASSWORD_TEST = dewa1234
DB_DATABASE_TEST = curriculum_vitae_test

# Authentication
SECRET_KEY = curriculum-vitae-secret-key
JWT_EXPIRATION = 86400
JWT_REFRESH = 604800

# Mail sedder
MAIL_USERNAME = creativesoul290@gmail.com
MAIL_PASSWORD = rmeavtfoksaqpnyu
MAIL_HOST = smtp.gmail.com
MAIL_PORT = 587

# Session
SESSION_SECRET = curriculum-vitae-secret-key

# OTP
OTP_SECRET = curriculum-vitae-secret-key

#OAuth2
GOOGLE_CLIENT_ID = 392538975465-6bvfi22hsis5b1gijorual81ee63u5qv.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = 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
```

### Installing

Clone this repository then run

```
sudo npm install
```

After all packages installed, place the .env files on this app folder. The directory should be like this

```
├── .env
├── .eslintrc.json
├── .sequelizers
├── package-lock.json
├── package.json
├── server.js
└── src
    ├── config
    ├── controllers
    ├── logs
    ├── middleware
    ├── migrations
    ├── models
    ├── routes
    ├── seeders
    ├── services
    ├── test
    ├── utils
    ├── validation
    └── view
```

## Running the program

```
1. First, migrate data on the model using the following command:
npm run db:migrate

2. Initialize the program with the following command:
npm run dev-resync

3. Initialize the program with the following code:
npm run dev
```

## Access Documentation

This application documentation can be accesed through:

[http://localhost:8000/docs](http://localhost:8080/docs/)

## Built With

- [Express](https://expressjs.com/): Node.js framework utilized for creating APIs.
- [Sequelize](https://sequelize.org/): ORM (Object-Relational Mapping) for handling database interactions.
- [Swagger](https://swagger.io/): Utilized for creating application documentation.

Additional libraries and tools include:
  - [Joi](https://joi.dev/): Used for validation purposes.
  - [express-session](https://www.npmjs.com/package/express-session): Handling sessions in Express.
  - [JWT (JSON Web Tokens)](https://jwt.io/): Token-based authentication.
  - [Passport](http://www.passportjs.org/): Authentication middleware for Node.js.
  - [Moment](https://momentjs.com/): Library for parsing, validating, manipulating, and formatting dates.
  - [Multer](https://www.npmjs.com/package/multer): Middleware for handling multipart/form-data, primarily used for file uploads.
  - [Cron](https://www.npmjs.com/package/cron): Used for scheduling tasks.
  - [Prossgree](https://www.npmjs.com/package/prossgree): (Note: couldn't find a package named "prossgree". If it's a typo, please correct it.)
  - [Winston](https://github.com/winstonjs/winston): Logging library for Node.js.
  - [Sharp](https://sharp.pixelplumbing.com/): High-performance image processing library.
  - [Speakeasy](https://github.com/speakeasyjs/speakeasy): Library for two-factor authentication.

**Dependencies:**
- [amqplib](https://www.npmjs.com/package/amqplib): Client library for RabbitMQ.
- [bcryptjs](https://www.npmjs.com/package/bcryptjs): Library for hashing passwords.
- [cors](https://www.npmjs.com/package/cors): Middleware for enabling Cross-Origin Resource Sharing.
- [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a .env file.
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit): Middleware for rate-limiting requests in Express.
- [express-validator](https://www.npmjs.com/package/express-validator): Middleware for validating request data in Express.
- [file-type](https://www.npmjs.com/package/file-type): Library for detecting file types.
- [mime-types](https://www.npmjs.com/package/mime-types): Utility for mapping filenames to MIME types.
- [node-cron](https://www.npmjs.com/package/node-cron): Library for scheduling cron jobs in Node.js.
- [nodemailer](https://www.npmjs.com/package/nodemailer): Library for sending emails.
- [otplib](https://www.npmjs.com/package/otplib): Library for one-time password (OTP) generation.
- [pg](https://www.npmjs.com/package/pg): PostgreSQL client for Node.js.
- [pg-hstore](https://www.npmjs.com/package/pg-hstore): Serializes and deserializes JSON data to hstore format for PostgreSQL.
- [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc): Library for generating Swagger/OpenAPI documentation from JSDoc comments.
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express): Middleware for serving Swagger UI for Express.
- [uuid](https://www.npmjs.com/package/uuid): Library for generating UUIDs.
  
**DevDependencies:**
- [cross-env](https://www.npmjs.com/package/cross-env): Utility for setting environment variables across different platforms.
- [eslint](https://www.npmjs.com/package/eslint): Tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base): Airbnb's base ESLint configuration.
- [jest](https://www.npmjs.com/package/jest): Testing framework.
- [sequelize-cli](https://www.npmjs.com/package/sequelize-cli): Command-line interface for Sequelize.
- [sequelize-test-helpers](https://www.npmjs.com/package/sequelize-test-helpers): Library for testing Sequelize models.
- [supertest](https://www.npmjs.com/package/supertest): Library for testing HTTP servers in Node.js.
