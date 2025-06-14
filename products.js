const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.schema({
    id: {type: String, default: uuidv4},
    name: {type: String, required: true},
    price: Number,
    category: String,
    inStock : {type:Boolean, default: true}
});

module.exports = mongoose('products', productSchema);