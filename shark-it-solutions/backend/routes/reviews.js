const express = require('express');
const router = express.Router();
const { Review } = require('../models/ReviewAndQuote');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// GET approved reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 }).limit(20);
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
    res.status(200).json({ success: true, count: reviews.length, avgRating: avgRating.toFixed(1), data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST submit review (public)
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').trim().isLength({ min: 20, max: 1000 }).withMessage('Review must be 20–1000 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const review = await Review.create(req.body);
    res.status(201).json({ success: true, message: 'Thank you! Your review will appear once approved.', data: { id: review._id } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH approve/feature review (admin)
router.patch('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.status(200).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE review (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
