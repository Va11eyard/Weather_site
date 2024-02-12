const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    }
});

const Translation = mongoose.model('Translation', translationSchema);

module.exports = Translation;
