const { request, response } = require('express');
const { Product } = require('../models');

// public
const getProducts = async(req = request, res = response) => {
   
    const { from = 0, limit = 0 } = req.query;

    try {
        const [total, products ] = await Promise.all([
            Product.countDocuments({ active: true }),
            Product.find({ active: true })
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit))
        ]
        );

        if ( !total || !products ) {
            return res.status(404).json({
                message: 'Products not found',
                status: 404,
                products: []
            });
        }

        return res.status(200).json({
            message: 'Products found',
            status: 200,
            totalProducts: total,
            totalRetrieved: products.length,
            products
        });
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'GET: An error occurred while getting the products'
        });
    }
}

// public
const getProductById = async(req = request, res = response) => {
    try {
        // Id of the category to find
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate('user', 'name')
            .populate('category', 'name');
    
        return res.status(200).json({
            message: 'Product found',
            status: 200,
            product
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'GET: An error occurred while getting the product',
        });
    }
}

// any valid token can do it
const createProduct = async(req = request, res = response) => {
    try {
        
        const { active, user, ...rest } = req.body;

        // Prepare DTO to create a new product. Active is set to true by default.
        const data = {
            ...rest,
            name : rest.name.toUpperCase(),
            user: req.authenticatedUser._id
        }
        
        // Creating new category
        const product = await new Product(data);
        
        // Saving category in the DB
        await product.save();

        return res.status(201).json({
            message: 'OK',
            status: 201,
            product
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            response: 'POST: An error occurred while creating the product'
        });
    }
}

// any valid token can do it
const setProduct = async(req = request, res = response) => {
    try {
        // Id of the category to update
        const { id } = req.params;
        const { active, user, ...rest } = req.body;
        if ( rest.name ) {
            rest.name = rest.name.toUpperCase();
        }

        rest.user = req.authenticatedUser._id;
    
    
        const product = await Product.findByIdAndUpdate( id, rest, { new: true} );
    
        return res.status(200).json({
            message: 'Product updated',
            status: 200,
            product
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'PUT: An error occurred while updating the product',
        });
    }
}

// Only admins can do it
const deleteProduct = async(req = request, res = response) => {
    try {
        // Delete resource
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, { active: false, available: false }, { new: true });
        
        return res.status(200).json({
            message: 'Product deleted',
            status: 200,
            product
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'DELETE: An error occurred while deleting the product',
        });
    }
}



module.exports = {
    getProducts,
    getProductById,
    createProduct,
    setProduct,
    deleteProduct
}