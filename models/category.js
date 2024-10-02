const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
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
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

CategorySchema.methods.toJSON = function() {
    const { __v, active, ...data } = this.toObject();
    return data;
}


module.exports = model( 'Category', CategorySchema );