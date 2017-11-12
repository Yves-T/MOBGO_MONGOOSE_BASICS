const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {
  let joe;

  beforeEach(async () => {
    joe = new User({ name: 'Joe', likes: 0 });
    await joe.save();
  });

  async function assertName(operation) {
    await operation;
    const users = await User.find({});
    assert(users.length === 1);
    assert(users[0].name === 'Alex');
    return users;
  }

  it('instance type using set n save', async () => {
    const user = await joe.set('name', 'Alex');
    await assertName(user.save());
    const users = await User.find({});
    assert(users.length === 1);
    assert(users[0].name === 'Alex');
  });

  it('A model instance can update', async () => {
    await assertName(joe.update({ name: 'Alex' }));
  });

  it('A class instance can update', async () => {
    await assertName(User.update({ name: 'Joe' }, { name: 'Alex' }));
  });

  it('A model class can update one record', async () => {
    await assertName(User.findOneAndUpdate({ name: 'Joe' }, { name: 'Alex' }));
  });

  it('A model class can find a record with an Id and update', async () => {
    await assertName(User.findByIdAndUpdate(joe._id, { name: 'Alex' }));
  });

  it('A user can have their likes incremented by 1', async () => {
    await User.update({ name: 'Joe' }, { $inc: { likes: 10 } });
    const user = await User.findOne({ name: 'Joe' });
    assert(user.likes === 10);
  });
});
