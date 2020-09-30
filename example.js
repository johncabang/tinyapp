const findUserByEmail = (usersDb, email) => {
for (let shortURL in usersDb) {
  // shortURL is the key
  // to get to the value object_name[key] => value
  const currentUserObj = usersDb[shortURL];
  usersDb[shortURL].email
  if (currentUserObj.email === email) {
    return currentUserObj;
  }
}

return false;

};

const result = findUserByEmail(users, 'user2Aexample.com');
console.log(result)


const urlsForUser = (urlsDb, id) => {

  // create a new placeholder object to keep the filtered urls
  const filteredUrls = {};

  // loop through the urlsDb to access each url individually
  for (let shurtURL in urlsDb) {
    // access the value
    const urlObj = urlsDb[shortURL];
    
    // condition: check that the user id of that url matches the id from the parameter
    // if its a match, keep it, if it's not, don't keep it
    if (urlObj.userID === id) {
    
    // adding a value to an object
      filteredUrls[shortURL] = urlObj;
    } 
  }
  // return new object
  return filteredUrls;
}

const usersUrl = urlsForUser(urlDatabase, 'aJ481');
console.log(usersUrl);




const addNewUser = (usersDb, email, password) => {
 // create a random user id
const userId = generateRandomString();
 // create a new user object
const newUserObj = {
  id: userId,
  email: email,
  passowrd: password
}
 // add the new user object to usersDb
usersDb[userId] = newUserObj;

return userId;

}

addNewUser(users, 'bob@sq.com', 'test');