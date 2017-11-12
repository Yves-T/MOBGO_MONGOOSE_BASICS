const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {
  let joe;
  let maria;
  let alex;
  let zach;

  beforeEach(async () => {
    alex = new User({ name: 'Alex' });
    joe = new User({ name: 'Joe' });
    maria = new User({ name: 'Maria' });
    zach = new User({ name: 'Zach' });
    await Promise.all([alex.save(), joe.save(), maria.save(), zach.save()]);
  });

  it('Find all users with a name of Joe', async () => {
    const users = await User.find({ name: 'Joe' });
    assert(users[0]._id.toString() === joe._id.toString());
  });

  it('Find all users with a name of Joe', async () => {
    const user = await User.findOne({ _id: joe._id });
    assert(user.name === 'Joe');
  });

  it('can skip ad limit the result set', async () => {
    const users = await User.find({})
      .sort({ name: 1 })
      .skip(1)
      .limit(2);
    assert(users.length === 2);
    assert(users[0].name === 'Joe');
    assert(users[1].name === 'Maria');
  });
});
