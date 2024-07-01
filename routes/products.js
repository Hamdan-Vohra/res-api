const express = require('express')
const mongoose = require('mongoose')
const Product = require('../models/product')
//acessing router of an express app
const router = express.Router()

//we use next function because it is running on middleware
router.get('/', (req, res, next) => {
    //we can add more functionality after find() like find().where()
    Product.find().select('name price _id') //this is the function to select which 
        .exec()
        .then(products => {
            const response = {
                count: products.length,
                products: products.map(product => {
                    return {
                        name: product.name,
                        price: product.price,
                        _id: product._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + product._id
                        }
                    }

                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })

    //save() is fn provided by the mongoose to store the mongoose model in database
    product.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created Product',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        })
    }).catch(err => {
        console.log('Error!', err)
        res.status(500).json({
            error: err
        })
    });

})
router.get('/:productID', (req, res, next) => {
    Product.findById(req.params.productID).select('name price _id')
        .exec()
        .then(result => {
            console.log(result)
            if (result) {
                res.status(200).json({
                    product: result,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_PRODUCTS',
                        url: 'http://localhost:3000/products/'
                    }
                })
            } else {
                res.status(404).json({
                    message: 'Product with such ID doesn\'t exist'
                })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})

//updating Product using productID[it couldn't add attributes to schema]
router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;
    //we can do simply like this
    // $set : { name : req.body.newName , price : req.body.newPrice} it is mongoose keyword
    //but what if we do not update price or name,so this is generic approach
    const updateOps = {}
    //here we have to make array for body in postman because object(req.body) is not iterable
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'Updated Succesfully',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

//deleting Product using productID
router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID
    Product.findByIdAndDelete(id)
        .exec()
        .then(result => {
            console.log(result)
            if (result) {
                console.log('Succesfully deleted')
                res.status(200).json(result)
            } else {
                res.status(404).json({
                    message: 'Product with such ID doesn\'t exist'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router