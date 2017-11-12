const mongoose = require('mongoose');
const PostSchema = require('./post');
const BlogPostSchema = require('./blogPost');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: name => name.length > 2,
      message: 'Name must be longer than 2 characters',
    },
    required: [true, 'Name is required.'],
  },
  posts: [PostSchema],
  likes: Number,
  blogposts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'blogpost',
    },
  ],
});

UserSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

UserSchema.pre('remove', async function(next) {
  const BlogPost = mongoose.model('blogpost');
  await BlogPost.remove({
    _id: { $in: this.blogposts },
  });
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
