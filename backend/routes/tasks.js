const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendShareNotification = require('../utils/mailer');

const router = express.Router();

// Create a task (owner only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      owner: req.user,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all my tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update my task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete my task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Share task to another user (by email)
router.post('/share/:id', auth, async (req, res) => {
  try {
    const { email } = req.body;
    const task = await Task.findOne({ _id: req.params.id, owner: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found or not owned by you' });
    const targetUser = await User.findOne({ email });
    if (!targetUser) return res.status(404).json({ message: 'Target user not found' });
    // Add to sharedTo if not already present
    if (!task.sharedTo.includes(targetUser._id)) {
      task.sharedTo.push(targetUser._id);
      await task.save();
    }
    // Add to target user's sharedTasks if not already present
    if (!targetUser.sharedTasks.includes(task._id)) {
      targetUser.sharedTasks.push(task._id);
      await targetUser.save();
    }
    // Send email notification
    try {
      const owner = await User.findById(req.user);
      await sendShareNotification(targetUser.email, owner.name, task.title);
    } catch (emailErr) {
      // Email failed, but sharing succeeded
      return res.json({ message: 'Task shared, but email could not be sent', error: emailErr.message });
    }
    res.json({ message: 'Task shared successfully and email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get tasks shared to me
router.get('/shared', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('sharedTasks');
    res.json(user.sharedTasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
