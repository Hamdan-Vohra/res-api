const mongoose = require('mongoose')

//designing schema for products
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true }
})

//exporting model based on productSchema 
module.exports = mongoose.model('Product', productSchema)