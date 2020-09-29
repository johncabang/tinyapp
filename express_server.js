const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

function generateRandomString() {
  let randomString = Math.random().toString(36).substring(2, 8);
  return randomString;
}

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.ca'
};

// urls = key
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

// GET route to show the form, then renders(server side) page
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// displays a single URL and its shortened form
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });

// Post route, form submission - creates a new shortURL, add to database, redirects to /urls/:shortURL
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  // console.log(req.body); // Log the Post request body to the console
  // shortURL-longURL key-value pair saved to urlDatabase
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// redirect shortURL to longURL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// update
app.post('/urls/:shortURL/update', (req, res) => {
  // console.log(req.body.updatedLongURL)
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.updatedLongURL;
  res.redirect(`/urls`);
});

// delete
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});