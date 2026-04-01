const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login."});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get all books
public_users.get('/',function (req, res) {
    res.status(200).send(JSON.stringify(books,null,4));
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(books[isbn]);
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

// Task 3: Get book by Author
public_users.get('/author/:author',function (req, res) {
    let ans = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                ans.push(books[key]);
            }
        }
    }
    if(ans.length == 0){
        return res.status(404).json({message: "Author not found"});
    }
    res.status(200).send(ans);
});

// Task 4: Get book by Title
public_users.get('/title/:title',function (req, res) {
    let ans = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'title' && book[i][1] == req.params.title){
                ans.push(books[key]);
            }
        }
    }
    if(ans.length == 0){
        return res.status(404).json({message: "Title not found"});
    }
    res.status(200).send(ans);
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(books[isbn].reviews);
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

// Task 10: Async/Await with Axios - Get all books
public_users.get('/async-get-books', async function (req, res) {
    try {
        let response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Async/Await with Axios - Get book by ISBN
public_users.get('/async-get-books/isbn/:isbn', async function (req, res) {
    try {
        let isbn = req.params.isbn;
        let response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({message: "Error fetching book details"});
    }
});

// Task 12: Async/Await with Axios - Get book by Author
public_users.get('/async-get-books/author/:author', async function (req, res) {
    try {
        let author = req.params.author;
        let response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({message: "Error fetching book details"});
    }
});

// Task 13: Async/Await with Axios - Get book by Title
public_users.get('/async-get-books/title/:title', async function (req, res) {
    try {
        let title = req.params.title;
        let response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({message: "Error fetching book details"});
    }
});

module.exports.general = public_users;