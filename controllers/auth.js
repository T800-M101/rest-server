const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const generateJWT = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


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
            response: 'GET: An error occurred while logging the user',
        });
    }

}

const googleSignIn = async(req = request, res = response, next) => {

    try {
        const { id_token } = req.body;
        const { name, img, email } = await googleVerify(id_token);
        
        // Search the email retrieved from google sign in in our database
        let user = await User.findOne( { email });

        // If user does not exist, we create a new one
        if ( !user ) {
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true,
                role: 'USER_ROLE'
            };

            user = new User(data);
            await user.save();
        }

        // If user is not active, we deny the access
        if ( user && !user.active ) {
            return res.status(401).json({
                message: 'Not authorized - user blocked',
                status: 401,
                response: 'Talk to the administrator'
            });
        }

        // generate JWT
        const token = await generateJWT(user);

        return res.status(200).json({
            message: 'OK',
            status: 200,
            token,
            user
        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'GET: An error occurred while logging the user with Google',
        });
    }

}


module.exports = {
    login,
    googleSignIn
}