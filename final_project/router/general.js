const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book == null){
    return res.status(200).json({message: `Book with ISBN ${isbn} is not found on database.`});
  } else {
    return res.status(200).json(JSON.stringify(book, null, 2));
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let isbnAsKey = Object.keys(books);
    let booksByAuthor = {};
    isbnAsKey.forEach(key => {
        const book = books[key];
        if(book.author === author){
            booksByAuthor[key] = book;
        }
    });
   // console.log(booksByAuthor);
    if(JSON.stringify(booksByAuthor) === "{}"){
      return res.status(200).json({message: `Book written by author ${author} is not found on database.`});
    } else {
      return res.status(200).json(JSON.stringify(booksByAuthor, null, 2));
    }
    //return res.status(300).json({message: "Yet to be implemented"})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let isbnAsKey = Object.keys(books);
    let booksByTitle = {};
    isbnAsKey.forEach(key => {
        const book = books[key];
        if(book.title === title){
            booksByTitle[key] = book;
        }
    });
   // console.log(booksByTitle);
    if(JSON.stringify(booksByTitle) === "{}"){
      return res.status(200).json({message: `Book titled ${title} is not found on database.`});
    } else {
      return res.status(200).json(JSON.stringify(booksByTitle, null, 2));
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let bookByIsbn = books[isbn];
  if(bookByIsbn !== null){
    return res.status(200).json(JSON.stringify({"title": bookByIsbn.title, "review": bookByIsbn.reviews}, null, 2));
  } 
  return res.status(200).json({message: `Book with ISBN ${isbn} is not found on database.`});
});

module.exports.general = public_users;
