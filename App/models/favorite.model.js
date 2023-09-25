const mongoose = require('mongoose');

const favorite = mongoose.Schema({
    userid: {
        type: String,
        required: true,
    },
    songid: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("favorite", favorite);