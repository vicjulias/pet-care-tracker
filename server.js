require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// currentUser for EJS
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

// EJS setup
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/auth'));
app.use('/pets', require('./routes/pets'));

app.get('/', (req, res) => {
  res.redirect(req.session.userId ? '/pets' : '/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));