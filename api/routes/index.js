const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product')

router.get('/', function(req, res) {
  Product.find()
  .select('name price _id')
  .exec()
  .then(docs => {
    const data = {
      count: docs.length,
      products: docs.map( doc => {
        return {
          name: doc.name,
          price: doc.price,
          id: doc._id
        }
      })
    }
    res.render('index', {title: "List of Products", data: data});
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
});

module.exports = router;
