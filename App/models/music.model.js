

const mongoose = require('mongoose')
const SongsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    musictype: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    coverimage: {
        type: String,
        required: true,
    },
    Key: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('musics', SongsSchema)

