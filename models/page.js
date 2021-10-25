const mongoose = require('mongoose')

const PageSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number
    }
})

const Page = module.exports = mongoose.model('Page', PageSchema)