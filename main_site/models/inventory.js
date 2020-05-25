var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var inventorySchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        total: {type: Number, required:true, min: 0},
        available: {type: Number, required: true, min: 0},
        price: {type: Number},
    }
);

module.exports = mongoose.model('inventory',inventorySchema,'components');