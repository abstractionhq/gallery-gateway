# A B S T R A C T I O N

## Development

Checkout this repository: `git clone --recursive https://github.com/robmcl4/A-B-S-T-R-A-C-T-I-O-N.git`

We use [Laradock](http://laradock.io/) for our local development.

Setting up Laradock requires a few additional steps:

1. Make sure you have [Docker](https://www.docker.com/) installed on your computer.
2. `cd laradock`
3. `cp env-example .env`
4. `vim .env` and change
```
...
WORKSPACE_INSTALL_NODE=true
WORKSPACE_INSTALL_YARN=true
...
WORKSPACE_COMPOSER_GLOBAL_INSTALL=true
...
```
5. `vim apache2/Dockerfile` and change
```
...
ENV WEB_DOCUMENT_ROOT=/var/www/public/
...
```  
6. `docker-compose up -d apache2 mysql mailhog`
7. Now wait. Take a coffee break. Grab a snack. This will take a while.
8. Enter the `workspace` container: `docker-compose exec workspace bash` (On Windows, you'll have to pass the `workspace` container's id `docker-compose exec {container-id-from-docker-ps} bash`)
9. Inside the `workspace` container, run:
```
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```
10. Go to `http://localhost` to check if the installation was successful. You should see the Laravel welcome page.

*TODO:*
- Check storage directory permissions

Notes:
- If you make any additional changes to the Laradock configuration, you can rebuild your running containers by adding the `--build` flag to your command (eg. `docker-compose up --build -d apache2 mysql mailhog`).
- To stop the Laradock environment, run `docker-compose down` while in the `laradock` folder.
- Step 5 may not be needed in the future (See: https://github.com/laradock/laradock/issues/849)

### Test SAML Server

To stand up a SAML identity provider for dev purposes (mocking RIT Shibboleth):

Create a new folder `laradock/test-saml-idp`.

Create the file `laradock/test-saml-idp/Dockerfile` with the following contents:

```
FROM kristophjunge/test-saml-idp

EXPOSE 80 443
```

Edit `laradock/docker-compose.yml` and add the following before the
`Networks Setup` section.

```
### Test SAML IDP Container #################################
    test-saml-idp:
      build:
        context: .
        dockerfile: test-saml-idp/Dockerfile
      ports:
        - "${TEST_SAML_IDP_HTTP_PORT}:80"
        - "${TEST_SAML_IDP_HTTPS_PORT}:443"
      environment:
        SIMPLESAMLPHP_SP_ENTITY_ID: http://app.example.com
        SIMPLESAMLPHP_SP_ASSERTION_CONSUMER_SERVICE: http://localhost/saml2/acs
        SIMPLESAMLPHP_SP_SINGLE_LOGOUT_SERVICE: http://localhost/saml2/sls
        SIMPLESAMLPHP_ADMIN_PASSWORD: test
        SIMPLESAMLPHP_SECRET_SALT: salt
      networks:
        - frontend
        - backend
```

Edit the Laradock `.env` file to have the following configuration params:

```
### TEST SAML SERVER ###########################################################

TEST_SAML_IDP_HTTP_PORT=8081
TEST_SAML_IDP_HTTPS_PORT=4431
```

Then run `docker-compose up --build -d test-saml-idp`. From now on you may start
this container by running `docker-compose up -d test-saml-idp`.

### Need a MySQL GUI?

- SequelPro (https://www.sequelpro.com/)
- MySQL Workbench (https://www.mysql.com/products/workbench/)
- DBeaver (https://dbeaver.jkiss.org/)
- HeidiSQL (https://www.heidisql.com/)
