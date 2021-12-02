# BOARD GAME API

## SUMMARY

A RESTful API whose endpoints provide access to a database of board games, including reviews and comments.

## HOSTED VERSION

https://northcoders-board-games.herokuapp.com/api/

## INSTRUCTIONS

### CLONING

Click the code button, then copy the HTTPS link provided. In your Command Line, navigate to the directory where you want to clone the project, and enter `GIT CLONE REP_LINK_HERE` .

### INSTALL DEPENDENCIES

Once cloned, in the same directory enter the command `NPM INSTALL` . You will need to have `NPM` installed for this to work.

### SET UP DATABASE

Run `NPM RUN SETUP-DBS` to create a database for developing, `nc_games` , and smaller database for testing, `nc_games_test` . After this, run `NPM RUN SEED` to populate both databases with juicy board game information. To allow for the API to select the correct database to work with, you will need to create two files in the root of the project folder for `DOTENV` . Call the first file `env.development` , open it and enter the text "PGDATABASE=nc_games". The second file should be called `env.test` and should contain the test "PGDATABASE=nc_games_test".

### TESTING

To test the endpoints, you will first need to install Supertest. Run `NPM INSTALL SUPERTEST --SAVE DEV` .
To run the provided tests, run `NPM TEST` . You can add or amend tests in the `APP.TEST.JS` file in the **tests** folder.

## REQUIREMENTS

The project requires `Node.js` version 16.11.0 and `Postgres` version 12.9.
