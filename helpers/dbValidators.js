const { Role } = require('../models');
const { User } = require('../models');
const { Category } = require('../models');
const { Product } = require('../models');


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

const validateCategoryById = async(id) => {
    const categoryExist = await Category.findById( id );
    if ( !categoryExist ) {
        throw new Error(`The category by id '${ id }' does not exist in the database.`);
    }
}

const validateCategoryName = async(name) => {
    name = name.toUpperCase();
    const categoryExist = await Category.findOne( { name } );
    if ( categoryExist ) {
        throw new Error(`The category '${ name }' already exist in the database.`);
    }
}

const validateProductById = async(id) => {
    const productExist = await Product.findById( id );
    if ( !productExist ) {
        throw new Error(`The product by id '${ id }' does not exist in the database.`);
    }
}

const validateProductName = async(name) => {
    name = name.toUpperCase();
    const productExist = await Product.findOne( { name } );
    if ( productExist ) {
        throw new Error(`The product '${ name }' already exist in the database.`);
    }
}

const allowedCollections = (collection, collections ) => {
    const included = collections.includes(collection);
    if ( !included ) {
        throw new Error(`The collection '${ collection }' is not allowed.`);
    }
    return true;
}




module.exports = {
    isValidRole,
    isEmailUnique,
    validateUserById,
    validateCategoryById,
    validateCategoryName,
    validateProductById,
    validateProductName,
    allowedCollections
}