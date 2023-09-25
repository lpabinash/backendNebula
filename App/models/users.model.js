const mongoose = require('mongoose');

const users = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
    },
    isadmin: {
        type: Boolean,
        enum: [true,false],
        default:false
    }
},{ timestamps: true });

module.exports = mongoose.model("users", users);