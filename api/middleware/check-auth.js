 const jwt = require('jsonwebtoken')
const { models } = require('mongoose')

const checkAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ");
        const decode = jwt.verify(token[1], "secret")
        req.userData = decode;
        
        next();
    }
    catch{
        res.status(409).json({
            message : 'Auth Failed!!'
        })
    }

}
module.exports = checkAuth