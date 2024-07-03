const express = require('express')
const productControllers = require('../controllers/products')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

//acessing router of an express app
const router = express.Router()

//initializing multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(error,functionality)
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        //reject a file and throws an error
        cb(new Error({ message: 'Not meeting with image format' }), false)
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter
})

//we use next function because it is running on middleware

//Handling GET request to /products
router.get('/', productControllers.get_all_products);
//Handling POST request to /products
router.post('/', checkAuth, upload.single('productImage'), productControllers.create_product)
//Handling GET request to /products/:productID
router.get('/:productID', checkAuth, productControllers.get_product);
//Handling PATCH request to /products/:productID
router.patch('/:productID', checkAuth, productControllers.update_product);
//Handling DELETE request to /products/:productID
router.delete('/:productID', productControllers.delete_product);

module.exports = router