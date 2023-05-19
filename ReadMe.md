# API Rate Limiter

This project is an API rate limiter for SMS and email, built using Node.js and Express.

## Table of Contents

- [API Rate Limiter](#api-rate-limiter)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [API rate limiting](#api-rate-limiting)
  - [Technologies Used](#technologies-used)
  - [Contact the author](#contact-the-author)
  - [Contributing](#contributing)
  - [License](#license)

(Continue with the Prerequisites, Installation, Usage, Testing, Deployment, and Authentication sections as they are.)














## Prerequisites

Before installing and running this project, make sure you have the following:

- Node.js (version 16 or later) and npm installed on your machine. You can download them from the [official website](https://nodejs.org).
- Yarn package manager. You can install it by following the instructions on the [official website](https://yarnpkg.com).
- PostgreSQL and Redis installed on your machine or on a remote server. You can download and install them from their respective [official websites](https://www.postgresql.org/download) and [official website](https://redis.io/download) respectively.


Please note that this project uses specific versions of Node.js and other dependencies. The required version of Node.js is specified in the `engines` field of the `package.json` file as shown below.

```json
{
 ...
  "engines": {
    "node": ">=16 <19"
  },
  ...
}
```


## Installation

Clone the [GitHub repository](https://github.com/olivierhabi/rate.git) or download the source code, then follow the steps below to setup the project:

1. Navigate to the project directory in your terminal.

```bash
cd /path/to/rate

```

2. Install project dependencies using Yarn.

```bash
yarn install

```

3. Create a `.env` file using the provided `.env.example` template. Update this file with the appropriate environment variables. Please note that this application relies on PostgreSQL, RabbitMQ Cloud and Redis, which must be installed and configured on your system or use cloud computing.



## Usage

To start the application in your local environment, execute the following command:


```bash
yarn dev
```

This command will launch the server in development mode. The API endpoints will be accessible at `http://localhost:${PORT}`, where `PORT` is defined in your `.env` file, defaulting to `3000` if not explicitly defined.

Please note, a rate limiter is implemented across all routes, restricting the number of daily requests per user based on their subscription `Plan`. To upgrade and increase your request limit, send a `POST` request to the `/plan` endpoint.


## Testing

Execute the following command to run the suite of automated unit and integration tests:

```bash
yarn test
```

Upon execution, the test results will be displayed in your terminal.


## Deployment

Follow these steps for deploying the application to a production environment:

1. Compile the source code to ES5 using the following command. This will generate a `build/` directory containing the transpiled code.

```bash
yarn build
```
2. Deploy the contents of the `build/` directory to your preferred cloud service provider.
3. In the production environment, start the service using the following command:

```bash
yarn start
```

Ensure your production environment is correctly configured with all necessary `.env` variables and databases prior to launching the application.


## API endpoints

1. `POST /auth/signup` - Sign up a user with their email and password.
2. `POST /auth/login` - Login a user with their email and password. 
3. `POST /email` - Send an email message to an email address, requires a valid JWT token.
4. `POST /sms` - Send an SMS message to a phone number, requires a valid JWT token.
5. `POST /plan` - Change user's plan, requires a valid JWT token.

**NB: Please note that the secure endpoints are accessible only when you provide a JWT token in the `Authorization` header as `Bearer ${TOKEN}`.**

## Authentication

The API uses JWT tokens for authentication. When a user logs in or signs up, a JWT token is returned which must be included in the Authorization header for any requests that require authentication. 

## API rate limiting

The API includes a rate limiter middleware to limit the number of requests a user can make per minute. Users can purchase additional requests once they have exhausted their monthly quota.

## Technologies Used

The following technologies were used to build this project:

- Node.js
- Express
- PostgreSQL,
- RabbitMQ
- Prisma
- Redis
- Jest
- Babel
- Mocha

## Contact the author

You can contact me by: 
1. Email: habimanaolivier6@gmail.com

## License

This project is licensed under the [MIT license](https://opensource.org/licenses/MIT).

