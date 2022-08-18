const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: {
        type: String,
        required: true,
    },
    reports: {
        type: Number,
        required: true,
        default: 0,
    },
})

module.exports = model('User', User);