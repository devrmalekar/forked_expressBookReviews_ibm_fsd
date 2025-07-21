const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res)=>{
    const {username, password} = req.body;

    if(username && password){
        if(isValid(username)){
            users.push({"username": username, "password": password})
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message:"Unable to resgister user."});
});

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
    try {
        const data = await Promise.resolve(books);
        return res.status(200).json(JSON.stringify(data, null, 2));
    } catch (err){
        return res.status(500).json({message: "Internal Server error! "+err});
    }
  //Write your code here
  //return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  new Promise((resolve,reject)=>{
    let isbn = req.params.isbn;
    let book = books[isbn];
    resolve(book);
  })
  .then(data => {
    if(data)
        res.status(200).json(JSON.stringify(data, null, 2));
    else 
        res.status(200).json({message: `Book with ISBN ${req.params.isbn} is not found on database.`});
  })
  .catch(error => res.status(500).json({message: "Internal Server error! "+error}));
    /*//Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book == null){
    return res.status(200).json({message: `Book with ISBN ${isbn} is not found on database.`});
  } else {
    return res.status(200).json(JSON.stringify(book, null, 2));
  }
  //return res.status(300).json({message: "Yet to be implemented"});*/
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    let author = req.params.author;
    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
          let booksByAuthor = {};
          const isbnAsKey = Object.keys(books);
    
          isbnAsKey.forEach(key => {
            const book = books[key];
            if (book.author === author) {
              booksByAuthor[key] = book;
            }
          });
    
          resolve(booksByAuthor);
          // console.log(booksByAuthor);
          if(JSON.stringify(booksByAuthor) === "{}"){
            return res.status(200).json({message: `Book written by author ${author} is not found on database.`});
          } else {
            return res.status(200).json(JSON.stringify(booksByAuthor, null, 2));
          }
        });
    } catch (err) {
            return res.status(500).json({message: "Internal Server error! "+err});
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    let title = req.params.title;
    try{
        const booksByTitle = await new Promise((resolve, reject)=> {
            let booksByTitle = {};
            let isbnAsKey = Object.keys(books);
            isbnAsKey.forEach(key => {
                const book = books[key];
                if(book.title === title){
                    booksByTitle[key] = book;
                }
            });
            resolve(booksByTitle);

        });
        
        if(JSON.stringify(booksByTitle) === "{}"){
            return res.status(200).json({message: `Book titled ${title} is not found on database.`});
          } else {
            return res.status(200).json(JSON.stringify(booksByTitle, null, 2));
          }
    } catch (err) {
        return res.status(500).json({message: "Internal Server error! "+err});
    }
    
   // console.log(booksByTitle);
   
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
