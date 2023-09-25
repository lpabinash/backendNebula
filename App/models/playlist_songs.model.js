const mongoose = require("mongoose");

const playlistSongsSchema = mongoose.Schema({
  playlistid: {
    type: String,
    required: true,
  },
  songid: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("playlistsongs", playlistSongsSchema);
