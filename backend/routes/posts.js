const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User'); // optional, if you need to verify user
const auth = require('../middleware/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }
      });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a new post
router.post('/create', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const authorId = req.user.id;

    // Basic validation
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
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
router.put('/:id', auth, async (req, res) => {
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

    if (req.user.id !== post.author.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

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
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.user.id !== post.author.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
