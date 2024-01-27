const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes");

const cookieParser = require("cookie-parser");

const {reuireAuth,checkUser} = require("./middleware/authmiddleware");

require("dotenv").config();


const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection

mongoose.connect(process.env.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) =>{
    app.listen(3000)
   console.log("Connected to the db !!!");
  })
  .catch((err) => console.log("Error ocuured !!!!! ====> "+err));

// routes
app.get("*",checkUser);
app.get('/',reuireAuth, (req, res) => res.render('home'));
app.get('/smoothies',reuireAuth, (req, res) => res.render('smoothies'));

app.use(authRoutes);

