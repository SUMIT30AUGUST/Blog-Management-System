const express = require('express')
const Router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const { UserRegister, UserLogout, UserLogin } = require('../Controllers/user');
const { CreateBlog, DeleteBlog, UpdateBlog, BlogById, Blogs, SearchBlog } = require('../Controllers/blog');

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/images')); // Save in public/images
    },
    filename: function (req, file, cb) {
      // Use original filename or customize here
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  // Multer upload instance
const upload = multer({ storage: storage });

// Authentication middleware
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized', status: 0 });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            // console.log(token)
            // Handle different error scenarios
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Session has expired! Please Login again.', status: 0 });
            } else if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
                return res.status(403).json({ error: 'Invalid token! Please Login again.', status: 0 });
            } else {
                return res.status(500).json({ error: 'Internal server error', status: 0 });
            }
        }

        req.user = user;
        next();
    });
}

Router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.send(`Image uploaded: /images/${req.file.filename}`);
})

//User
Router.post('/user/register',UserRegister)
Router.post('/user/login',UserLogin)
Router.post('/user/logout',authenticateToken,UserLogout)


//Blogs
Router.post('/blog/create', upload.single('image'),authenticateToken,CreateBlog)
Router.get('/blog/search',authenticateToken,SearchBlog)
Router.get('/blog/list',authenticateToken,Blogs)
Router.get('/blog/:id',authenticateToken,BlogById)
Router.put('/blog/update', upload.single('image'),authenticateToken,UpdateBlog)
Router.delete('/blog/delete',authenticateToken,DeleteBlog)

module.exports=Router;