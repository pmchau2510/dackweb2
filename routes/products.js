const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const Category = require('../models/category')
const fs = require('fs-extra')
const auth = require('../config/auth')
const isUser = auth.isUser

//GET all products
// router.get('/', isUser, (req, res) => {
router.get('/', (req, res) => {
    Product.find((err, products) => {
        if (err) console.log(err)
        res.render('all_products', {
            title: 'All products',
            products: products
        })
    })
})


//GET products by category
router.get('/:category', (req, res) => {

    var categorySlug = req.params.category
    Category.findOne({ slug: categorySlug }, (err, c) => {
        Product.find({ category: categorySlug }, (err, products) => {
            if (err) console.log(err)
            res.render('cat_products', {
                title: c.title,
                products: products
            })
        })
    })

})

//GET products detalis 
router.get('/:category/:product', (req, res) => {
    var galleryImages = null
    var loggedIn = (req.isAuthenticated()) ? true : false
    Product.findOne({ slug: req.params.product }, (err, product) => {
        if (err) console.log(err)
        else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery'
            fs.readdir(galleryDir, (err, files) => {
                if (err) console.log(err)
                else {
                    galleryImages = files

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                    })
                }
            })
        }
    })

})

//Express
module.exports = router