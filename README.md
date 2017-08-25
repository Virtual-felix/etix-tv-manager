# etix-tv-manager

The project has been made to make a team of HR able to share news, informations, give visibility about all department etc on all public screens (televisions) in the offices of the company. A viewer reachable with a web browser or an Android TV application show images and videos with a configurable speed (like an automated slideshow). An admin panel is provided on which you can upload all your medias, create your slideshow (called 'Timelines'), schedule them at specific dates for each specific televisions.

![alt text](https://github.com/felix-fabrega/etix-tv-manager/blob/develop/demo.gif)

The project is made of several parts.

### Admin panel

It is a front end on which you have to login with LDAP credentials.
A view let you upload medias (images, videos) and manage them. You can create timelines on it, specifying for each media a time to display, its order in the slideshow and its category.
The category can be displayed on the top of the slideshow (as in the example above), but it is optional.

Another view let you register the televisions of your choice with a name and their IP. It will make you able to select on which televisions (or IP) you want to schedule a slideshow.

The last view make you able to schedule timelines on the televisions at specific dates.

### Viewer

This is the front end which display timeline on televisions. It can be reach through a web browser or by the android TV application which make this project usable for other purpose than only televisions.
It will get timelines scheduled for the requesting IP address and display them at the right dates.

### Android TV application

You can install this application on your TV. It is a simple web view on the viewer.

## Build and run

The project is made of two front end in React, a Golang API, and work with a MYSQL Database, an S3 service such as Amazon Web Service S3 or minio.io, and a LDAP server.
Both front-end and the back-end can be runned in a docker or build and runned locally. A docker-compose is provided too launch all part of the project, including an LDAP server, an minio.io server (S3) and a MYSQL server.

### Lazy deployment

Run `docker-compose up --build` to build and run all part of this project.
The admin panel will be reachable on `127.0.0.1:3000` and the viewer on `127.0.0.1:3042`.
By launching it like this, the project will work locally only (on your machine).
If you want to make it work on your network, you have to edit the docker compose file with the correct informations (replace environment variables for services), or run services locally as described below.

A PHP interface for LDAP administration is provided too with docker-compose, reachable on `localhost:6443`.
By default, LDAP admin credentials are `cn=admin,dc=etixtv,dc=com` as username and `k9gkHCeMqGB83TKgqIOn38KXmgfpaNEBgQTucXHH` as password. You can change them by editing the docker compose file in the environment vars gave to the ldap-server service.
It is also recommanded to change read only user credentials. Then, create a group and an the users you want to.
```
...
environment:
  - "LDAP_ORGANISATION=etixtv"
  - "LDAP_DOMAIN=etixtv.com"
  - "LDAP_ADMIN_PASSWORD=k9gkHCeMqGB83TKgqIOn38KXmgfpaNEBgQTucXHH"
  - "LDAP_READONLY_USER=true"
  - "LDAP_READONLY_USER_USERNAME=etix"
  - "LDAP_READONLY_USER_PASSWORD=HS4SFCA35UZHNW3YBHOT"
...
```


You will have to replace the API and STATIC url gave to both front-end in the docker compose file too with the local IP of the running machine if you want the front-end reachable from other machine than yours.

```
environment:
  - "REACT_APP_API_URL=127.0.0.1"
  - "REACT_APP_API_PORT=4244"
  - "REACT_APP_STATIC_URL=127.0.0.1"
  - "REACT_APP_STATIC_PORT=8080"
```

### Build and run the API

#### locally

You have to set the environment variables needed by the API. Thanks to this, you can easily use your own MYSQL, S3 and LDAP servers.

Here are the default values.
```
DATABASE_URL=mysqldb
DATABASE_PORT=3306
DATABASE_USER=etix
DATABASE_PASSWORD=HS4SFCA35UZHNW3YBHOT
DATABASE_NAME=etixtv
LDAP_URL=ldap
LDAP_PORT=389
LDAP_READONLY_USER_USERNAME=etix
LDAP_READONLY_USER_PASSWORD=HS4SFCA35UZHNW3YBHOT
LDAP_DOMAIN=etixtv.com
S3_URL=mediaserver
S3_PORT=9000
S3_ACCESS_KEY=HS4SFCA35UZHNW3YBHOT
S3_SECRET_KEY=k9gkHCeMqGB83TKgqIOn38KXmgfpaNEBgQTucXHH
```
go in the `api/` folder then

run `go build . && ./api`

#### With docker

go in the `api/` folder then

run `docker build -t etix-api .`

then from root folder run
```
docker run -p 4242:4242 4244:4244 -e "DATABASE_URL=mysqldb" -e "DATABASE_PORT=3306"
-e "DATABASE_USER=etix" -e "DATABASE_PASSWORD=HS4SFCA35UZHNW3YBHOT"
-e "DATABASE_NAME=etixtv" -e "LDAP_URL=ldap"
-e "LDAP_PORT=389" -e "LDAP_READONLY_USER_USERNAME=etix"
-e "LDAP_READONLY_USER_PASSWORD=HS4SFCA35UZHNW3YBHOT" -e "LDAP_DOMAIN=etixtv.com"
-e "S3_URL=mediaserver" -e "S3_PORT=9000"
-e "S3_ACCESS_KEY=HS4SFCA35UZHNW3YBHOT" -e "S3_SECRET_KEY=k9gkHCeMqGB83TKgqIOn38KXmgfpaNEBgQTucXHH"
-v ./api:/go/src/etix-tv-manager/api
```

You can (should) replace all environment variables values by yours.

### Build and run both front-end

#### locally

You have to set the environment variables needed by the front-ends.

Here are the default values.
```
REACT_APP_API_URL=127.0.0.1
REACT_APP_API_PORT=4244
REACT_APP_STATIC_URL=127.0.0.1
REACT_APP_STATIC_PORT=8080
```

then run in the front-end folder (admin-panel and/or viewer) `npm install . && npm run start`

#### With docker

##### viewer

go in the `viewer/` folder then

run `docker build -t etix-viewer .`
then from root run
```
docker run -p 3042:3000 -e "REACT_APP_API_URL=127.0.0.1" -e "REACT_APP_API_PORT=4244"
-e "REACT_APP_STATIC_URL=127.0.0.1" -e "REACT_APP_STATIC_PORT=8080"
-v ./viewer:/usr/src/app etix-viewer
```

##### admin-panel

go in the `admin-panel/` folder then

run `docker build -t etix-admin-panel .`
then from root run
```
docker run -p 3042:3000 -e "REACT_APP_API_URL=127.0.0.1" -e "REACT_APP_API_PORT=4244"
-e "REACT_APP_STATIC_URL=127.0.0.1" -e "REACT_APP_STATIC_PORT=8080"
-v ./admin-panel:/usr/src/app etix-admin-panel
```


### Build android app

go in the `androidApp/` folder then

run `./build_and_sign.sh`
It will generate the dpkg file to install on your TV.
