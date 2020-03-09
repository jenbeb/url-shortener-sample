const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Create Url Schema
const UrlsSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    urlCode: {
        type: String
    },
    
    hits: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})
module.exports = Urls = mongoose.model('Urls', UrlsSchema)