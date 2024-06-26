# ToDoNotes
An example application showcasing my capabilities in development.

## Running the application
The application is set up to run two "servers" simultaneously. 

It is recommended to use `node v20.6.0 onwards` due to the application using the `--env-file=.env` option, which is not supported by earlier versions (Refer to [Node Release v20.6.0](https://nodejs.org/en/blog/release/v20.6.0))

This application requires a MySQL database to be initialised according to the `schema.sql` underneath the `./backend` folder

`npm run init` in the root directory of the repository will recursively install all the required packages. From the root, to the frontend packages and finally the backend packages.

`npm run dev` in the root directory will run a "development" version of the file, running both the frontend and the backend on their own respective ports. Currently the only difference is that the backend is run using nodemon instead of node.

`npm run start` in the root directory will run the application, runnin gboth frontend and backend on their own respective ports. Use this if you do not have or wish to have nodemon installed locally on your machine.

## Documentation

A Postman Collection has been added to the repository, should you wish to refer to that instead of running the frontend simultaneously;

`npm run start:backend` will run the server only and you may continue to use postman instead
