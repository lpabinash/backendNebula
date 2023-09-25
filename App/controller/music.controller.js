const Song = require('../models/music.model')
const Aws = require('aws-sdk')

const s3 = new Aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
})

exports.addmusic = async (req, res) => {

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.file?.originalname,
        Body: req.file.buffer,
        ACL: "public-read-write",
        ContentType: req.file.mimetype

    };
    console.log(params)
    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send({ "err": error })
            return;
        }
        console.log(data)
        const song = new Song({

            title: req.body.title,
            url: data?.Location,
            duration: req.body.duration,
            artist: req.body.artist,
            musictype: req.body.musictype,
            language: req.body.language,
            coverimage: req.body.coverimage,
            Key:req.file?.originalname
        });
        song.save()
            .then(result => {
                res.status(200).send({
                    title: req.body.title,
                    url: data?.Location,
                    duration: req.body.duration,
                    artist: req.body.artist,
                    musictype: req.body.musictype,
                    language: req.body.language,
                    coverimage: req.body.coverimage,
                    Key:req.file?.originalname
                    // request: {
                    //     type: 'GET',
                    //      url: 'http://localhost:3000/products/' + result._id,
                    // }
                })
            })
            .catch(err => {
                res.send({ message: err })
            })
    })

}

exports.getallsongs = async (req, res) => {
    try {
        const songs = await Song.find()
        res.send(songs)
    } catch (err) {
        res.send({ message: err, m: "not working" })
    }
}

exports.getsongsbyartist = async (req, res) => {
    const artist=req.body.artist
    try {
        const songs = await Song.find({  "artist": new RegExp(artist,'i') })
        res.send(songs)
    } catch (err) {
        res.send({ message: err, m: "not working" })
    }
}


exports.getSearchedSong = (req, res) => {
    const search = req.body.title;
    Song.find({  "title": new RegExp(search,'i') })
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.send({ message: err })
        })

}

exports.getsongsbyCategory = (req, res) => {
    const category = req.body.musictype;
    Song.find({ "musictype":category })
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.send({ message: err })
        })

}

exports.patchSongDetails = (req, res) => {
    const id = req.params.songId;
    const update = {}
    for (const ops of req.body) {
        update[ops.propName] = ops.value;
    }
    Song.update({ _id: id }, { $set: update })
        .exec()
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.send(err)
        })
}

exports.deleteSong = (req, res) => {
    const _id = req.params.songId;
    console.log(req.body)
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.body.Key
    };
    
    s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack); 
        else     console.log('Delete Success', data);           
    });
    Song.deleteOne({ _id })
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            res.send(err)
        })

}


