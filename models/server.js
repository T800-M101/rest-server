const express = require('express');
const cors = require('cors');
const users = require('../routes/users');
const paths = require('../paths');

class Server {
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT
        this.usersPath = paths.users;

        //Middleware
        this.middleware();

        // app routes
        this.routes();
    }

    middleware() {
        // CORS - add configurations when there are frontend app requests
        this.app.use(cors());

        // Reading and Parsing body, so the controllers can read the request body
        this.app.use(express.json());

        // Public directory (answers to http://localhost:8080)
        this.app.use( express.static('public'));

    }

    routes() {
        this.app.use(this.usersPath, users);
    }
  


    listen() {
        this.app.listen(this.port, () => {
            console.log(`Rest server running on port ${this.port}`);
        });
    }
}


module.exports = Server;