const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const env = require('./nodemon.json');

mongoose.Promise = global.Promise;

mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.coka8.mongodb.net/node-shop-api?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true  })

const app = express();

const productRoutes = require ('./api/routes/Products');
const ordersRoutes = require ('./api/routes/orders');
const userRoutes = require('./api/routes/user');


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: true})) // false because simple body
app.use(bodyParser.json()); //extract json data and make it readable 


// CORS error handling - appends to res header - funnel all the requests  
app.use(cors());

app.get('/',(req, res, next)=>{
    res.status(200).json({
        message: 'This is the main page',
    })
})
//middleware that forwards/routes req to products and orders
app.use('/products', productRoutes); 
app.use('/orders',ordersRoutes);
app.use('/users', userRoutes);



//to catch errors if does not enter above mentioned routes 
app.use((res, req, next)=>{
    const error = new Error('Path not found!'); //custom message
    error.status = 404;
    next(error);       // forward this error req 
})

//all the errors are handled here including databse error 
app.use((error, req, res, next)=>{   
    
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message,
        }
    });
    next(); // calls next app.use
})
app.use(()=>{console.log()})
module.exports = app;
