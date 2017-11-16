###Express Server Backend w/ Auth Routes Template

##Description
  This repo is a backend template w/ pre-made routes for saving, verifying, updating, and destroying user credentials.

##Dependencies: bcrypt, body-parser, dotenv, express, jsonwebtoken, knex, pg

##Setup

#From the cli run the following commands replacing ... w/ database name for your project
  yarn install
  createdb ...
  createdb ...-test
  touch .gitignore
  vim .gitignore
  press i
  type node_modules
  hit enter
  type .env
  press esc
  type :wq
  press enter

#From text editor update .env file
  JWTSECRET = ...
  DATABASE_URL = ...
  DATABASE_URL_TEST = ...-test
  FRONTEND_URL = ...

#From text editor update package.json name for new project

#From the cli run the following command to start the server using nodemon
  yarn start

#Create github repo, set remote, and push changes
