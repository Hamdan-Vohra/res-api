const express = require('express')
const orderControllers = require('../controllers/orders')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

//we use next function because it is running on middleware
//Handling GET request to /orders
router.get('/', checkAuth, orderControllers.get_all_orders);
//Handling POST request to /orders
router.post('/', checkAuth, orderControllers.create_order);
//Handling GET request to /orders/:orderId
router.get('/:orderID', checkAuth, orderControllers.get_order);
//Handling DELETE request to /orders/:orderId
router.delete('/:orderID', checkAuth, orderControllers.delete_order);

module.exports = router