const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendEmail, contactConfirmationTemplate, adminNotificationTemplate } = require('../utils/email');
const { protect, authorize } = require('../middleware/auth');
const logger = require('../utils/logger');

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('service').notEmpty().withMessage('Please select a service'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters')
];

// ── POST /api/v1/contact — Submit contact form ────────
router.post('/', contactValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, phone, service, message } = req.body;

    // Save to database
    const contact = await Contact.create({
      name, email, phone, service, message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Send confirmation email to user
    await sendEmail({
      to: email,
      subject: 'We received your enquiry — Shark IT Solutions 🦈',
      html: contactConfirmationTemplate(name, service)
    });

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Enquiry: ${service} from ${name}`,
      html: adminNotificationTemplate({ name, email, phone, service, message })
    });

    logger.info(`New contact: ${name} (${email}) — ${service}`);

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We will get back to you within 24 hours.',
      data: { id: contact._id }
    });
  } catch (err) {
    logger.error(`Contact submission error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// ── GET /api/v1/contact — Get all contacts (Admin only) ──
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = status ? { status } : {};
    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: contacts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/v1/contact/:id — Update contact status ──
router.patch('/:id', protect, authorize('admin', 'editor'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/v1/contact/:id ─────────────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
