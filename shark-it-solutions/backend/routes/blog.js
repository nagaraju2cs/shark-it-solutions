// ============================================================
//  blog.js — Blog CRUD routes
// ============================================================
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect, authorize } = require('../middleware/auth');

// GET all published blogs (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const query = { isPublished: true, ...(category && { category }) };

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit).populate('author', 'name'),
      Blog.countDocuments(query)
    ]);

    res.status(200).json({ success: true, count: blogs.length, total, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single blog by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create blog (admin/editor)
router.post('/', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    req.body.author = req.user.id;
    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update blog
router.put('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE blog
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
