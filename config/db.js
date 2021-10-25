const mongoose = require("mongoose");

const connectDB = () => {
    mongoose.connect("mongodb://localhost:27017/cmscart").then(() => {
        console.log("Connect to DB successfully!");
    }).catch(err => console.log("can not connect toDB"));
}

module.exports = connectDB