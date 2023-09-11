const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password})
      return res.status(200).json({message: `username ${username} has been successfully registered`})
    } else {
      return res.status(404).json({message: `username ${username} already existed`})
    }
  } else {
    return res.status(404).json({message: "invalid username or password"})
  }
  
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  // add Promise callback
  const methCall = new Promise((resolve, reject)=>{
    try {
      const data = books;
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

  methCall.then(
    (data) => res.send(JSON.stringify(books, null, 4)),
    (err) => res.status(404).json({message: "This page is not available at the moment"})
  );
  // res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // add Promise callback
  const methCall = new Promise((resolve, reject)=>{
    try {
      const data = books[isbn];
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });

  methCall.then(
    (data) => res.send(JSON.stringify(data, null, 4)),
    (err) => res.status(400).json({message: `ISBN ${isbn} does not exist`})
  );

  // const isbn = req.params.isbn;
  // if (isbn in books) {
  //   return res.send(JSON.stringify(books[isbn], null, 4))
  // } else {
  //   return res.status(400).json({message: `ISBN ${isbn} does not exist`})
  // }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const methCall = new Promise((resolve, reject)=>{
    try {
      let getBooks = []
      for (isbn in books) {
        if (author === books[isbn].author) {
          getBooks.push(books[isbn]);
        }
      }
      if (getBooks.length > 0) {
        resolve(getBooks);
      } else {
        reject(null);
      }
    } catch (err) {
      reject(err)
    }
  });

  methCall.then(
    (data) => res.send(JSON.stringify(data, null, 4)),
    (err) => res.status(400).json({message: `Author ${author} does not exist`})
  );

  // const author = req.params.author;
  // let getBooks = []
  // for (isbn in books) {
  //   if (author === books[isbn].author) {
  //     getBooks.push(books[isbn])
  //   }
  // }
  // if (getBooks.length > 0) {
  //   return res.send(JSON.stringify(getBooks, null, 4))
  // } 
  // return res.status(400).json({message: `Author ${author} does not exist`})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const methCall = new Promise((resolve, reject)=>{
    try {
      let getBooks = []
      for (isbn in books) {
        if (title === books[isbn].title) {
          getBooks.push(books[isbn])
        }
      }
      if (getBooks.length > 0) {
        resolve(getBooks); 
      } else {
        reject(null);
      }
    } catch (err) {
      reject(err);
    }
  });

  methCall.then(
    (data) => res.send(JSON.stringify(data, null, 4)),
    (err) => res.status(400).json({message: `Title ${title} does not exist`})
  );

  // const title = req.params.title;
  // let getBooks = []
  // for (isbn in books) {
  //   if (title === books[isbn].title) {
  //     getBooks.push(books[isbn])
  //   }
  // }
  // if (getBooks.length > 0) {
  //   return res.send(JSON.stringify(getBooks, null, 4))
  // } 
  // return res.status(400).json({message: `Title ${title} does not exist`})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn in books) {
    return res.send(JSON.stringify(books[isbn].reviews, null, 4))
  } else {
    return res.status(404).json({message: `ISBN ${isbn} does not exist`})
  }
});

module.exports.general = public_users;
