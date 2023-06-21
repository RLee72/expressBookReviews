const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let usersWithSameName = users.filter((user) => {
    return user.username === username
  });
  if (usersWithSameName.length > 0) {
    return true;
  }
  else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password) 
  });
  if (validUsers.length > 0) {
    return true;
  }
  else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60*60 });

    req.session.authorization ={
      accessToken,username
    }
  
  return res.status(200).send("User successfully logged in");
}
  else {
  return res.status(300).json({message: "Invalid Login. CHeck username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

    if (authenticatedUser(username, password)) {
      const isbn = parseInt(req.params.isbn); 
      const book = books[isbn];

    let filtered_books = books.filter((book) => book.isbn === isbn);
    if (filtered_books.length > 0) {
      let filtered_books = filtered_books[0];
      let reviews = books[isbn].reviews;

      if (reviews) {
        filtered_books.reviews = reviews
      }
      books = books.filter((books)=> book.isbn != book);
      books.push(filtered_books);
      res.send(`Book review with isbn ${isbn} updated`)
      
    }
    
    else {
      res.status(300).json({message: "unable to find user!"});
    }
  }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const isbn = parseInt(req.params.isbn); 

    if (authenticatedUser(username, password)) {
      const book = books[isbn];

      if (book && book.reviews && book.reviews[username]) {
        delete book.reviews[username];
        res.send(`review for  ${isbn} deleted.`);
      }
      else {
        res.status(404).json({message: "Review not found"});
      }
    }
    else {

      res.status(300).json({message: "Yet to be implemented"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
