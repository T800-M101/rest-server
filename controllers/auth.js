const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const generateJWT = require('../helpers/jwt');


const login = async(req = request, res = response) => {
    const { email, password } = req.body;

    try {
        // Verify if the email exist and the user is active in the database
         const user = await User.findOne( { email } );
         if (!user || !user.active) {
            return res.status(404).json({
                message: 'The user does not exist in the database.',
                status: 404,
            });
         }

        // Verify password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials',
                status: 400,
                response: 'email or password invalid'
            });
        }

        // Generate Web Token
        const token = await generateJWT(user);

        return res.status(200).json({
            message: 'OK',
            status: 200,
            token,
            user
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'GET: An error occurred while getting the user',
        });
    }

}


module.exports = {
    login
}