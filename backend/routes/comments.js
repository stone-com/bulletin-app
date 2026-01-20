const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create a new comment
router.post('/create', auth, async (req, res) => {
  try {
    const { postId, content } = req.body;
    const authorId = req.user.id;

    if (!postId || !content) {
      return res
        .status(400)
        .json({ message: 'Post and content are required' });
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

// Update a comment
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (req.user.id !== comment.author.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (req.user.id !== comment.author.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Remove comment from post's comments array
    const post = await Post.findById(comment.post);
    if (post) {
      post.comments.pull(id);
      await post.save();
    }

    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
