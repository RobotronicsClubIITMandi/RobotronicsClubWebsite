var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var projectSchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        mentor: {type: String, max: 100},
        team: {type: String, required: true, max:400},
        description: {type: String, max: 1000},
        date_of_creation: {type: Date, required: true}
    }
);

module.exports = mongoose.model('projects',projectSchema,'projects');