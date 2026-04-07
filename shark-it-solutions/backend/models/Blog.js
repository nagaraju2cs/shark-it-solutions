const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: { type: String, unique: true },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['Cloud Engineering', 'Cybersecurity', 'AI Solutions', 'Web Development',
           'Linux Admin', 'Database Support', 'System Admin', 'General IT']
  },
  tags: [{ type: String, trim: true }],
  featuredImage: { type: String, default: 'default-blog.jpg' },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  metaTitle: { type: String },
  metaDescription: { type: String }
}, { timestamps: true });

// Auto-generate slug from title
BlogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Auto-calculate read time from content
BlogSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

BlogSchema.index({ slug: 1 });
BlogSchema.index({ category: 1, isPublished: 1 });
BlogSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Blog', BlogSchema);
