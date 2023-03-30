# How to setup an EduApp full working server.

This guide will show you how to setup an EduApp server including the main application, API, administration and database.

## Prerequisites

Be fore starting, you may need to download the following programs:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

To start off, clone this [github repository](https://github.com/eduappdevs/eduapp/)'s main branch. Once done, we will be focusing on these files and folders:

- ```configs``` folder inside of this folder
- individual ```*.env``` files that represent configuration
- ```byports-compose.yml``` to set up the applications with different ports and domains
<!-- - ```subdomain-compose.yml``` to set up the applications under a same port but different subdomains (api.eduapp.com, admin.eduapp.com) -->

For a more fluid and quick setup, it is recommended to have some knowledge on how to work with Docker and it's commands.

## Configuration by different ports and domains

To start off, let's take a look at the ```configs``` folder here.
The only config file we are going to need is ```eduapp-backend.conf```.

```nginx
upstream backend {
	server api:3000;
}

server {
	listen 80;
	server_name XXX.XXX.XXX.XXX;
	return 301 https://backend$request_uri;
}

server {
	listen 443 ssl;
	server_name XXX.XXX.XXX.XXX; # This needs to be changed.

	ssl_certificate /usr/shared/eduapp/certs/eduapp.crt;
	ssl_certificate_key /usr/shared/eduapp/certs/eduapp.key;

	location / {
		proxy_pass http://backend$request_uri;
	}
}
```

This file represents the server SSL configuration of the API. To expose the API, you need to assign the machine's public IP. If available, you may configure another port (```80:80```) inside the docker compose file to redirect all request in http to the respective https.

Inside the ```byports-compose.yml```, you will see different configurations for each container for each service. It's important not to touch these unless your changing ports. Everything else should be not tampered unless you know what you are doing.

Here's an example of what the ```ports``` section should look like.
```docker
nginx: # This is in charge of assigning SSL to the API.
    [...]
    ports: 
      - "3010:443" # Change the first number for different API port 
    depends_on:
      - api
    links:
      - "api:api"
app: # Main EduApp app.
    [...]
    ports:
      - "4010:443" # Change the first number for different port
admin: # Administration app.
    [...]
    ports:
      - "5010:443" # Change the first number for different port
```

If you change your ports or have different access domains, you must change these in their respective ```docker-example.env``` files inside of ```frontend```, ```backend``` and ```eduapp-administration-panel```.

Once the ports match and you have entered your custom domains, make sure to change the administration's bot account password in the backend's ```docker-example.env```. This is ***crucial***.

If at any point you feel comfortable and know what your doing, you may change ```.env``` files at any time to your liking. Just make sure you have the correct entries for the app to work properly. 

Make sure the .env files are correctly named with 'docker-example.env' as without it, environment variables will no be passed to the containers and no custom configuration will apply.

Finally, here is a main checklist to sum up what steps you have to do before creating the services:

- If running on containers, change the ```Gemfile``` version inside of ```backend/eduapp_db``` to ```2.6.9```. If not, leave it at ```2.6.8```
- Have a look and modify ```.env``` variables for each app (backend, frontend, administration-panel)
- Change the ```configs``` config file's ```server_name``` to the machine's public IP
- Added a ```.cert``` folder inside of ```eduapp-administration-panel/server``` and ```frontend/server``` with the files renamed to ```eduapp.crt``` and ```eduapp.key```
- Add a ```.cert``` folder to ```backend/eduapp_db``` with the files renamed to ```eduapp.crt``` and ```eduapp.key```
- Changed any ports if necessary in the ```byports-compose.yml```

Once you have completed this checklist and have Docker Desktop running, run the following command inside of the ```eduapp``` directory: ```docker-compose -f byports-compose.yml up -d```.

Once done, Docker will start creating the images and containers. When finished, you should be able to see the respective services on the ports and domains you assigned.
