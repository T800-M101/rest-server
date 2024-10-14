const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [ true, 'The name is mandatory'],
        unique: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    price: {
        type: Number,
        default: 0
    },
    description: { type: String },
    available: { 
        type: Boolean,
        default: true
    },
    img: {
        type: String    
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

ProductSchema.methods.toJSON = function() {
    const { __v, active, ...data } = this.toObject();
    return data;
}


module.exports = model( 'Product', ProductSchema );