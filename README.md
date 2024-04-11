## Description
This is the backend of the GrocerGo website.

&nbsp;

## Dependencies
NodeJS 20.9.0, Redis 5.0.14, MySQL 8.0, Nginx 12.4.0

&nbsp;

## Setup
To get started, follow the following steps:
* Install Node in the local environment
* Insall Redis in the local environment
* Install MySQL 8.0 in the local environment
* Create a new database and use the database cloning script to initialize and populate the dabase with data records
* Run "npm install" in the project's root directory
* Edit "db.js" under the "config" folder according to your MySQL configuration
* Optionally, install Nginx in the local environment and replace your nginx.conf file with the provided nginx.conf file (the provided nginx.conf file is for Windows machines, adapt it accordingly on Mac or Linux machines)
* Run Redis and MySQL80 (optionally, run Nginx)
* Run the command "npm run dev" or "npm run prd", the app should now be running at "http://localhost:8000". If Nginx is also run, the app can be accessed via "http://localhost:8080/api" as well

&nbsp;

## Database E/R Diagram
https://www.figma.com/file/oKegYA6cTIjn85LsG717DX/Untitled?type=design&node-id=0%3A1&mode=design&t=Uvdwy3vTF9caJhvc-1  
