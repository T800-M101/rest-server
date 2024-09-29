const { request, response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


const getUser = async(req = request, res = response) => {

    try {
        const { id } = req.params;
        const user = await User.findById(id);
    
        return res.status(200).json({
            message: 'User found',
            status: 200,
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
};

const getUsers = async(req, res) => {
const { from = 0, limit = 0 } = req.query;

    try {
        const [total, users ] = await Promise.all([
            User.countDocuments({ active: true }),
            User.find({ active: true })
            .skip(Number(from))
            .limit(Number(limit))
        ]
        );

        if ( !total || !users ) {
            return res.status(404).json({
                message: 'Users not found',
                status: 404,
                users: []
            });
        }

        return res.status(200).json({
            message: 'Users found',
            status: 200,
            totalUsers: total,
            totalRetrieved: users.length,
            users
        });
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'POST: An error occurred while creating the user',
        });
    }
}

const createUser = async (req, res = response) => {

    try {
        const { name, email, password, role } = req.body;
    
        // Create new user
        const user = new User({
            name,
            email,
            password,
            role
        });
    
        // Hash password ( 10 by default )
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
    
        // Save user in DB
        await user.save();
        
        return res.status(201).json({
            message: 'Created',
            status: 201,
            user
        });

    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'POST: An error occurred while creating the user',
        });
    }
};

const setUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, password, google, ...rest } = req.body;
    
        // Validate against the database
        if ( password ) {
             // Hash password ( 10 by default )
             const salt = bcrypt.genSaltSync();
             rest.password = bcrypt.hashSync(password, salt);
        }
    
        const user = await User.findByIdAndUpdate( id, rest, { new: true} );
    
        return res.status(200).json({
            message: 'User updated',
            status: 200,
            user
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'PUT: An error occurred while updating the user',
        });
    }
};

const updateUser = (req, res = response) => {
   return res.json({
        msg: 'patch API'
    });
}

const deleteUser = async(req, res = response) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { active: false }, { new: true });
        
        return res.status(200).json({
            message: 'User deleted',
            status: 200,
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'DELETE: An error occurred while deleting the user',
        });
    }
};





module.exports = {
    getUser,
    getUsers,
    createUser,
    setUser,
    deleteUser,
    updateUser
}


