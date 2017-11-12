const mongoose = require('mongoose');
const semver = require('semver');

const { engines } = require('./version');

const version = engines.node;
if (!semver.satisfies(process.version, version)) {
  console.log(`Required node version ${version} not satisfied with current version ${process.version}.`);
  process.exit(1);
}

mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connect('mongodb://localhost/user_test', {
  useMongoClient: true,
});

before((done) => {
  mongoose.connection
    .once('open', () => done())
    .on('error', error => console.warn('Warning', error));
});

beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections;

  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});
