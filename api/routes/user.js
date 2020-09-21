const mongoose = require('mongoose');
const bycrypt = require('bcrypt')
const express = require('express')
const User = require('./models/userSchema');
const jwt = require('jsonwebtoken')

const router = express.Router();

router.post('/signup', (req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then(result =>{
        if (result.length >= 1){
            return res.status(409).json({
                message : 'Email already exists '  
            })
        }
        else{
            bycrypt.hash(req.body.password, 10, (error, hash)=>{
                if (error)
                {
                    res.status(404).json({
                        error : 'This is password error ' + error
                    })
                }
                else
                {
                    const user = new User({
                        _id:mongoose.Types.ObjectId(),
                        email : req.body.email,
                        password : hash
                    })
                    user.save()
                    .then(result => {
                        console.log(result)
                        res.status(200).json({
                            message: 'The password is hashed and saved'
                        })
                    })
                    .catch(error =>{
                        res.status(404).json({
                            message : 'Signin Error ' + error 
                        })
                    })
                }
            })
        }
    })
 
    

})

router.delete('/:userId', (req,res, next)=>{
    User.deleteOne({_id: req.params.userId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Deleted user with id ' 
        })
    })
    .catch(error => {
        res.status(404).json({
            error : error 
        })
    })
})

router.post('/login', (req, res, next)=>{
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1)
        {
            res.status(401).json({
                message: 'Auth Failed'
            })
        }
        else
        {
            bycrypt.compare(req.body.password, user.password, (err, result)=>{
                if(result){
                    const token = jwt.sign(
                        {email: user.email, _id: user._id},
                        "secret",
                        {
                            expiresIn: "1hr"
                        }
                    )
                
                    res.status(200).json({
                        message: 'Login Successfull', 
                        token : token
                    })
                }
                else{
                    res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
            })
        }
    })
    .catch(error => {
        res.status(404).json({
            message : 'Check login id password',
            error : error
        })
    })
})



module.exports = router;