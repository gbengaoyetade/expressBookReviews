const express = require('express');
let booksDB = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

const getBooks = () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(booksDB);
    }, 100);
  });

  return promise;
};

public_users.post('/register', (req, res) => {
  //Write your code here

  const username = req.body.username.trim();
  const password = req.body.password.trim();

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  if (!isValid(username)) {
    return res.status(400).json({
      message:
        'Usernames can only contain letters, numbers, underscores, and periods',
    });
  }

  const user = users.find((item) => item.username === username);

  if (user) {
    return res.status(409).json({ message: 'Username already exist' });
  }

  users.push({ username, password });

  return res.status(201).json({ message: 'User created successfully ' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here

  const books = await getBooks();
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here

  const { isbn } = req.params;
  const books = await getBooks();
  const book = Object.keys(books).find((key) => key === isbn);

  if (book) {
    return res.status(200).json({ book: books[isbn] });
  }

  return res.status(404).json({ message: 'Book not found' });
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here

  const { author } = req.params;
  const books = await getBooks();
  const authorBooks = Object.values(books).filter((key) => {
    return key.author.toLocaleLowerCase().includes(author.toLocaleLowerCase());
  });

  if (authorBooks.length) {
    return res.status(200).json({ books: authorBooks });
  }

  return res.status(404).json({ message: 'Books not found' });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  const books = await getBooks();

  const book = Object.values(books).find((key) => {
    return key.title.toLocaleLowerCase().includes(title.toLocaleLowerCase());
  });

  if (book) {
    return res.status(200).json({ book });
  }

  return res.status(404).json({ message: 'Book not found' });
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here

  const books = await getBooks();
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(400).json({ message: 'Book not found' });
  }

  return res.status(200).json({ reviews: book.reviews });
});

module.exports.general = public_users;
