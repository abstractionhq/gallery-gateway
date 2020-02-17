# Gallery Gateway Backend

## Getting Started

### Prerequisites

You'll need [Node](https://nodejs.org/en/download/) >= 8.x and [npm](https://docs.npmjs.com/cli/npm) to be installed. 

*Note: The build does not currently work with Node >= 12.x due to an issue with the sequelize package*

You'll need to be running [MySQL](https://www.mysql.com/downloads/) and [SimpleSAMLphp](https://simplesamlphp.org/). In development, our preferred method is to run them using [Docker](https://docs.docker.com/install/).

*Note: Docker desktop is only available on Unix systems, as a result, the project may need to be run on a virtual machine. For this iteration of the project, we used a Linux VM running on [Virtual Box](https://www.virtualbox.org/)*

### Installation

1. Install dependencies: `npm install`
2. Copy the default environment variables: `cp .env-sample .env`
3. Generate keys for JWT authentication: `npm run keygen`
4. Build & start the MySQL and SimpleSAMLphp Docker containers: `cd docker && docker-compose up -d && cd ..`
5. Copy the test SAML IDP's Cert into `keys/idp_cert.pem`. You can find it here: https://github.com/kristophjunge/docker-test-saml-idp/blob/master/config/simplesamlphp/server.crt
6. Migrate the database: `npm run migrate`
7. [Optional] Seed the database with users & demo data: `npm run seed`
8. Start the server: `npm run start`
9. The API will now be running on `http://localhost:3000`
10. You can visit `http://localhost:3000/graphiql` to use our interactive GraphQL playground or send requests to `http://localhost:3000/graphql` using your favorite HTTP client

## Development

- `server.js` - Sets up Express server
- `schema.js` - GraphQL Schema
- `bin/` - Entrypoint for Backpack
- `config/` - Configuration (eg. env variables, paths, SAML)
- `db/` - Database migrations & seeds
- `docker/` - Development Docker containers
- `helpers/` - Utility functions
- `middleware/` - Express request middleware
- `models/` - Sequelize models
- `resolvers/` - GraphQL query, mutation, and type resolvers
- `routes/` - Express REST endpoints (mainly for upload / download)
- `test/` - Tests
- `uploads/` - Where file uploads will be stored

To run the server and have it watch for changes, run `npm run watch`.

[ESLint](https://eslint.org/) is setup to warn you about style violations. You can run `npm run lint` to check for style violations.

## Testing

To run tests, run `npm run test`. To run an individual test, run `npm run test-file` with the path of the individual test file.

We use [Mocha](https://mochajs.org/) to run tests with the [Chai](http://www.chaijs.com/) assertion library. We use [faker.js](https://github.com/marak/Faker.js/) to generate fake test data and [supertest](https://github.com/visionmedia/supertest) to test endpoints. We use [Istanbul](https://istanbul.js.org/) to track code coverage.

## Deployment

We use [Backpack](https://github.com/jaredpalmer/backpack) to compile our application into a single file. To build the API for production, run `npm run build`. This will create a `build/` folder with a compiled `main.js` output file.

You can then run this file with Node: `node main.js`

The frontend expects the API to be deployed to `https://gallerygateway.rit.edu/backend`. We use [nginx](https://nginx.org/en/) to proxy requests (and strip `/backend` from incoming requests). You can find our nginx config in our `deploy/` folder.

You'll need to have `keys/` and `uploads/` folders created relative to where you deploy the `main.js` file. You'll have to create RSA keys for JWT authentication and provide the production SAML IDP Cert and put these in the `keys/` folder. Any file uploads (and thumbnails) will be stored in the `uploads/` folder.

The production MySQL database should be >= v5.7 and should be configured to use the `utf8mb4` character-set. You can see an example configuration in our `docker/` folder.

You can use `npm run migrate` to migrate the MySQL database. If you need more sophisticated database management scripts (eg. rollback), run `npm run sequelize` to access the Sequelize command-line tools.
