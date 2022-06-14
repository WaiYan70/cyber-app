# Select the code between double quotes, can type and run in ternimal

# Node Version is v16.14.0

# NPM version is 8.12.1

# Need connection to run bootstrap, google font and fontawesome

if fontawesome doesn't work, use your own kit code from fontawesome website and replace key with your own kwy

# To install node packages in ternimal 

type "npm install" or "npm i" in terminal  to install necessary package  
ype "npm start" in terminal  to run web app

## To build DataBase's table in ternimal

type "psql -U autherName" in ternimal for accessing database and table as aurther 
for example: "psql -U khantwaiyan"

type "CREATE DATABASE databaseName" to create database in database
For example: "CREATE DATABASE nodelogin"

type "\c tablename" to connect to  "databaseName"
for example: "\c nodelogin"

users" users as tableName 
type "CREATE TABLE users (id BIGSERIAL PRIMARY KEY NOT NULL, name VARCHAR(200) NOT NULL, email VARCHAR(200) NOT NULL, UNIQUE(email));"

type "SELECT * FROM users" to display the data form users table
