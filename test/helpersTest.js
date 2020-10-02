const { assert } = require('chai');

const { verifyEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('verifyEmail', function() {
  it('should return a user with valid email', function() {
    const user = verifyEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.equal(expectedOutput, user.id);
  });
  it('should return undefined if email is invalid', function() {
    const user = verifyEmail(testUsers, "faker@email.com");
    const expectedOutput = undefined;
    assert.equal(expectedOutput, user.id);
  });
});