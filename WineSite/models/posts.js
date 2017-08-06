const mongoose = require('mongoose');
const Wine = require('./wines.js');

const postSchema = mongoose.Schema ({
  name: String,
  image: String,
  about: String
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
