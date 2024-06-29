const mongoose = require('mongoose')

//designing schema for products
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
})

//exporting model based on productSchema 
module.exports = mongoose.model('Product', productSchema)