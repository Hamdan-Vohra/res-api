const express = require('express')
const morgan = require('morgan')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')

//creating express app
const app = express();

app.use(morgan('dev')) //it will log about the requests and it will call next function on its behalf

//middleware
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

//default case to handle error request
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err);
});

//This handler is for any error occured while acessing database, it will run just after above error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        err: {
            message: err.message
        }
    });
});

//exporting app
module.exports = app