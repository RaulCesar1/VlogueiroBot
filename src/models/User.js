const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: {
        type: String,
        required: true,
    },
    trustFactor: {
        type: Number,
        required: true,
        default: 100,
    },
    reports: Array
})

module.exports = model('User', User);