const Users = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const tokenExpire_In = "30m"; // eg. "10s", "2m", "1h", "20d"

dotenv.config();

exports.login = (req, res) => {
    const { username, password } = req.body;
    Users.findOne({ username }).then(
        User => {
            if (User === null) {
                res.status(500).json({
                    error: "invalid username"
                });
            } else {
                bcrypt.compare(password, User.password, (_err, result) => {
                    if (_err || !result) {
                        res.status(401).json({ error: "Authentication failed!" });
                    }
                    else {
                        const data = {
                            "userid": User._id,
                            "username": User.username,
                            "createdon": Date.parse(User.createdAt) / 1000,
                            "isadmin": User.isadmin
                        };

                        const secretkey = process.env.JWT_SECRECT_KEY;
                        const token = jwt.sign(data, secretkey, { expiresIn: tokenExpire_In });
                        res.status(200).json({
                            "username": User.username,
                            message: "Authentication has been successful",
                            token: token,
                            expiresAt: getTimestampFromString(tokenExpire_In),
                            data,
                        });
                    }

                });
            }
        }
    ).catch(err => {
        res.status(500).send({ msg: "Error occured while fetching record " });
    });
}

exports.register = (req, res) => {

    const { username, password } = req.body;
    Users.findOne({ username })
        .then((user) => {
            if (user)
                res.status(500).json({
                    error: "Email-Id already exist"
                });

            else {
                bcrypt.hash(password, 10, (error, hash) => {
                    if (error) {
                        res.status(500).json({ msg: error })
                    }
                    else {
                        const user = new Users({
                            username: req.body.username,
                            password: hash,
                            isadmin: req.body.isadmin
                        });
                        user.save().then(data => {
                            res.send(data);
                        }).catch(err => {
                            res.status(500).send({ msg: "Error occured while registering user " });
                        });
                    }
                }
                )
            }
        });
}
exports.generateHash = (req, res) => {
    if (req.body.password) {
        bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error) res.status(500).json({ error });
            else {
                req.body.password = hash;
                res.send(hash);
            }
        })
    }
    else {
        if (req.body.password === "") {
            res.status(500).json({ error: "password can not be left blank" });
            return;
        }
        next();
    }
}

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const verified = jwt.verify(token, process.env.JWT_SECRECT_KEY);
        if (verified) {
            res.send({ message: "Token Verified", code: "0" });
            // next();
        } else {
            return res.status(401).send({ message: "Token Expired", code: "1" });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Authentication has failed!", code: "2" });
    }
}

exports.refreshToken = (req, res) => {
    try {
        const token = req.headers.authorization;
        const verified = jwt.verify(token, process.env.JWT_SECRECT_KEY);
        if (verified) {
            const decoded_data = jwt.decode(token, process.env.JWT_SECRECT_KEY);
            const data = {
                "userid": decoded_data.userid,
                "username": decoded_data.username,
                "createdon": decoded_data.createdon,
                "isadmin": decoded_data.isadmin
            };
            const newtoken = jwt.sign(data, process.env.JWT_SECRECT_KEY, { expiresIn: tokenExpire_In });
            res.status(200).json({
                "username": decoded_data.username,
                message: "Authentication has been successful",
                token: newtoken,
                expiresAt: getTimestampFromString(tokenExpire_In),
                data,
            });
            res.send({ data, decoded_data });
        } else {
            return res.status(401).send({ message: "Token Expired", code: "1" });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Authentication has failed!", code: "2" });
    }
}

exports.decodetoken = (req, res) => {
    try {
        const token = req.headers.authorization;
        const decode_token = jwt.decode(token, process.env.JWT_SECRECT_KEY);
        if (decode_token) {
            res.send({ message: "Token Verified", decode_token });
        } else {
            return res.status(401).send({ message: "Invalid token value", code: "1" });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token value", code: "2" });
    }
}
exports.verifyUserToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const verified = jwt.verify(token, process.env.JWT_SECRECT_KEY);

        if (verified) {

            const decode_token = jwt.decode(token, process.env.JWT_SECRECT_KEY);
            if (decode_token) {
                res.locals.decodedtoken=decode_token;
                next();
            } else {
                return res.status(401).send({ message: "Invalid token value", code: "1" });
            }
        }
        else {
            return res.status(401).send({ message: "Invalid token", code: "1" });
        }
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token value", code: "2" });
    }
}

function getTimestampFromString(string) {
    string = string.toLowerCase();
    const match = string.match(/(\d+)([smhd])$/);
    if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        switch (unit) {
            case 's':
                return Math.floor(Date.now() / 1000) + (value);
            case 'm':
                return Math.floor(Date.now() / 1000) + (value * 60);
            case 'h':
                return Math.floor(Date.now() / 1000) + (value * 3600);
            case 'd':
                return Math.floor(Date.now() / 1000) + (value * 86400);
            default:
                return Math.floor(Date.now() / 1000) + (20 * 60); // 20min
        }
    } else {
        return Math.floor(Date.now() / 1000) + (20 * 60); // 20min
    }
}