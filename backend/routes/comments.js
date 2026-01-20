const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

// Create a new comment
router.post('/create', async (req, res) => {
  try {
    const { postId, authorId, content } = req.body;

    if (!postId || !authorId || !content) {
      return res
        .status(400)
        .json({ message: 'Post, author, and content are required' });
    }

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Verify user exists
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the comment
    const newComment = new Comment({
      post: postId,
      author: authorId,
      content,
    });

    const savedComment = await newComment.save();

    // Push comment ID to post's comments array
    post.comments.push(savedComment._id);
    await post.save();

    res.status(201).json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
