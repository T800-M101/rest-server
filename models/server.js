const express = require('express');
const cors = require('cors');
const auth = require('../routes/auth');
const categories = require('../routes/categories');
const products = require('../routes/products');
const search = require('../routes/search');
const users = require('../routes/users');
const { dbConnection } = require('../database/config');

class Server {
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT

        // Connect database
        this.connectDB();

        //Middleware
        this.middleware();

        // app routes
        this.routes();
    }

    async connectDB() {
        await dbConnection();
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
        this.app.use('/api/auth', auth);
        this.app.use('/api/categories', categories);
        this.app.use('/api/products', products);
        this.app.use('/api/search', search);
        this.app.use('/api/users', users);
    }
  
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Rest server running on port ${this.port}`);
        });
    }
}


module.exports = Server;