const mongoose = require('mongoose');
const assert = require('assert');

const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  let joe;
  let blogPost;
  let comment;
  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });
    comment = new Comment({ content: 'Congrats on great post' });
    joe.blogposts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;
    Promise.all([joe.save(), blogPost.save(), comment.save()]).then(() => {
      done();
    });
  });
  it('saves a relation between a user and a blogpost', async () => {
    const user = await User.findOne({ name: 'Joe' }).populate('blogposts');
    assert(user.blogposts[0].title === 'JS is Great');
  });
  it('saves a full relation graph', async () => {
    const user = await User.findOne({ name: 'Joe' }).populate({
      path: 'blogposts',
      populate: {
        path: 'comments',
        model: 'comment',
        populate: {
          path: 'user',
          model: 'User',
        },
      },
    });
    assert(user.name === 'Joe');
    assert(user.blogposts[0].title === 'JS is Great');
    assert(user.blogposts[0].comments[0].content === 'Congrats on great post');
    assert(user.blogposts[0].comments[0].user.name === 'Joe');
  });
});
