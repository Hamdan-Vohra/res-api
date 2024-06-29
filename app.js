//dependencies
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')

//creating express app
const app = express();

const dbUrl = 'mongodb+srv://hamdanvohra5676:Humanatarians@rest-api.1odskct.mongodb.net/?retryWrites=true&w=majority&appName=rest-api'
//if we have not created any database it will create by itw own of the same name as we mentioned in link like in this case 'nodedb'
//this connect function runs asynchronously so we will use returned promise to run after it will be connected
mongoose.connect(dbUrl).then(() => {
    console.log('connected to database')
}).catch((err) => { console.log(err) })

//                  These Middlewares are funnels for each request

app.use(morgan('dev')) //it will log about the requests and it will call next function on its behalf

// To parse the body urlencoded and supports json object but doesn't support files
//extended: true to allow the extended bodies with rich data
//extended: false allows to support only simple bodies fir URL encoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Handling CORS Errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')// '*' is to allow for all route we can specify the route
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT POST GET PATCH DELETE')//all http methods you use in your api for routing
        return res.status(200).json({})
    }
    //if we don't encounter in if condition then no return statement runs so next() is called
    next();
})

//middleware for routes
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