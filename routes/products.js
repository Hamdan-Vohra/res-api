const express = require('express')

const router = express.Router()

//we use next function because it is running on middleware
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request'
    })
})
router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message: 'Handling POST request',
        createdProduct: product
    })
})
router.get('/:productID', (req, res, next) => {
    res.status(200).json({
        message: `Handling GET request for ${req.params.productID}`
    })
})
router.patch('/:productID', (req, res, next) => {
    res.status(200).json({
        message: `Handling PATCH request for ${req.params.productID}`
    })
})
router.delete('/:productID', (req, res, next) => {
    res.status(200).json({
        message: `Handling DELETE request for ${req.params.productID}`
    })
})

module.exports = router