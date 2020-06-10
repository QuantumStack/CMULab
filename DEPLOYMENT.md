
# Deployment

## Provision a Server

1. Setup a VPS running [Debian Buster](https://www.debian.org/releases/buster/) (10.x) with any cloud provider (e.g. Amazon, Google, Microsoft, DigitalOcean).
   - Note: this documentation assumes that you use [DigitalOcean](https://www.digitalocean.com).
   - Make a note of your server's IP address.
2. Add an `A` record from the desired domain to the static IP address.
3. Use an SSH Key instead of a password. Disable passwords for the server. This is *very* important for security.
    1. Generate an SSH Key on your **local** machine:

         ```bash
         $ ssh-keygen
         Generating public/private rsa key pair.
         Enter file in which to save the key (/Users/username/.ssh/id_rsa): .ssh/cmulab_key
         ...
         ```

         - Use a passphrase if possible. Do not lose this passphrase, otherwise you will lose access to the server.

    2. Transfer the SSH Key to the server:

        ```bash
        $ ssh-copy-id -i ~/.ssh/cmulab_key.pub user@host
        ```

    3. Test logging into the server with the new key.

        ```bash
        $ ssh -i ~/.ssh/cmulab_key user@host
        ```

        - If you receive an `UNPROTECTED PRIVATE KEY FILE` error, run

            ```bash
            $ sudo chmod 600 ~/.ssh/cmulab_key
            $ sudo chmod 600 ~/.ssh/cmulab_key.pub
            ```

    4. Disable logging in without password.
       1. While logged into the server, edit the `/etc/ssh/sshd_config` file.

           ```bash
           $ sudo nano /etc/ssh/sshd_config
           ```

       2. Find the line `PasswordAuthentication` and set it to `no`.

            ```config
            PasswordAuthentication no
            ```

       3. Restart the `ssh` service.

            ```bash
            $ sudo systemctl restart ssh
            ```

## Setup Prerequisites

- Log into the server and install `curl`

    ```bash
    $ sudo apt-get update
    $ sudo apt-get install curl
    ```

1. Install [Node.js](https://nodejs.org/en/).

   ```bash
   $ curl -sL https://deb.nodesource.com/setup_13.x | bash -
   $ sudo apt-get install -y nodejs
   ```

2. Install [MongoDB](https://www.mongodb.com/).
    1. Import the public key used by the package management system.

        ```bash
        $ wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
        ```
    2. Create a `/etc/apt/sources.list.d/mongodb-org-4.2.list` file for MongoDB.

        ```bash
        $ echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
        ```
    3. Reload local package database.


        ```bash
        $ sudo apt-get update
        ```

    4. Install the MongoDB packages.

        ```bash
        $ sudo apt-get install -y mongodb-org
        ```

    5. Start MongoDB Server

        ```bash
        $ sudo systemctl start mongod
        ```

        - You may verify that the server is actually running by executing the following:

            ```bash
            $ mongo --eval 'db.runCommand({ connectionStatus: 1})'
            MongoDB shell version vx.x.x
           connecting to: mongodb://127.0.0.1:27017
           MongoDB server version: x.x.x
           {
               "authInfo" : {
                   "authenticatedUsers" : [ ],
                   "authenticatedUserRoles" : [ ]
               },
               "ok" : 1
           }
           ```

3. Obtain Google OAuth Information

    1. Obtain OAuth 2.0 credentials from the [Google API Console](https://console.developers.google.com/).

        1. Go to credentials and create a project.
        2. Create credentials for OAuth Client ID.
           1. Configure the consent screen for external users, with the name "CMULab".
              1. Add `domain` to your authorized domains, replacing `domain` with your server's domain.
           2. Set the Application Type to Web Application.
           3. Set the Authorized redirect URIs to `https://domain/login/callback`, replacing `domain` with your server's domain.
        - Keep a note of the Client ID and Client Secret. You will need these for later, but they must be kept secure.
  
## Setup CMULab

1. Clone the CMULab repository.

    ```sh
    $ sudo apt-get install git
    $ git clone https://github.com/QuantumStack/CMULab
    $ cd CMULab/server
    ```

2. Fill in `server/.env` with `$ nano .env`.
   -  Set `NODE_ENV=production`
   -  Set `CMULAB_DATABASE="mongodb://127.0.0.1:27017/cmulab”`
   -  Set `CMULAB_LOC="your_server_address"`
      -  For example, if your server was located at `http://cmulab.com`, set `CMULAB_LOC="http://cmulab.com`.
   -  Set `CMULAB_GOOGLE_ID` equal to the Client ID you obtained previously.
   -  Set `CMULAB_GOOGLE_SECRET` equal to the Client Secret you obtained previously.
   -  Set `SESSION_SECRET` equal to a randomly generated 25 character string.
      -  Make sure that this is generated in a cryptographically secure manner.

3. Install necessary `npm` packages.

    ```sh
    $ npm install
    $ npm start
    ```

    - You may verify that everything is working upto this point by going to your domain with port `3000`.
      - Again, if your address is `http://cmulab.com`, go to `http://cmulab.com:3000`.
    - If the server is working, you may exit the `npm start` command.

4. Setup [PM2](https://pm2.keymetrics.io/).
   1. Install through `npm`

        ```sh
        $ npm install pm2 -g
        ```

   2. Start the server through `pm2`

        ```sh
        $ pm2 start --name CMULab ./bin/www
        ```

   3. Verify that the server is running.

        - Verify through the terminal

            ```sh
            $ pm2 status
            ```

            - If the server appears to be restarting itself, take a note of the PM2 ID for CMULab and run

                ```sh
                $ pm2 logs [id]
                ```

        - Verify by accessing `http://your_domain:3000` in your web browser.

   4. Make `pm2` run when the server starts up.

        ```sh
        $ sudo pm2 startup
        $ sudo systemctl start pm2-root
        ```

5. Setup [Nginx](https://www.nginx.com/) as a reverse proxy.
    1. Install Nginx.
        1. Install Nginx Package.

           ```sh
           $ sudo apt-get update
           $ sudo apt-get install nginx
           ```

        2. Setup firewall around Nginx.

            ```sh
            $ sudo apt-get install ufw
            $ sudo ufw allow 'Nginx Full'
            ```

        3. Verify that Nginx is running.
            1. Check system service status.

                ```sh
                $ sudo systemctl status nginx
                ```

                - If this is stopped or not running, start it by running

                    ```sh
                    $ sudo systemctl start nginx
                    ```

            2. Access the Nginx landing page in your web browser.
                - You may do this by accessing the URL (e.g. `http://your_server_url`)

    2. Run proxy to Node server.
       1. Create a Nginx site replacing `your_domain` with your URL.

            ```sh
            $ sudo nano /etc/nginx/sites-available/your_domain
            ```

       2. Add the following content to the file.

            ```conf
            server {
                    listen 80;
                    listen [::]:80;

                    server_name your_domain;

                    location / {
                       proxy_pass http://localhost:3000;
                       proxy_http_version 1.1;
                       proxy_set_header Upgrade $http_upgrade;
                       proxy_set_header Connection 'upgrade';
                       proxy_set_header Host $host;
                       proxy_cache_bypass $http_upgrade;
                   }
            }
            ```

       3. Link the file to enabled sites replacing `your_domain` with your domain.

            ```sh
            $ sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/
            ```

       4. Verify that you didn't introduce any syntax errors.

            ```sh
            $ sudo nginx -t
            ```

       5. Restart Nginx.

            ```sh
            $ sudo systemctl restart nginx
            ```

       6. Verify that the reverse proxy is working by accessing your domain in your browser: `http://your_domain`.

6. Secure the server with [Let's Encrypt](https://letsencrypt.org/).
    1. Install certbot.
        1. Update your package repositories.

           ```sh
           $ sudo apt-get update
           ```

        2. Install dependencies.

           ```sh
           $ sudo apt-get install \
               python3-acme \
               python3-certbot \
               python3-mock \
               python3-openssl \
               python3-pkg-resources \
               python3-pyparsing \
               python3-zope.interface
           ```
        
        3. Install certbot.

            ```sh
            $ sudo apt install python3-certbot-nginx
            ```
    2. Obtain your SSL Certificate replacing `your_domain` with your server's URL.

        ```sh
        $ sudo certbot --nginx -d your_domain
        ```

        - When prompted to redirect HTTP traffic to HTTPS, select the redirect option.

    3. Edit `CMULAB_LOC` in `.env` to be `https` instead of `http`.
    4. Try accessing your server through `https://your_domain`.


## Configuring CMULab

1. Add yourself to the database replacing `andrew_id` with your Andrew ID.

   ```sh
   $ mongo cmulab
   > db.users.insert({"_id": "andrew_id", "admin": true});
   ```

2. Edit `config.json`
    - Set `emailDomain` to be `andrew.cmu.edu`, or set to whatever email domain you are using.
    - Leave the rest untouched as you can edit them inside the server.

3. Restart the server through `pm2`

    ```sh
    $ pm2 restart [id]
    ```

4. Login to the server by clicking on `Admin Console` and logging in with the Google account corresponding to the email domain you used earlier.

5. Add remaining TAs through the TA page.
