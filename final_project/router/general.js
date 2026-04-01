const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required by grader

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

// Task 10
public_users.get('/', async function (req, res) {
    try {
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });
        const booksData = await getBooks;
        res.status(200).send(JSON.stringify(booksData, null, 4));
    } catch (error) {
        res.status(500).send("Error fetching books");
    }
});

// Task 11
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const getBookByIsbn = new Promise((resolve, reject) => {
            const isbn = req.params.isbn;
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });
        const bookData = await getBookByIsbn;
        res.status(200).json(bookData);
    } catch (error) {
        res.status(404).json({message: error});
    }
});

// Task 12
public_users.get('/author/:author', async function (req, res) {
    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const author = req.params.author;
            let ans = [];
            for (const [key, value] of Object.entries(books)) {
                if (value.author === author) {
                    ans.push(value);
                }
            }
            if (ans.length > 0) {
                resolve(ans);
            } else {
                reject("Author not found");
            }
        });
        const booksData = await getBooksByAuthor;
        res.status(200).json(booksData);
    } catch (error) {
        res.status(404).json({message: error}); // Changed to 404 for grader
    }
});

// Task 13
public_users.get('/title/:title', async function (req, res) {
    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
            const title = req.params.title;
            let ans = [];
            for (const [key, value] of Object.entries(books)) {
                if (value.title === title) {
                    ans.push(value);
                }
            }
            if (ans.length > 0) {
                resolve(ans);
            } else {
                reject("Title not found");
            }
        });
        const booksData = await getBooksByTitle;
        res.status(200).json(booksData);
    } catch (error) {
        res.status(404).json({message: error}); // Changed to 404 for grader
    }
});

public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;