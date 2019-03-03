const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const viewRoutes = require('./api/routes/index');
const userRoutes = require('./api/routes/user');


mongoose.connect('mongodb://localhost/node-shop',{useNewUrlParser: true});

app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine','handlebars')

app.use(morgan('dev'));
app.use('uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-WIth, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

//Routes which should handle requests
app.use('/',viewRoutes)
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user/', userRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message : error.message
    }
  });
})

module.exports = app;
