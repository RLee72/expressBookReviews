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
 if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(300).json({message: "Invalid Login. Check username and password"});
  }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const username = req.body.username;
  const isbn = parseInt(req.params.isbn); 
  const book = books[isbn];

  /* pseudocode: check request body for username
  if exists,check if book with isbn exists
  if exists modify reviews and add username: "review here" to review {}
    book[req.body.reviews] ={
        "reviews": req.body.username
    }

  */


  if (username){
    if (isbn < 1 || isbn > 10) {
      res.send("Not a valid month number")
    }

  else {
    // check if review exists:
    if (book.reviews[username]) {
      let review = req.body.reviews;

      if(review) {
        book.reviews[username] = review
        res.send(`review exists`);
      }

    else {
      book.reviews = {
        [req.body.username]: req.body.review
      }
      res.send(`review added`);
      //book[req.body.reviews]={
      //  "username": req.body.reviews
      //}
    }
    
    }
  }

      return res.status(200).send(`Book review with ISBN ${isbn} by user ${username} updated.`);
    } 
  else {
    return res.status(404).json({ message: "user doesn't exist" });
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
