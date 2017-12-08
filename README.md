Start the MongoDB server by running './mongo.sh'. If the MongoDB server exits with an error, run ./mongo-repair.sh and then rerun ./mongo.sh.
If developing, run the Gulp task runner by running 'gulp'.
And finally, run the Express webserver by running 'node server.js'.

When the Express webserver is running on Cloud9, the URL is https://opl-final-project-jgibson02.c9users.io

server.js contains the Node.js app for starting and running the Express server.
routes/router.js contains Javascript logic for Express to handle different REST routes.
source/js/app.js contains the React.js front-end logic, and prod/js/app.js contains the compiled pure-Javascript output.
The *.js files in models/ contains the MongoDB/Mongoose schemas for documents in the database.