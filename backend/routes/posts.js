const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User'); // optional, if you need to verify user

// Create a new post
router.post('/create', async (req, res) => {
  try {
    const { authorId, content } = req.body;

    // Basic validation
    if (!authorId || !content) {
      return res
        .status(400)
        .json({ message: 'Author and content are required' });
    }

    // Optionally check if the author exists
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the post
    const newPost = new Post({
      author: authorId,
      content,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
