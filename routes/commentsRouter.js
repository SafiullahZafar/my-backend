import express from 'express';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true }); // mergeParams allows :id from parent route

// GET comments for a task
router.get('/', protect, async (req, res) => {
  const taskId = req.params.id;
  try {
    const comments = await Comment.find({ taskId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
});

// POST new comment
router.post('/', protect, async (req, res) => {
  const { user, message } = req.body;
  const taskId = req.params.id;

  try {
    const comment = new Comment({ taskId, user, message });
    await comment.save();

    // Emit event via Socket.io if io instance is set on app
    req.app.get('io')?.emit('newComment', comment);

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
});

export default router;
