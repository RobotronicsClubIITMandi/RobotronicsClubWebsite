var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var inventorySchema = new Schema(
    {
        name: {type: String, required: true, max: 100},
        available: {type: Number, required: true, min: 0},
    }
);

module.exports = mongoose.model('inventory',inventorySchema);