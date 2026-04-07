const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Blog = require('../models/Blog');
const { Review, Quote } = require('../models/ReviewAndQuote');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// ── GET /api/v1/admin/dashboard ─────────────────────────
// Returns full analytics summary for admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalContacts,
      newContacts,
      inProgressContacts,
      totalBlogs,
      publishedBlogs,
      totalReviews,
      pendingReviews,
      totalQuotes,
      pendingQuotes,
      totalUsers,
      recentContacts,
      recentQuotes
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ status: 'in-progress' }),
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      Review.countDocuments({ isApproved: true }),
      Review.countDocuments({ isApproved: false }),
      Quote.countDocuments(),
      Quote.countDocuments({ status: 'pending' }),
      User.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(5).select('name email service status createdAt'),
      Quote.find().sort({ createdAt: -1 }).limit(5).select('name email services status createdAt')
    ]);

    // Contact submissions by service (aggregation)
    const contactsByService = await Contact.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Contacts per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const contactsPerMonth = await Contact.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Avg review rating
    const ratingAgg = await Review.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          contacts: { total: totalContacts, new: newContacts, inProgress: inProgressContacts },
          blogs: { total: totalBlogs, published: publishedBlogs },
          reviews: { approved: totalReviews, pending: pendingReviews, avgRating: ratingAgg[0]?.avgRating?.toFixed(1) || '0.0' },
          quotes: { total: totalQuotes, pending: pendingQuotes },
          users: totalUsers
        },
        contactsByService,
        contactsPerMonth,
        recentContacts,
        recentQuotes
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/v1/admin/users ─────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PATCH /api/v1/admin/users/:id ──────────────────────
router.patch('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/v1/admin/users/:id ─────────────────────
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
