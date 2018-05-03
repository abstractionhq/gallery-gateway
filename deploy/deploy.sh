#! /bin/bash

##################################################
#                                                #
#    This script will deploy Gallery Gateway.    #
#    It is intended to be run on Ubuntu 16.04.   #
#                                                #
##################################################

NODE_USER='www-data';
SCRIPT_ROOT=`pwd`;

set -e;

#
# Sanity check for important binaries and files
#
command -v node >/dev/null 2>&1 || { echo >&2 "This script requires node but it's not installed.  Aborting."; exit 1; }
command -v yarn >/dev/null 2>&1 || { echo >&2 "This script requires yarn but it's not installed.  Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "This script requires npm but it's not installed.  Aborting."; exit 1; }
command -v wget >/dev/null 2>&1 || { echo >&2 "This script requires wget but it's not installed.  Aborting."; exit 1; }
command -v supervisord >/dev/null 2>&1 || { echo >&2 "This script requires supervisor but it's not installed.  Aborting."; exit 1; }
if [ ! -f mysql_password.txt ] ; then
        echo "Could not find mysql_password.txt. Aborting." >&2; exit 1;
fi

#
# Create the database (if needed)
#
sudo mysql << ENDMYSQL
CREATE DATABASE IF NOT EXISTS gallerygateway;
ALTER DATABASE gallerygateway CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
GRANT ALL ON gallerygateway.* TO 'gallerygateway';
ENDMYSQL

#
# Download Gallery Gateway from GitHub
#
DEST_FOLDER=`date +%s`;
wget https://github.com/abstractionhq/gallery-gateway/archive/master.zip -O "$DEST_FOLDER.zip";
unzip -d $DEST_FOLDER "$DEST_FOLDER.zip";

cd $DEST_FOLDER;
cd `ls`;

PROJECT_ROOT=`pwd`;
NODE_ENV=production

#
# Install dependencies & Build the Frontend
#
cd $PROJECT_ROOT/frontend;
yarn install;
yarn run build;

#
# Install dependencies & Build the Backend
#
cd $PROJECT_ROOT/backend;
npm install;
npm run build;

#
# Move the Frontend to Static Site Directory
#
# Remove any existing builds
cd $PROJECT_ROOT/frontend;
sudo rm -r /var/www/html/*;
sudo cp -r dist/* /var/www/html/;

#
# Take down old server
#
sudo supervisorctl stop gallerygateway > /dev/null;

#
# Ensure existence of the backend directory structure
#
sudo mkdir -p /opt/node/gallerygateway;
sudo mkdir -p /opt/node/gallerygateway/keys;
sudo mkdir -p /opt/node/gallerygateway/uploads;
sudo chown $NODE_USER /opt/node/gallerygateway;
sudo chown $NODE_USER /opt/node/gallerygateway/keys;
sudo chown $NODE_USER /opt/node/gallerygateway/uploads;

#
# Copy backend files into place
#
cd $PROJECT_ROOT/backend;
sudo cp build/main.js /opt/node/gallerygateway/;
sudo rm -r /opt/node/gallerygateway/node_modules;
sudo mv node_modules /opt/node/gallerygateway/;

#
# Create the environment variables
#
sudo rm /opt/node/gallerygateway/.env;
sudo tee /opt/node/gallerygateway/.env > /dev/null << ENDENV
ABSTRACTION_DB_NAME=gallerygateway
ABSTRACTION_DB_USER=gallerygateway
ABSTRACTION_DB_HOST=localhost
ABSTRACTION_DB_PASS=`cat $SCRIPT_ROOT/mysql_password.txt`
SAML_CALLBACK_URL=https://gallerygateway.rit.edu/backend/auth/login/callback
SAML_ENTRY_POINT=https://login.cias.rit.edu/saml2/idp/SSOService.php
ISSUER=https://gallerygateway.rit.edu
SAML_SUCCESS_URL=https://gallerygateway.rit.edu
ENDENV

#
# Move the supervisor config into place
#
sudo rm /etc/supervisor/conf.d/gallerygateway.conf
sudo tee /etc/supervisor/conf.d/gallerygateway.conf > /dev/null << SUPERVISORCONF
[program:gallerygateway]
command=/usr/bin/node /opt/node/gallerygateway/main.js
directory=/opt/node/gallerygateway
redirect_stderr=true
environment=NODE_ENV="production"
stdout_logfile=/opt/node/gallerygateway/log.txt
stdout_logfile_maxbytes=1MB
stdout_logfile_backups=10
stdout_capture_maxbytes=1MB
stdout_events_enabled=false
stderr_logfile=/opt/node/gallerygateway/err_log.txt
stderr_logfile_maxbytes=1MB
stderr_logfile_backups=10
stderr_capture_maxbytes=1MB
stderr_events_enabled=false
user=$NODE_USER
SUPERVISORCONF

#
# Migrate the database
#
cd $PROJECT_ROOT/backend;
cp /opt/node/gallerygateway/.env .env;
# Stub some keys -- we don't need them, but they must exist for node to migrate
mkdir keys;
touch keys/idp_cert.pem;
touch keys/private.key;
touch keys/public.key;
NODE_ENV=development npm install;
npm run migrate;

#
# Start new server
#
sudo service supervisor restart

#
# Warn about missing certificates, if not found
#
if [ ! -f /opt/node/gallerygateway/keys/idp_cert.pem ]; then
        echo "Warning: /opt/node/gallerygateway/keys/idp_cert.pem not found." >&2;
        echo "    Please install the identity provider certificate" >&2;
fi;
if [ ! -f /opt/node/gallerygateway/keys/private.key ]; then
        echo "Warning: /opt/node/gallerygateway/keys/private.key not found." >&2;
        echo "    Please install the public/private key pair." >&2;
fi;
if [ ! -f /opt/node/gallerygateway/keys/public.key ]; then
        echo "Warning: /opt/node/gallerygateway/keys/public.key not found." >&2;
        echo "    Please install the public/private key pair." >&2;
fi;

#
# Housekeeping
#
cd $PROJECT_ROOT;
cd ../../;
rm -r $DEST_FOLDER "$DEST_FOLDER.zip";

#
# Finish
#
cat << FINMSG
   ______      ____                   ______      __
  / ____/___ _/ / /__  _______  __   / ____/___ _/ /____ _      ______ ___  __
 / / __/ __ '/ / / _ \/ ___/ / / /  / / __/ __ '/ __/ _ \ | /| / / __ '/ / / /
/ /_/ / /_/ / / /  __/ /  / /_/ /  / /_/ / /_/ / /_/  __/ |/ |/ / /_/ / /_/ /
\____/\__,_/_/_/\___/_/   \__, /   \____/\__,_/\__/\___/|__/|__/\__,_/\__, /
                         /____/                                      /____/

+----------------------------------------------------------------------------+
|                            Finished installing.                            |
+----------------------------------------------------------------------------+
FINMSG
