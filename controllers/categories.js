const { request, response } = require('express');
const { Category } = require('../models');

// public
const getCategories = async(req = request, res = response) => {
   
    const { from = 0, limit = 0 } = req.query;

    try {
        const [total, categories ] = await Promise.all([
            Category.countDocuments({ active: true }),
            Category.find({ active: true })
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(limit))
        ]
        );

        if ( !total || !categories ) {
            return res.status(404).json({
                message: 'Categories not found',
                status: 404,
                categories: []
            });
        }

        return res.status(200).json({
            message: 'Categories found',
            status: 200,
            totalCategories: total,
            totalRetrieved: categories.length,
            categories
        });
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'GET: An error occurred while getting the categories'
        });
    }
}

// public
const getCategoryById = async(req = request, res = response) => {
    try {
        // Id of the category to find
        const { id } = req.params;
        const category = await Category.findById(id).populate('user', 'name');
    
        return res.status(200).json({
            message: 'Category found',
            status: 200,
            category
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'GET: An error occurred while getting the category',
        });
    }
}

// any valid token can do it
const createCategory = async(req = request, res = response) => {
    try {
        // Get name of the category 
        const name = req.body.name.toUpperCase();
        
    
        // Prepare DTO to create a new category. Active is set to true by default.
        const data = {
            name,
            user: req.authenticatedUser._id
        }

        // Creating new category
        const category = await new Category(data);
        
        // Saving category in the DB
        await category.save();

        return res.status(201).json({
            message: 'OK',
            status: 201,
            category
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            status: 500,
            response: 'POST: An error occurred while creating the category'
        });
    }
}

// any valid token can do it

const setCategory = async(req = request, res = response) => {
    try {
        // Id of the category to update
        const { id } = req.params;
        const { active, user, ...rest } = req.body;
        rest.name = rest.name.toUpperCase();
        rest.user = req.authenticatedUser._id;
    
    
        const category = await Category.findByIdAndUpdate( id, rest, { new: true} );
    
        return res.status(200).json({
            message: 'Category updated',
            status: 200,
            category
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'PUT: An error occurred while updating the category',
        });
    }
}

// Only admins can do it
const deleteCategory = async(req = request, res = response) => {
    try {
        // Delete resource
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, { active: false }, { new: true });
        
        return res.status(200).json({
            message: 'Category deleted',
            status: 200,
            category
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error',
            status: 500,
            response: 'DELETE: An error occurred while deleting the category',
        });
    }
}



module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    setCategory,
    deleteCategory
}