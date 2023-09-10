const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userWithSameName = users.filter((user)=>{
    return user.username === username
  });
  if (userWithSameName.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // check if user is authenicated
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {data: password}
        , "access", 
        {expiresIn: 60 * 60}
      );
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).json({message: `User ${username} is successfully logged in`})
    } else {
      return res.status(200).json({message: "Invalid username or password. Please try again."})
    }
  } else {
    return res.status(404).json({message: "Missing username or password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // if user add new review, get posted with the username of the poster
  // if same user add review to the same ISBN, it should modify the review
  // if another user add review to the same ISBN, it should create a new review on the same ISBN
  const isbn = req.params.isbn
  const review = req.body.review;
  const username = req.session.authorization.username
  // check if isbn exist in the book db
  if (isbn in books) {
    let response;
    if (Object.keys(books[isbn].reviews).length == 0) {
      response = res.status(200).json({message: `ISBN ${isbn} review is added successfully for user ${username}`})
    } else {
      // if same user already review the same ISBN
      if (username in books[isbn].reviews) {
        response = res.status(204).json({message: `ISBN ${isbn} review is modified successfully for user ${username}`})
      } else {
        // if diff user review same ISBN
        response = res.status(200).json({message: `ISBN ${isbn} review is added successfully for user ${username}`})
      }
    }
    books[isbn].reviews[username] = {"review": review}
    return response;
  } else {
    return res.status(404).json({message: `ISBN ${isbn} does not exist`})
  }
});


// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username
  if (isbn in books) {
    if (Object.keys(books[isbn].reviews).length > 0 && username in books[isbn].reviews) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: `ISBN ${isbn} review is deleted successfully for user ${username}`})
    } else {
      return res.status(403).json({message: `ISBN ${isbn} review is cannot be deleted by user ${username}`})
    }
  } else {
    return res.status(404).json({message: `ISBN ${isbn} does not exist`})
  }

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
