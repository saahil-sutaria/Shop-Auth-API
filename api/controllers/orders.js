const Order = require('../routes/models/ordersSchema')
const Product = require('../routes/models/productSchema')
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next)=>{
    Order.find()
    .select('quantity _id product')
    .populate('product', 'name')
    .exec()
    .then(result =>{
        res.status(200).json({
            count : result.length,
            orders : result.map(doc => {
                return {
                    ...doc._doc,
                    request: {
                        type: 'GET',
                        product_url : 'http://localhost:5000/products/' + doc.product._id
                    }
                }
            }),
            
        })
    })
    .catch(error => {
        res.status(404).json({
            error : 'Cannot fetch orders ' + error
        })
    })    
}

exports.order_create = (req, res, next)=>{
    const order = new Order({
        _id : mongoose.Types.ObjectId(),
        quantity : req.body.quantity,
        product : req.body.productId,
    })
    Product.findById(req.body.productId)
    .then(product => {
        console.log(product)
        if (!product){
            res.status(404).json({
                message : 'Product not found'
            })
        }
        return order.save()
    })
    .then(result => {
        res.status(200).json({
            message : 'Order successfully added',
            Order: {
                quantity : result.quantity,
                prouduct : result.product,
                _id : result._id
            }
        })
    })
    .catch(error => {
        res.status(404).json({
            error : 'Product not found '+ error
        })
    }) 
}

exports.order_by_id = (req, res, next)=>{
    const id = req.params.orderId
    Order.findById(id).select('_id product quantity')
    .populate('product')
    .exec()
    .then(result =>{
        res.status(200).json({
            Order: result,
            request: {
                type: 'GET',
                url : 'http://localhost:5000/orders' + result._id,
            }
        })
    })
    .catch(err => {
        res.status(404).json({
            error : 'Cannot fetch order ' + err,
        })
    })
    
}

exports.order_delete = (req, res, next)=>{
    const id = req.params.orderId;
    Order.deleteOne({_id :id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request:{
                type: 'GET',
                url : 'http://localhost:5000/orders'
            }
        })
    })
    .catch()
}