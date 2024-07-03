const express = require('express')
const userControllers = require('../controllers/user')

const router = express.Router()

//Handling POST request to /users/signup
router.post('/signup', userControllers.user_signup);
//Handling POST request to /users/login
router.post('/login', userControllers.user_login)
//Handling DELETE request to /users/:userId
router.delete('/:userId', userControllers.delete_user);

module.exports = router