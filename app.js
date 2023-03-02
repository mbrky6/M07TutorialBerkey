const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// View Engine
app.set('view engine', 'ejs');

// Database Connection
const dbURI = "mongodb+srv://BlogSite:trgyg4eFrDmvAw@nodetutorial.uyarppy.mongodb.net/nodetut?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);

/*
// Cookies
app.get(".set-cookies", (req, res) => {
  // res.setHeader("Set-Cookie", "newUser=true"); // Make a cookie without cookie-parser
  res.cookie("newUser", false); // Make a cookie with cookie-parser
  res.cookie("isEmployee", true, {
    maxAge: 1000*60*60*24, // Time to expire in milliseconds
    secure: true, // Only generates on HTTPS connection
    httpOnly: true // Not accessible by JavaScript
  });
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  res.json(cookies);
});
*/