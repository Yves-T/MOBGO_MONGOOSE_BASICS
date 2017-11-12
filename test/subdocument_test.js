const assert = require('assert');
const User = require('../src/user');

describe('SubDocuments', () => {
  it('can create a subdocument', async () => {
    const joe = new User({
      name: 'Joe',
      posts: [{ title: 'PostTitle' }],
    });
    await joe.save();
    const user = await User.findOne({ name: 'Joe' });
    assert(user.posts[0].title === 'PostTitle');
  });

  it('Can add subdocuments to an existing record', async () => {
    const joe = new User({
      name: 'Joe',
      posts: [],
    });
    await joe.save();
    const user = await User.findOne({ name: 'Joe' });
    user.posts.push({ title: 'newPost' });
    await user.save();
    const updatedUser = await User.findOne({ name: 'Joe' });
    assert(updatedUser.posts[0].title === 'newPost');
  });

  it('it can remove an existing sub document', async () => {
    const joe = new User({
      name: 'Joe',
      posts: [{ title: 'PostTitle' }],
    });
    await joe.save();
    const user = await User.findOne({ name: 'Joe' });
    user.posts[0].remove();
    await user.save();
    const updatedUser = await User.findOne({ name: 'Joe' });
    assert(updatedUser.posts.length === 0);
  });
});
