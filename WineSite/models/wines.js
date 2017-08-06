const mongoose = require('mongoose');
const Post = require('./posts.js');

const wineSchema = mongoose.Schema ({
  name: String,
  image: String,
  about: String,
  posts: [Post.schema]
});

const Wine = mongoose.model('Wine', wineSchema);

module.exports = Wine;
