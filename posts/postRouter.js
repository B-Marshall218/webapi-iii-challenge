const express = require('express');

const postDB = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
    postDB.get()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({
                error: "The posts information could not be retrieved"
            });
        })
});

router.get('/:id', (req, res) => {
    const id = req.params.id
    postDB.getById(id)
        .then(post => {
            res.status(202).json(post)
        })
        .catch(err => {
            res.status(500).json({
                error: "The posts information could not be retrieved"
            });
        })
});


router.delete('/:id', validatePostId, (req, res) => {
    const id = req.params.id
    postDB.remove(id)
        .then(deleteId => {
            res.status(204).end()
        })
        .catch(err => {
            res.status(500).json({
                error: "The post could not be removed",
                err
            })
        })
});

router.put('/:id', (req, res) => {

});

// custom middleware

function validatePostId(req, res, next) {
    const { id } = req.params  //.id as well? 
    postDB.getById(id)
        .then(post => {
            if (post) {
                req.post = post;
                next();
            } else {
                res.status(400).json({
                    message: `invalid user ${id}`
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving id ", err
            })
        })

};

module.exports = router;