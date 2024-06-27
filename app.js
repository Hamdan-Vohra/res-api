const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')

//creating express app
const app = express();

app.use(morgan('dev')) //it will log about the requests and it will call next function on its behalf

// to parse the body urlencoded and supports json object but doesn't support files
//extended: true to allow the extended bodies with rich data
//extended: false allows to support only simple bodies fir URL encoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
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