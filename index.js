// const Joi = require('joi');

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors())
require('dotenv').config();
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const Schema=require("./models/Schema")

// const users = [
//     { id: 1, username: "qutadah", password: 'qut@123',isAdmin: true },
//     { id: 2, username: "qutadah1", password: 'qut@123' ,isAdmin: false},
//     { id: 3, username: "qutadah2", password: 'qut@123' ,isAdmin: false},
// ]
app.get(('/'), (req, res) => {
    res.send('Hello World!!!!');
}); 

let refreshTokens = [];

app.post("/api/refresh", (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) { 
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
    expiresIn: "5s",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
};

app.post("/api/login", (req, res) => {
  console.log("u")
  const { username, password } = req.body;

  const user =Schema.Users.find({}, (err,userr)=>{
    return( userr.username === username && userr.password === password)
  
  })
  // const user = users.find((u) => {
  //   return( u.username === username && u.password === password)
  // });
  if (user) {
    //Generate an access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("Username or password incorrect!");
  }
  // console.log(user);

});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

app.delete("/api/users/:userId", verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json("User has been deleted.");
  } else {
    res.status(403).json("You are not allowed to delete this user!");
  }
});

app.post("/api/logout", verify, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully.");
});



mongoose.connect("mongodb+srv://qutadah:qutadah123@cluster0.oxjhta3.mongodb.net/todoDB", {useNewUrlParser:true, useUnifiedTopology:true})

app.use("/",require("./routes/todoRoute"))


app.listen(8080, () => console.log("porting on 8080"));
