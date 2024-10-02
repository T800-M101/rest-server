const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');




const validateJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');
    // Verify is there is token in the request
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized',
            status: 401,
            response: 'No token found in request'
        });
    }

    try {
        // Verify token and get authencticated user id
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify if the autheticated user is active in the database 
        const user = await User.findById( uid );

        if (!user || !user.active) {
            return res.status(401).json({
                message: 'Unauthorized',
                status: 401,
                response: 'User is not in the database'
            });

        } else {
            req.authenticatedUser = user;
            next();
        }

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid Token',
            status: 401,
        });
    }
}


module.exports = {
    validateJWT
};