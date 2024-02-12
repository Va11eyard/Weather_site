const mongoose = require('mongoose');

const numberSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    fact: {
        type: String,
        required: true
    }
});

const NumberModel = mongoose.model('Number', numberSchema);

module.exports = NumberModel;
