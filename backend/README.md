# Abstraction Backend

## Installation

1. `cp .env-sample .env`
2. `npm install`
3. `cd docker && docker-compose up -d && cd ..`
4. `npm run keygen`
5. Copy the Test SAML IDP's Cert into `keys/idp_cert.pem`. You can find it here: https://github.com/kristophjunge/docker-test-saml-idp/blob/master/config/simplesamlphp/server.crt
6. `npm run bootstrap`
7. `npm start`

## Development

- To migrate the database: `npm run migrate`
- To seed the database: `npm run seed`
- To run tests: `npm run test`
