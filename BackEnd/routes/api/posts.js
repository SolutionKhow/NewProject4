const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/posts
//@desc create Post
//@acess Private

router.get('/ ', [auth, [
    check('text', 'Text is requires').not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array() 
        });
    }

    try {

        const user = await User.findById(req.user.id).select('-password');
        console.log(req.user.id);
        const newPost = new Post({
            text: req.body.text,
            name: user.name,       
            avatar: user.avatar,
            user: req.user.id
        });
   
        const post=await newPost.save();
       return  res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');

    }


});
module.exports = router;