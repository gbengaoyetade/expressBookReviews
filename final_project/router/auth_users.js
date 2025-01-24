const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const usernameRegex = /^[a-z0-9_.]+$/;
  return usernameRegex.test(username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  const foundUser = users.find((user) => {
    return user.username === username && user.password === password;
  });

  if (!foundUser) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const accessToken = jwt.sign({ username }, 'access', {
    expiresIn: 60 * 60 * 24,
  });

  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).json({ accessToken });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  //Write your code here

  const { username } = req.user;
  const { isbn } = req.params;
  const { review } = req.body;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ book });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { username } = req.user;
  const { isbn } = req.params;

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  delete books[isbn].reviews[username];

  return res
    .status(200)
    .json({ message: 'Your review was deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
