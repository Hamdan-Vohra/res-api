const express = require('express')

const router = express.Router()

//we use next function because it is running on middleware
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request for orders'
    })
})
router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Handling POST request for orders'
    })
})
router.get('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: `Handling GET request for order having ${req.params.orderID}`
    })
})

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: `Handling DELETE request for order having ${req.params.orderID}`
    })
})

module.exports = router