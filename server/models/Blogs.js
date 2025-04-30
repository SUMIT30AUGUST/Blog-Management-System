const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    author: { type: String, default: '' }
  }, 
  { timestamps: true }
);


const Blog = mongoose.model.Blogs || mongoose.model('Blogs', blogSchema);

module.exports = Blog
