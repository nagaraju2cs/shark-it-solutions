const express = require('express');
const router = express.Router();
const { Quote } = require('../models/ReviewAndQuote');
const { protect, authorize } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');
const { body, validationResult } = require('express-validator');

// POST submit quote request (public)
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('services').isArray({ min: 1 }).withMessage('Select at least one service'),
  body('description').trim().isLength({ min: 20, max: 3000 }).withMessage('Description required (20–3000 chars)')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const quote = await Quote.create(req.body);

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Quote Request from ${req.body.name}`,
      html: `<h2>New Quote Request</h2><p><b>Name:</b> ${req.body.name}</p><p><b>Email:</b> ${req.body.email}</p><p><b>Services:</b> ${req.body.services.join(', ')}</p><p><b>Budget:</b> ${req.body.budget || 'Not specified'}</p><p><b>Timeline:</b> ${req.body.timeline || 'Not specified'}</p><p><b>Description:</b> ${req.body.description}</p>`
    });

    res.status(201).json({ success: true, message: 'Quote request submitted! We will send a proposal within 48 hours.', data: { id: quote._id } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET all quote requests (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: quotes.length, data: quotes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update quote status
router.patch('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.status(200).json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
