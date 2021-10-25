const express = require('express')
const path = require('path')
const connectDB = require('./config/db')
const expressValidator = require('express-validator')
const bodyParser = require('body-parser')
const session = require('express-session')
const fileUpload = require('express-fileupload')
var passport = require('passport')
//Set routes
const pages = require('./routes/pages.js')
const products = require('./routes/products.js')
const cart = require('./routes/cart.js')
const users = require('./routes/users.js')
const adminPages = require('./routes/admin_pages.js')
const adminCategories = require('./routes/admin_categories.js')
const adminProducts = require('./routes/admin_products.js')
//Init app
connectDB();

const app = express()

//View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//Set public folder
app.use(express.static(path.join(__dirname, 'public')))

//Set global errors variable
app.locals.errors = null
//GET Page Model
const Page = require('./models/page')
//Get all pages to pass to header.js
Page.find({}).sort({ sorting: 1 }).exec((err, pages) => {
   if (err) console.log(err)
   else {
      app.locals.pages = pages
   }
})

//GET Category Model
const Category = require('./models/category')
//Get all categories to pass to header.js
Category.find((err, categories) => {
   if (err) console.log(err)
   else {
      app.locals.categories = categories
   }
})
//Express fileUpload middleware
app.use(fileUpload())
//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Express session middleware
app.use(session({
   secret: 'keyboard cat',
   resave: true,
   saveUninitialized: true,
   // cookie: { secure: true }
}))

//Express Validator middleware
app.use(expressValidator({
   errorFormatter: function (param, msg, value) {
      var namespace = param.split('.')
         , root = namespace.shift()
         , formParam = root;

      while (namespace.length) {
         formParam += '[' + namespace.shift() + ']';
      }
      return {
         param: formParam,
         msg: msg,
         value: value
      };
   },
   customValidators: {
      isImage: (value, filename) => {
         var extension = (path.extname(filename)).toLowerCase()
         switch (extension) {
            case '.jpg':
               return '.jpg'
            case '.jpeg':
               return '.jpeg'
            case '.png':
               return '.png'
            case '':
               return '.jpg'
            default:
               return false
         }
      }
   }
}))

//Express messages middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
   res.locals.messages = require('express-messages')(req, res);
   next();
});

//Passport config
require('./config/passport')(passport)
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.get('*', (req, res, next) => {
   res.locals.cart = req.session.cart
   res.locals.user = req.user || null
   next()
})

//Set routes
app.use('/admin/pages', adminPages)
app.use('/admin/categories', adminCategories)
app.use('/admin/products', adminProducts)
app.use('/products', products)
app.use('/cart', cart)
app.use('/users', users)
app.use('/', pages)

//Start the server
const port = 3000;
app.listen(port, () => {
   console.log('Server is runnig on port ' + port)
})
