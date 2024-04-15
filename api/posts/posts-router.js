// implement your posts router here
const express = require('express')
const router = express.Router()
const model = require('./posts-model')
// | 1 | GET    | /api/posts              | Returns **an array of all the post objects** contained in the database                                                          |
// | 2 | GET    | /api/posts/:id          | Returns **the post object with the specified id**                                                                               |
// | 3 | POST   | /api/posts              | Creates a post using the information sent inside the request body and returns **the newly created post object**                 |
// | 4 | PUT    | /api/posts/:id          | Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
// | 5 | DELETE | /api/posts/:id          | Removes the post with the specified id and returns the **deleted post object**                                                  |
// | 6 | GET    | /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id                       
router.get('/', async (req, res) => {
    const posts = await model.find()
    try {
        if (posts) 
        res.status(200).json(posts)
    } catch {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})
router.get('/:id', async (req, res) => {
    const post = await model.findById(req.params.id)
    try {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    }
})
router.post('/', async (req, res) => {
    try {
        const {title, contents} = req.body
        if (!title || !contents) {res.status(400).json({ message: "Please provide title and contents for the post" })} else {
        const newPost = await model.insert({title, contents})
        const post = await model.findById(newPost.id)
        res.status(201).json(post)
        }
    } catch {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const post = await model.findById(req.params.id)
        if (post) {
            const {title, contents} = req.body
            if (!title || !contents) {
                res.status(400).json({ message: "Please provide title and contents for the post" })
            } else {
            const update = await model.update(req.params.id, {title, contents})
            const updatedPost = await model.findById(update)
            res.status(200).json(updatedPost)
            }
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch {
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

router.delete('/:id', async (req, res) => {
    const post = await model.findById(req.params.id)
    try {
        if (post) {
            await model.remove(req.params.id)
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch {
        res.status(500).json({ message: "The post could not be removed" })
    }
})
router.get('/:id/comments', async (req, res) => {
    const post = await model.findById(req.params.id)
    try {
        if (post) {
            const comments = await model.findPostComments(req.params.id)
            res.status(200).json(comments)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})
module.exports = router