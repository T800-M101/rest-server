const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const { auth, categories, products, search, uploads, users } = require('../routes');

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

        // Fileupload 
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        this.app.use('/api/auth', auth);
        this.app.use('/api/categories', categories);
        this.app.use('/api/products', products);
        this.app.use('/api/search', search);
        this.app.use('/api/uploads', uploads);
        this.app.use('/api/users', users);
    }
  
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Rest server running on port ${this.port}`);
        });
    }
}


module.exports = Server;