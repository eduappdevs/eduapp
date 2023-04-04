# How to setup an EduApp full working server.

This guide will show you how to setup an EduApp server including the main application, API, administration and database.

## Prerequisites

Before starting, you may need to download Docker:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

To start off, clone this [github repository](https://github.com/eduapp-project/eduapp/)'s main branch.

````
git clone https://github.com/eduapp-project/eduapp
````

For a more fluid and quick setup, it is recommended to have some knowledge on how to work with Docker and it's commands.

## Configuring the project

After cloning the project you have to edit some files taking into account the following ports which have been used as example:
- Port 8443 for the Frontend.
- Port 4010 for the Administration Panel.
- Port 3010 for the Backend or API.

### docker-compose.yml

```docker-compose.yml``` is the main docker file you have to edit. Just change the port of the Frontend, Administration Panel and API accordingly to your needs as commented in the file itself.

### backend/eduapp-db/.cert

Create the directory ```backend/eduapp-db/.cert``` and add the certificate files of your domain with the following names:
- eduapp.crt
- eduapp.key

### eduapp-administration-panel/server/.cert

Create the directory ```eduapp-administration-panel/server/.cert``` and add the certificate files of your domain with the following names:
- eduapp.crt
- eduapp.key

### frontend/server/.cert

Create the directory ```frontend/server/.cert``` and add the certificate files of your domain with the following names:
- eduapp.crt
- eduapp.key

### backend/eduapp-db/.env-example-production or backend/eduapp-db/.env-example-development

If you want to use the project without certificate in a local environment then rename the file ```backend/eduapp-db/.env-example-development``` to ```backend/eduapp-db/.env``` and change the data accordingly to the comments in the file itself.

Otherwise to use the project in a production environment with SSL certificate, rename the file ```backend/eduapp-db/.env-example-production``` to ```backend/eduapp-db/.env``` and change the data accordingly to the comments in the file itself.

### backend/eduapp-db/dockerfile-example-production or backend/eduapp-db/dockerfile-example-development

If you want to use the project without certificate in a local environment then rename the file ```backend/eduapp-db/dockerfile-example-development``` to ```backend/eduapp-db/dockerfile``` and change the data accordingly to the comments in the file itself.

Otherwise to use the project in a production environment with SSL certificate, rename the file ```backend/eduapp-db/dockerfile-example-production``` to ```backend/eduapp-db/dockerfile``` and change the data accordingly to the comments in the file itself.

### backend/eduapp-db/postgres.docker-example.env

Rename the file ```backend/eduapp-db/postgres.docker-example.env``` to ```backend/eduapp-db/postgres.docker.env``` and change the data accordingly to the comments in the file itself.

### eduapp-administration-panel/.env-example-production or eduapp-administration-panel/.env-example-development

If you want to use the project without certificate in a local environment then rename the file ```eduapp-administration-panel/.env-example-development``` to ```eduapp-administration-panel/.env``` and change the data accordingly to the comments in the file itself.

Otherwise to use the project in a production environment with SSL certificate, rename the file ```eduapp-administration-panel/.env-example-production``` to ```eduapp-administration-panel/.env``` and change the data accordingly to the comments in the file itself.

### eduapp-administration-panel/dockerfile

Change the data accordingly to the comments on the file itself. Basically the port.

### eduapp-administration-panel/package.json

Change the data accordingly to the comments on the file itself. Basically the port.

### frontend/.env-example-production or frontend/.env-example-development

If you want to use the project without certificate in a local environment then rename the file ```frontend/.env-example-development``` to ```frontend/.env``` and change the data accordingly to the comments in the file itself.

Otherwise to use the project in a production environment with SSL certificate, rename the file ```frontend/.env-example-production``` to ```frontend/.env``` and change the data accordingly to the comments in the file itself.

### frontend/dockerfile

Change the data accordingly to the comments on the file itself. Basically the port.

### frontend/package.json

Change the data accordingly to the comments on the file itself. Basically the port.

## Deploying your project

Once you have edited all the files above it's time to build the project.

````
docker-compose build
````

And now it's time to run it up

````
docker-compose up -d
````

If everything went well you can now see 4 docker containers running: 
- ```eduapp_api_1```, container of the Backend.
- ```eduapp_app_1```, container of the Frontend.
- ```eduapp_admin_1```, container of the Administration Panel.
- ```eduapp_db_1```, container of the postgres datatabase.

Check it out with the following command:

````
docker container ls
````

Now create and populate the database: (Run this only the first time)

````
docker exec eduapp_api_1 rails db:create
docker exec eduapp_api_1 rails db:migrate:reset
docker exec eduapp_api_1 rails db:seed
````

Now your EduApp deploy should be running in the following example URLs:
- https://your-domain:8443, for your Frontend.
- https://your-domain:4010, for your Administration Panel.

## Updating the project

If you want to upgrade the project with new updates follow this steps:

Pull the changes from the repository:

````
git pull origin main
````

Build the project.

````
docker-compose build
````

And now it's time to run it up

````
docker-compose up -d
````

That's all. Now your EduApp deploy should be running in the following example URLs:
- https://your-domain:8443, for your Frontend.
- https://your-domain:4010, for your Administration Panel.