const express = require('express')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')

//creating express app
const app = express();

//middleware
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

//exporting app
module.exports = app