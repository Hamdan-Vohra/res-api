const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        console.log('Decoded Token:', decoded)
        req.userData = decoded
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({
            message: 'Auth Failed'
        })
    }
}
module.exports = checkAuth