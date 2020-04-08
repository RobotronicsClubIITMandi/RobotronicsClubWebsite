var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var newsSchema = new Schema(
    {
        title: {type: String, required: true, max:100},
        content: {type: String, required: true, max:1000},
        date_created: {type: Date, required: true},
    }
);

module.exports = mongoose.model('news',newsSchema,'news');