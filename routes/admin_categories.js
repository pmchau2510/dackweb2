const express = require('express')
const router = express.Router()
const Category = require('../models/category')
const auth = require('../config/auth')
const isAdmin = auth.isAdmin

// Get category index
router.get('/', isAdmin, (req, res) => {
    Category.find((err, categories) => {
        if (err) return console.log(err)
        res.render('admin/categories', {
            categories: categories
        })
    })

})

// Get add category
router.get('/add-category', isAdmin, (req, res) => {
    var title = ""

    res.render('admin/add_category', {
        title: title
    })
})

// POST add category
router.post('/add-category', (req, res) => {
    req.checkBody('title', 'Title must have a value.').notEmpty()
    var title = req.body.title
    var slug = title.replace(/\s+/g, '-').toLowerCase()

    var errors = req.validationErrors()
    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title,
        })
    } else {
        Category.findOne({ slug: slug }, (err, category) => {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.')
                res.render('admin/add_category', {
                    title: title,
                })
            } else {
                var category = new Category({
                    title: title,
                    slug: slug,
                })
                category.save((err) => {
                    if (err) return console.log(err)
                    Category.find((err, categories) => {
                        if (err) console.log(err)
                        else {
                            req.app.locals.categories = categories
                        }
                    })
                    req.flash('success', 'Category added')
                    res.redirect('/admin/categories')
                })
            }
        })
    }
})




// Get edit category
router.get('/edit-category/:id', isAdmin, (req, res) => {

    Category.findById(req.params.id, (err, category) => {
        if (err) return console.log(err)
        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        })
    })


})


// POST edit category
router.post('/edit-category/:id', (req, res) => {
    req.checkBody('title', 'Title must have a value.').notEmpty()
    var title = req.body.title
    var slug = title.replace(/\s+/g, '-').toLowerCase()
    var id = req.params.id

    var errors = req.validationErrors()
    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        })
    } else {
        Category.findOne({ slug: slug, _id: { '$ne': id } }, (err, category) => {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.')
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                })
            } else {
                Category.findById(id, (err, category) => {
                    if (err) return console.log(err)
                    category.title = title
                    category.slug = slug
                    category.save((err) => {
                        if (err) return console.log(err)
                        Category.find((err, categories) => {
                            if (err) console.log(err)
                            else {
                                req.app.locals.categories = categories
                            }
                        })
                        req.flash('success', 'Category edited')
                        res.redirect('/admin/categories/edit-category/' + id)
                    })
                })

            }
        })
    }
})

// Get delete category
router.get('/delete-category/:id', isAdmin, (req, res) => {
    Category.findByIdAndRemove(req.params.id, (err) => {
        if (err) return console.log(err)
        Category.find((err, categories) => {
            if (err) console.log(err)
            else {
                req.app.locals.categories = categories
            }
        })
        req.flash('success', 'Category deleted!')
        res.redirect('/admin/categories/')
    })
})
//Express
module.exports = router