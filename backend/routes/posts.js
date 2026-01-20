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

// Update a post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // TODO: Add authentication check (e.g., if req.user.id !== post.author.toString()) return 403

    post.content = content;
    post.updatedAt = Date.now();
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // TODO: Add authentication check

    await Post.findByIdAndDelete(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
