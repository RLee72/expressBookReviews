const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // post that accepts username and password through the body
  // note the user doesn't haveto be authenticated to access this endpoint
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else {
      return res.status(404).json({message: "User alreade exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let titles = Object.values(books).map(book => book.title); 
  return res.status(300).json(titles);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn); // isbn is an integer
  if (isbn < 1 || isbn > 10) {
    res.send("Not a valid month number")
  }
  else {
  return res.status(300).json(books[isbn]);
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author =req.params.author;
  let filtered_books = Object.values(books).filter((book) => book.author === author);
  return res.status(300).json(filtered_books);
  
});

// Get all books based on title
// use filter
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let filtered_books = Object.values(books).filter((book) => book.title === title);
  return res.status(300).json(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const reviews = req.params.reviews
  let isbn = parseInt(req.params.isbn);
  if (isbn < 1 || isbn > 10) {
    res.send("Not a valid month number")
  }
  else {
  return res.status(300).json(books[isbn].reviews);
  }
});

module.exports.general = public_users;
