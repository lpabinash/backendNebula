const Playlist = require('../models/playlist.model');
const PlaylistSongs = require('../models/playlist_songs.model');

exports.getPlaylistsByUserId = (req, res) => {
  const userid = req.params.id;
  Playlist.find({ userid })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        errorCode: "500",
        errorDetails: "Playlist not found",
      });
    });
};

exports.getPlaylistSongs = (req, res) => {
  const playlistid = req.params.id;
  PlaylistSongs.find({ playlistid })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        errorCode: "500",
        errorDetails: "Playlist is empty",
      });
    });
};

exports.setPlaylistSongs = (req, res) => {
  const playlist = new Playlist({
    userid: req.body.userid,
    name: req.body.name,
    coverimage: req.body.coverimage,
  });

  playlist
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ msg: err + "Error occured while creating record " });
    });
};

exports.createPlaylist = (req, res) => {
  const category = new Playlist({
    userid: req.body.userid,
    name: req.body.name,
    coverimage: req.body.coverimage,
  });

  category
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ msg: err + "Error occured while creating record " });
    });
};
