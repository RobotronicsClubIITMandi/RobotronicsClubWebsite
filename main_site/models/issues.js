var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var issuesSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        email: {type: String, required: true},
        date_of_issue: {type: Date, required: true},
        items: {
            type: Map,
            of: String,
            default: {}
        }
    }
);

// used Map datatype from
// https://stackoverflow.com/questions/36367655/saving-hashmap-to-mongoose

module.exports = mongoose.model('issues', issuesSchema, 'issues');
