const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;



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

  
// task 10 
// using promises


let bookList = new Promise((resolve, reject) => {
    setTimeout(() => {
    resolve(" ... End of book list, Promise resolved")
  }, 2000)
  });
  
  console.log("Retrieving list of books available...");
  
  bookList.then((successMessage)=> {
    let titles = Object.values(books).map(book => book.title); 
    console.log(titles + successMessage)
  })

  

  return res.status(300).json(titles);
});

// Get book details based on ISBN



  
public_users.get('/isbn/:isbn',function (req, res) {
    //task 11
//Write your code here
    let isbn = parseInt(req.params.isbn); // isbn is an integer
    const book = books[isbn];
    let bookList = new Promise((resolve, reject) => {
        setTimeout(() => {
        resolve(" ... End of book details, Promise resolved")
      }, 2000)
      });
      
      console.log("Retrieving book details...");

      bookList.then((successMessage)=> {
        console.log(`Book Title: ${book.title}`);
        console.log(`Book Author: ${book.author}`);
        console.log(`Book Reviews: ${book.reviews}`);
        console.log(successMessage)
      })

    //task 2
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
  //const author = filtered_books[0].author;
  //const titleBook = filtered_books[0].title;
  //const reviews = filtered_books[0].reviews;

  const details = req.params.title;
  //res.send(books[title])
  
  let bookDetails = new Promise((resolve, reject) =>{
    setTimeout(() => {
        resolve("... End of book details, promise resolved")
    }, 2000)
    });
  console.log("Retrieving book detials based off title...");
  bookDetails.then((successMessage) => {
      console.log(books[details])
      //console.log('Author:' , author);
      //console.log('Review: ', review)
      console.log(successMessage)
  })

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

// task 11
// using async axios


//connectToURL('https://vsytch-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/'+isbn);

/*
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn); // isbn is an integer
  if (isbn < 1 || isbn > 10) {
    res.send("Not a valid month number")
  }
  else {

    const connectToURL = async (url)=>{
        const req = await axios.get(url);
        console.log(req);
        req.then(resp => {

            console.log("Fulfilled")
            console.log(resp.data);
            res.send(resp.data);
        })
        .catch(err => {
            console.log("Rejected for url "+url)
            res.send("Rejected for url "+url);
            console.log(err.toString())
        });
        connectToURL('https://vsytch-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/'+isbn);
    }
  }

 });
 */

/*

// Task 12:
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author =req.params.author;
  let bookList = new Promise((resolve, reject) => {
    setTimeout(() => {
    resolve(" ... End of book list, Promise resolved")
  }, 2000)
  });
  
  console.log("Retrieving list of books available...");
  
  bookList.then((successMessage)=> {
    let filtered_books = Object.values(books).filter((book) => book.author === author);
    console.log(filtered_books + successMessage)
  })
  
});

// Task 13:
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  
  
  let bookDetails = new Promise((resolve, reject) => {
    setTimeout(() => {
    resolve(" ... End of book list, Promise resolved")
  }, 2000)
  });
  
  console.log("Retrieving list of books available...");
  
  bookDetails.then((successMessage)=> {
    let filtered_books = Object.values(books).filter((book) => book.title === title);
    console.log(filtered_books + successMessage)
  })


});


*/

module.exports.general = public_users;
