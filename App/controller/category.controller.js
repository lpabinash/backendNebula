const Category = require('../models/category.model');

exports.getCategory = (req, res) => {
    Category.find().then(
        category => {
            res.send(category)
        }
    ).catch(err => {
        res.status(500).send({ msg: "Error occured while fetching record " });
    });
}

exports.addCategory= (req, res) => {

    const category = new Category({
        name: req.body.name
    })

    category.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({ msg: err+"Error occured while creating record " });
    });
}