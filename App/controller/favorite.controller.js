const Favorite = require("../models/favorite.model");
const dotenv = require("dotenv");
const { decodeToken2 } = require("./users.controller");

dotenv.config();

exports.getallfavoriteSongsByUserID = (req, res) => {
  const decodetokenvalue=res.locals.decodedtoken;
  const userid = decodetokenvalue.userid;
  Favorite.find({ userid })
    .then((music) => {
      res.send(music);
    })
    .catch((err) => {
      res.status(500).send({ msg: "Error occured while fetching record " });
    });
};

exports.addFavoriteSong = (req, res) => {
  const favorite = new Favorite({
    userid: req.body.userid,
    songid: req.body.songid,
  });

  favorite
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
