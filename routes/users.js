const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const product = require('../models/product')

const router = express.Router()

//signup
router.post('/signup', (req, res, next) => {
    //handling user with same emailaddress
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length > 0) {
                res.status(409).json({
                    message: 'Email address exist'
                })
            } else {
                //creating user
                bcrypt.hash(req.body.password, 10, (err, hashedPass) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });

                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hashedPass
                        });
                        user.save()
                            .then(result => {
                                console.log(result)
                                res.status(201).json({
                                    message: 'User Signup SUccessfullly'
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
});

//login
router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, flag) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
                if (flag) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"//for one hour
                        });
                    return res.status(200).json({
                        message: 'Auth Succesfull',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth Failed'
                })
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:userId', (req, res, next) => {
    User.findByIdAndDelete(req.params.userId)
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User Deleted'
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });

})


module.exports = router