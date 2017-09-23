# A B S T R A C T I O N

## Development

Checkout this repository: `git clone https://github.com/robmcl4/A-B-S-T-R-A-C-T-I-O-N.git`

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
(See: https://github.com/laradock/laradock/issues/849)  
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

### Need a MySQL GUI?

- SequelPro (https://www.sequelpro.com/)
- MySQL Workbench (https://www.mysql.com/products/workbench/)
- DBeaver (https://dbeaver.jkiss.org/)
- HeidiSQL (https://www.heidisql.com/)
