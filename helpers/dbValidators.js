const Role = require('../models/role');
const User = require('../models/user');



const isValidRole = async(role) => {
    const validRole = await Role.findOne({ role });
    if(!validRole) {
        throw new Error(`The role '${ role }' is not registered in the database.`);
    }
}


const isEmailUnique = async(email) => {
    const emailUnique = await User.findOne({ email});
    if ( emailUnique ) {
        throw new Error(`The email '${ email }' already exist in the database.`);
    } 
} 

const validateUserById = async(id) => {
    const userExist = await User.findById( id );
    if ( !userExist ) {
        throw new Error(`The user by id '${ id }' does not exist in the database.`);
    }
}





module.exports = {
    isValidRole,
    isEmailUnique,
    validateUserById
}