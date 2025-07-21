const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user = users.filter(usr => usr.username === username);
    return (user.length > 0)?false : true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validUser = users.filter(user=>user.username == username && user.password === password);
    return (validUser.length > 0)?true:false;
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({ message: "Error logging in" });
}

if (authenticatedUser(username, password)){
    //generate JWT access token
    let accessToken = jwt.sign({data: username}, 'access', { expiresIn: 60*60});
    //store access token and username in session
    req.session.authorization = {
        accessToken, username
    }

    return res.status(200).send("User successfully logged in.");
} else {
    return res.status(200).json({message: "Invalid Login. Check username and password"});
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.body.review;
  let book = books[isbn];
  if(book != null){
    if(review != null){
       let username = req.session.authorization.username;
       book.reviews[username] = review;
       return res.status(200).json(JSON.stringify({message: "Updated Review succesfully", updatedBook: book}, null, 4));
    } 
    return res.status(200).json({message: "No review has been provided."});
  }
  return res.status(300).json({message: "Book with ISBN "+isbn+" not found in database."});
});

regd_users.delete("/auth/review/:isbn", (req,res)=>{
    let isbn = req.params.isbn;
    let book = books[isbn];
    
    let username =  req.session.authorization.username;
    let reviews = book.reviews.username
    console.log(book.reviews[username]);
   if(book != null ){
    //delete books[isbn].review.username;
    delete book.reviews[username];
   }

   return res.status(200).json({message: `review by ${username} for book with isbn ${isbn} has been succesfully deleted.`, updatedBooks: books});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
