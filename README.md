# Abstraction Backend

## Installation

`npm install`

Install MySQL, add a user, and fill out the following environment variables appropriately:

* `ABSTRACTION_DBNAME`
* `ABSTRACTION_DBUSER`
* `ABSTRACTION_DBPASS`

Then

`npm run bootstrap`
`npm run keygen`

## Running

To run the Docker test saml server:

```
cd Docker
docker-compose up -d test-saml-idp
```

Then set the following environment variables appropriately

```
SAML_CALLBACK_URL=http://localhost:3000/auth/login/callback
SAML_ENTRY_POINT=http://localhost:8080/simplesaml/saml2/idp/SSOService.php
ISSUER=http://app.example.com
SAML_SUCCESS_URL=http://localhost:5000/
```

Add the test saml IDP's cert into `keys/idp_cert.pem`. You can find it here: 
https://github.com/kristophjunge/docker-test-saml-idp/blob/master/config/simplesamlphp/server.crt

To run the application:

`npm start`
