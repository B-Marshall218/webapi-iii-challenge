const express = require('express');
const userDB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const user = req.body;

    userDB.insert(user)
        .then(addUser => {
            res.status(201).json(addUser)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error creating new post", err
            })
        })

});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const newPost = req.body;
    newPost.user_id = req.params.id
    console.log(newPost)
    postDB.insert(newPost)
        .then(post => {
            res.status(201).json(post)
        })


        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Error creating new post", err
            })
        })

});

router.get('/', validateUser, (req, res) => {
    userDB.get()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error getting data ", err
            })
        })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)

});

router.get('/:id/posts', validateUserId, (req, res) => {
    postDB.getUserPosts(req.params.id)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error getting data ", err
            })
        })
});


router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    userDB.remove(id)
        .then(() => {
            res.status(204).json({
                message: "user deleted successfully"
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Error deleting user ", err
            })
        })

});

router.put('/:id', validateUserId, (req, res) => {
    const updateUser = req.body
    const id = req.params.id
    userDB.update(id, updateUser)
        .then(update => {
            userDB.getById(id)
                .then(user => {
                    res.status(200).json(user)
                })

                .catch(err => {
                    res.status(500).json({
                        message: "Error updating ", err
                    })
                })

        })

        .catch(err => {
            res.status(500).json({
                message: "Error updating ", err
            })
        })


});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params  //.id as well? 
    userDB.getById(id)
        .then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(400).json({
                    message: "invalid user id"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving id ", err
            })
        })

};

function validateUser(req, res, next) {
    const newUser = req.body
    if (!newUser) {
        res.status(400).json({
            message: "missing user data"
        })
    } else if (!newUser.name) {
        res.status(400).json({
            message: "missing required name field"
        })
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    const newPost = req.body
    if (!newPost) {
        res.status(400).json({
            message: "missing post data"
        })
    } else if (!newPost.text) {
        res.status(400).json({
            message: "missing required text field"
        })
    } else {
        next();
    }
};

module.exports = router;
