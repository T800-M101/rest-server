const { response, request } = require("express");

const collections = ['users', 'categories', 'products', 'roles'];


const validateCollections = (req = request, res = response, next) => {
    const { collection } = req.params;
    if ( !collections.includes(collection) ) {
        return res.status(404).json({
            message: 'Bad request',
            status: 404,
            response: `The collection '${ collection }' is not allowed.`
        });
    }
    next();
}


module.exports = {
    validateCollections
}

