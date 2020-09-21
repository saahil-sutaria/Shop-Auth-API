const Product = require('../routes/models/productSchema')
const mongoose = require('mongoose')

exports.products_get_all = (req, res, next)=>{
    Product.find().select('_id name price productImage')
    .exec()
    .then(docs =>{
        res.status(200).json({
            count : docs.length,
            products : docs.map(doc =>{
                return {
                    ...doc._doc,
                    request : {
                        type: 'GET',
                        endpoint: 'GET/products/:productID',
                        url : 'http://localhost:5000/products/'+doc._id
                    }
                }
            }),
                
            })
    })
    .catch(err => {
        res.status(404).json({
            error : 'this is an error message '+ err
        })
    })     
}

exports.product_create = (req, res, next)=>{
    const {
        name, 
        price
    } = req.body
    const product = new Product({_id: mongoose.Types.ObjectId(), name, price})
    product
    .save()
    .then(result =>{
        res.status(200).json({
            message: 'Created Product Successfully',
            request: {
                type : 'GET',
                url : 'http://localhost:5000/products/' + result._id,
            }
            
        })
    })
    .catch(error => {  
        res.status(500).json({
            error: 'There is an error ' + error
        })
    })
    
}

exports.product_get_by_id = (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id).select('_id name price productImage')
    .exec()
    .then(doc => {
        res.status(200).json({
            name : doc.name, 
            price : doc.price,
            _id : doc._id,
            request:{
                type: 'GET',
                endpoint :'GET/products/',
                url: 'http://localhost:5000/products/'
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            error: 'Cannot fetch product' + error,
        })
    })
}

exports.product_update = (req, res, next)=>{
    /* 
    [{
        "productName": "name",
        "value" : "Sahil"
    },
    ]
    const id = req.params.productId;
    const updateOps = {}
    console.log(req.body)
    for (const op in req.body){
        console.log(req.body[op].propName)
        updateOps[req.body[op].propName] = req.body[op].value;
    } */
    Product.findByIdAndUpdate({_id: req.param.id}, /* {$set:  updateOps  } */req.body)
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Updated product',
            request: {
                type: 'GET',
                url: 'http://localhost:5000/products',
                product_url : 'http://localhost:5000/products/'+ req.params.productId, 
            }
        })
    })
    .catch(err =>{
        res.status(404).json({
            error : 'Cannot patch data' + err
        })
    })
}

exports.product_delete =  (req, res, next)=>{
    const id = req.params.productId
    Product.deleteOne({_id: id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Product with id '+ id + ' is deleted',
            result: result, 
            request:{
                type: 'GET',
                url : 'http://localhost:5000/products'
            } 
        })
    })
    .catch(err => {
        res.status(404).json({
            error : 'Error while deleting ' + err,
        })
    })
}