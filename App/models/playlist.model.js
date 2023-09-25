const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  coverimage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("playlist", playlistSchema);
