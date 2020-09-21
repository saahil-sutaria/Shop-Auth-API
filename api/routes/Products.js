const express = require('express');
const router = express.Router();   // '/product'
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')
const ProductController = require('../controllers/products')

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads/');
    },
    filename : function(req, file, cb){
        cb(null, new Date().toISOString()+file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(new Error('this is not the proper file'), false )
    }
}

const upload = multer({
    storage : storage, 
    limits: { fileSize : 1024 * 1024 * 5 },
    fileFilter: fileFilter 
});

const Product = require('./models/productSchema');

router.get('/', ProductController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'),ProductController.product_create);

router.get('/:productId', ProductController.product_get_by_id );

router.patch('/:productId', ProductController.product_update);

router.delete('/:productId', checkAuth, ProductController.product_delete);


module.exports = router;