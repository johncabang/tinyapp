const bcrypt = require('bcrypt');



// Helper Functions


const generateRandomString = function() {
  let randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
};

// Verify email
const verifyEmail = function(userDatabase, email) {
  for (let user in userDatabase) {
    if (userDatabase[user].email === email) {
      return userDatabase[user];
    }
  }
  return false;
};

// Verify password
const verifyPassword = function(userDatabase, email, password) {
  const userFound = verifyEmail(userDatabase, email);
  if (userFound && bcrypt.compareSync(password, userFound.password)) {
    return userFound;
  }
  return false;
};

// Returns URL, where the userID = the logged-in user
const urlsForUser = (userDatabase, users) => {
  const results = {};
  for (let key in userDatabase) {
    const urlObj = userDatabase[key];
    if (urlObj.userID === users) {
      results[key] = urlObj;
    }
  }
  // console.log(results)
  return results;
};

// urlsForUser(urlDatabase, 'abcd')


module.exports = { generateRandomString, verifyEmail, verifyPassword, urlsForUser };