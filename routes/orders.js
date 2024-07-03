const express = require('express')
const mongoose = require('mongoose')
const Order = require('../models/orders')
const product = require('../models/product')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

//we use next function because it is running on middleware
//Handlin GET request to /orders
router.get('/', checkAuth, (req, res, next) => {
    Order.find().select('product quantity')
        .populate('product', 'name')
        .exec()//used to change it into a full promise
        .then(result => {
            const response = {
                count: result.length,
                orders: result.map(order => {
                    return {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: 'http:localhost:3000/orders/' + order._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(error => { res.status(500).json({ err: error }) })
})
//Handling POST request to /orders
router.post('/', checkAuth, (req, res, next) => {

    product.findById(req.body.productId)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product Not Found'
                })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });

            return order.save();//returning a promise    
        })
        .then((result) => {
            // console.log(result)
            res.status(201).json({
                message: 'Order is placed',
                orderPlaced: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:orderID', checkAuth, (req, res, next) => {
    const id = req.params.orderID;
    Order.findById(id).select('product quantity _id')
        .populate('product', 'name price')
        .exec()
        .then(result => {
            if (!result) {
                return res.status(404).json({
                    message: 'Order Not Found',
                    request: {
                        type: 'GET_ALL_ORDERS',
                        url: 'http://localhost:3000/orders/'
                    }
                })
            }
            res.status(200).json({
                message: `Handling GET request for order having ${req.params.orderID}`,
                order: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET_ALL_ORDERS',
                    url: 'http://localhost:3000/orders/'
                }
            })
        })
        .catch(err => { res.status(500).json({ error: err }) })

})

router.delete('/:orderID', checkAuth, (req, res, next) => {
    Order.findByIdAndDelete(req.params.orderID)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Cancelled Successfully',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'ID', quantity: 'Number' }
                }

            })
        })
        .catch(err => { res.status.json({ error: err }) })
})

module.exports = router