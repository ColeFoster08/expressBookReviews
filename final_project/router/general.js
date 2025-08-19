const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    let keys = Object.keys(books);
    let result = []

    for (let key of keys) {
        let book = books[key];
        if (book.author == author) {
            result.push(book)
        }
    }

    if (result.length > 0) {
        res.send(JSON.stringify(result,null,4));
    } else {
        return res.status(404).json({message: "No books found for this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
    let keys = Object.keys(books);
    let result = []

    for (let key of keys) {
        let book = books[key];
        if (book.title == title) {
            result.push(book)
        }
    }

    if (result.length > 0) {
        res.send(JSON.stringify(result,null,4));
    } else {
        return res.status(404).json({message: "No books found for this title"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

function getListBooks() {
    axios.get('https://colefoster-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
        .then(response => {
            console.log("Here is a list of all books avaliable in the shop:");
            console.log(response.data)
        })
        .catch(error => {
            console.error("There was an error while fetching books:", error.message);
        });
}

getListBooks();


function getBookByISBN(isbn) {
    axios.get(`https://colefoster-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`)
        .then(response => {
            if (response.data) {
                console.log(`Here is the book with the provided ISBN: ${isbn}`);
                console.log(response.data)
            } else {
                console.log(`Unable to find a book with the provided ISBN: ${isbn}`);
            }
        })
        .catch(error => {
            console.error("There was an error while fetching books:", error.message);
        });
}

getBookByISBN(1);

function getBookByAuthor(author) {
    axios.get(`https://colefoster-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`)
        .then(response => {
            if (response.data) {
                console.log(`Here is the book by the author: ${author}`);
                console.log(response.data)
            } else {
                console.log(`Unable to find a book by the author: ${author}`);
            }
        })
        .catch(error => {
            console.error("There was an error while fetching books:", error.message);
        });
}

getBookByAuthor("Dante Alighieri");

function getBookByTitle(title) {
    axios.get(`https://colefoster-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`)
        .then(response => {
            if (response.data) {
                console.log(`Here is the book with the title: ${title}`);
                console.log(response.data)
            } else {
                console.log(`Unable to find a book with the title: ${title}`);
            }
        })
        .catch(error => {
            console.error("There was an error while fetching books:", error.message);
        });
}

getBookByTitle("One Thousand and One Nights");

module.exports.general = public_users;
