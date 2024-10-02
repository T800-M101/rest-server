const { request, response } = require("express");
const {  ObjectId } = require('mongoose').Types;
const { User, Category, Product } = require('../models');
const collections = ['users', 'categories', 'products', 'roles'];



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
        products.push(await Product.findById(item)).populate('category', 'user');
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





const search = async(req = request, res = response) => {
    let response;
       
    try {
        const { collection, item } = req.params;
    
        if ( !collections.includes(collection) ) {
            return res.status(400).json({
                message: 'Bad Request',
                status: 400,
                response: `The collection '${collection}' is not allowed.`
            });
        }

        switch (collection) {
            case 'users':
                response = await searchUsers(item);
            break;

            case 'categories':
                response = await searchCategories(item);
            break;

            case 'products':
                response = await searchProducts(item);
            break;

            case 'roles':
                
            break;
        
            default:
                return res.status(500).json({
                    message: 'Internal Server Error',
                    status: 500,
                    response: 'GET: collection not implemented',
                });

                break;
        }

        return res.status(response.status).json({
            message: response.message,
            status: response.status,
            response: response.response
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'GET: An error occurred while searching',
        });
    }



}






module.exports = {
    search
}