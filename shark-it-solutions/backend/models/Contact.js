const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [15, 'Phone number cannot exceed 15 digits']
  },
  service: {
    type: String,
    required: [true, 'Please select a service'],
    enum: [
      'Cloud Engineering',
      'Cybersecurity',
      'AI Solutions & Support',
      'Web Development',
      'System Administration',
      'Linux Administration',
      'Database Support',
      'Managed IT Services',
      'Other'
    ]
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });

module.exports = mongoose.model('Contact', ContactSchema);
