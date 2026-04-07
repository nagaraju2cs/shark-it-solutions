const mongoose = require('mongoose');

// ── Review Model ──────────────────────────────────────
const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  company: { type: String, trim: true },
  role: { type: String, trim: true },
  service: {
    type: String,
    enum: ['Cloud Engineering', 'Cybersecurity', 'AI Solutions & Support',
           'Web Development', 'System Administration', 'Linux Administration',
           'Database Support', 'Managed IT Services', 'General'],
    default: 'General'
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  review: {
    type: String,
    required: [true, 'Review text is required'],
    minlength: [20, 'Review must be at least 20 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  isApproved: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

ReviewSchema.index({ isApproved: 1, rating: -1 });

// ── Quote Request Model ───────────────────────────────
const QuoteSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  phone: { type: String, trim: true },
  company: { type: String, trim: true },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  services: [{
    type: String,
    enum: ['Cloud Engineering', 'Cybersecurity', 'AI Solutions & Support',
           'Web Development', 'System Administration', 'Linux Administration',
           'Database Support', 'Managed IT Services']
  }],
  budget: {
    type: String,
    enum: ['Under ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹60,000', '₹60,000+', 'Custom']
  },
  timeline: {
    type: String,
    enum: ['ASAP', '1-2 weeks', '1 month', '3 months', 'Flexible']
  },
  description: {
    type: String,
    required: true,
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'proposal-sent', 'accepted', 'rejected'],
    default: 'pending'
  },
  proposalAmount: { type: Number },
  notes: { type: String }
}, { timestamps: true });

QuoteSchema.index({ status: 1, createdAt: -1 });

const Review = mongoose.model('Review', ReviewSchema);
const Quote = mongoose.model('Quote', QuoteSchema);

module.exports = { Review, Quote };
