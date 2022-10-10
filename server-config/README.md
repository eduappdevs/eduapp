# How to setup an EduApp full working server.

This guide will show you how to setup an EduApp server including the main application, API, administration and database.

## Prerequisites

Before starting, you may need to download Docker:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

To start off, clone this [github repository](https://github.com/eduapp-project/eduapp/)'s main branch. 



For a more fluid and quick setup, it is recommended to have some knowledge on how to work with Docker and it's commands.

## Configuration files

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

### backend/eduapp-db/.env-example

Rename the file ```backend/eduapp-db/.env-example``` to ```backend/eduapp-db/.env``` and change the data accordingly to the comments in the file itself.

### backend/eduapp-db/Dockerfile

Change the data accordingly to the comments on the file itself. Basically the port.

### backend/eduapp-db/postgress.docker-example.env

Rename the file ```backend/eduapp-db/postgress.docker-example.env``` to ```backend/eduapp-db/postgress.docker.env``` and change the data accordingly to the comments in the file itself.

### eduapp-administration-panel/.env-example

Rename the file ```eduapp-administration-panel/.env-example``` to ```eduapp-administration-panel/.env``` and change the data accordingly to the comments in the file itself.

### eduapp-administration-panel/Dockerfile

Change the data accordingly to the comments on the file itself. Basically the port.

### eduapp-administration-panel/package.json

Change the data accordingly to the comments on the file itself. Basically the port.

### frontend/.env-example

Rename the file ```frontend/.env-example``` to ```frontend/.env``` and change the data accordingly to the comments in the file itself.

### frontend/Dockerfile

Change the data accordingly to the comments on the file itself. Basically the port.

### frontend/package.json

Change the data accordingly to the comments on the file itself. Basically the port.

## Deploying your project

Once you have edited all the files above it's time to build the project.

````
docker-compose build
````

If everything went well you can now see 3 docker images: 
- ```eduapp_api```, image of the Backend.
- ```eduapp_app```, image of the Frontend.
- ```eduapp_admin```, image of the Administration Panel.

Check it out with the following command:

````
docker image ls
````

Run the Postgress image for the project. Notice you have to change password and user for your database accordingly to above configuration files.

````
docker run --name eduapp_postgress -e POSTGRES_DB=postgres -e POSTGRES_PASSWORD=custom-password-1234 -e POSTGRES_USER=eduapp_user -e PGDATA="/var/lib/postgresql/data/pgdata" -p 5432:5432 -v eduapp_db_data:/var/lib/postgresql/data/pgdata -d postgres:14
````

Inspect the created container to find out the IP of the Postgress container.

````
docker inspect eduapp_postgress
````

Now it's time to create the containers from the rest of images created. Notice we have used the ports of the example. And the IP 172.17.0.6 would be the IP found out above for the Postgress container.

````
docker run --name eduapp_api -p 3010:3010 -e DB_HOST=172.17.0.6 -d eduapp_api
docker run -p 8443:8443 -d eduapp_app
docker run -p 4010:4010 -d eduapp_admin
````

Now create the data in the database:

````
docker exec eduapp_api rails db:create
docker exec eduapp_api rails db:migrate:reset
docker exec eduapp_api rails db:seed
````

Now your EduApp deploy should be running in the following example URLs:
- https://your-domain:8443, for your Frontend.
- https://your-domain:4010, for your Administration Panel.