const {  ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');


const searchUsers =  async( item ) => {
    const isMongoId = ObjectId.isValid(item);
    let users = [];
    if ( isMongoId ) {
        users.push(await User.findById(item));
    } else {
        const regex = new RegExp( item, 'i');
        users = await User.find( { 
            $or : [ { name: regex }, { email: regex } ],
            $and : [ { active : true }]
        });
    } 
        
    return users.length > 0 ? {
            message: 'Users found',
            status: 200,
            response: users 
        } : {
            message: 'Not found',
            status: 404,
            response: []
    }
       
}

const searchCategories = async( item ) => {
    const isMongoId = ObjectId.isValid(item);
    let categories = [];
    if ( isMongoId ) {
        categories.push(await Category.findById(item));
    } else {
        const regex = new RegExp( item, 'i');
        categories = await Category.find( { name: regex, active: true }, { name: 1 } );
    }

    return categories.length > 0 ? {
        message: 'Categories found',
        status: 200,
        response: categories
    } : {
        message: 'Not found',
        status: 404,
        response: []
    }
}

const searchProducts = async( item ) => {
    const isMongoId = ObjectId.isValid(item);
    let products = [];
    if ( isMongoId ) {
        products.push(await Product.findById(item).populate('category', 'user'));
    } else {
        const regex = new RegExp( item, 'i');
        products = await Product.find( {
            $or : [ { name: regex }, { description: regex } ],
            active : true 
        }).populate('category', 'user')
    }


    return products.length > 0 ? {
        message: 'Products found',
        status: 200,
        response: products
    } : {
        message: 'Not found',
        status: 404,
        response: []
    }
}

module.exports = {
    searchUsers,
    searchCategories,
    searchProducts
}