const multer = require('multer')

module.exports = (app) => {
    const music = require("../controller/music.controller");
    const category = require("../controller/category.controller");
    const favorite = require("../controller/favorite.controller");
    const playlist = require("../controller/playlist.controller");
    const Users = require("../controller/users.controller");
  
    const storage = multer.memoryStorage({
        destination: function (req, file, cb) {
            cb(null, '')
        }
    })
    const upload = multer({ storage: storage });

    //users
    app.post('/user/login', Users.login);
    app.post('/user/register',Users.register);
    app.get('/user/generateHash', Users.generateHash);
    app.get('/user/verifytoken', Users.verifyToken);
    app.get('/user/refreshtoken', Users.refreshToken);
    app.get('/user/decodetoken', Users.decodetoken);

    //music
    app.get('/music/getlist', music.getallsongs);
    app.post('/music/add',upload.single('url'), music.addmusic);
    app.post('/music/searchsong', music.getSearchedSong)
    app.patch('/music/:songId', music.patchSongDetails)
    app.delete('/music/:songId', music.deleteSong)
    app.post('/music/artist', music.getsongsbyartist)
    app.post('/music/category', music.getsongsbyCategory)
  
    //category
    app.get("/category/getlist", category.getCategory);
    app.post("/category/add", category.addCategory);
  
    //favorite
    app.get("/favorite/getlist",Users.verifyUserToken, favorite.getallfavoriteSongsByUserID);
    app.post("/favorite/add", favorite.addFavoriteSong);
  
    //playlist
    app.get("/playlist/getlist/:id", playlist.getPlaylistsByUserId);
    app.post("/playlist/create", playlist.createPlaylist);
  };