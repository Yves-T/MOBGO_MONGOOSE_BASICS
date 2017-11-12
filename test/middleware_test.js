const mongoose = require('mongoose');
const assert = require('assert');

const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe('Middleware', () => {
  let joe;
  let blogPost;
  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });
    joe.blogposts.push(blogPost);
    Promise.all([joe.save(), blogPost.save()]).then(() => {
      done();
    });
  });
  it('users clean up dangling blogpost on remove', async () => {
    await joe.remove();
    const count = await BlogPost.count();
    assert(count === 0);
  });
});
