// const Joi = require('joi');

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors())
require('dotenv').config();

const users = [
    { id: 1, username: "qutadah", password: 'qut@123',isAdmin: true },
    { id: 2, username: "qutadah1", password: 'qut@123' ,isAdmin: false},
    { id: 3, username: "qutadah2", password: 'qut@123' ,isAdmin: false},
]
app.get(('/'), (req, res) => {
    res.send('Hello World!!!!');
});
// app.get(('/api/users'), (req, res) => {
//     res.send(users);
// });
// app.get(('/api/users/:id'), (req, res) => {
//     const user = users.find(c => c.id == req.params.id)
//     if (!user) res.status(404).send("the user with ID didn't find");
//     res.send(user);
// });

// app.post('/api/users', (req, res) => {

 
//     if (!req.body.userName && !req.body.password || req.body.userName.length < 3 && req.body.password.length < 3) {
//         res.status(400).send('User name and password should be more then 3 latter');
//         return;
//     }
//     const user = {
//         id: users.length + 1,
//         userName: req.body.userName,
//         password: req.body.password,
//     };
//     users.push(user);
//     res.send(user);
// });

// app.put('/api/users/:id',(req,res)=>{
//     const user = users.find(c => c.id == req.params.id)
//     if (!user) res.status(404).send("the user with ID didn't find");
//     if (!req.body.userName && !req.body.password || req.body.userName.length < 3 && req.body.password.length < 3) {
//         res.status(400).send('User name and password should be more then 3 latter');
//         return;
//     }
//     user.userName=req.body.userName;
//     user.password=req.body.password;
//     res.send(user);
// });
// app.delete('/api/users/:id',(req,res)=>{
//     const user = users.find(c => c.id == req.params.id)
//     if (!user) res.status(404).send("the user with ID didn't find");
//     if (!req.body.userName && !req.body.password || req.body.userName.length < 3 && req.body.password.length < 3) {
//         res.status(400).send('User name and password should be more then 3 latter');
//         return;
//     }
//     const index=users.indexOf(user);
//     users.splice(index,1);
//     res.send(user);

// });

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
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
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



mongoose.connect("mongodb+srv://qutadah:qutadah123@cluster0.oxjhta3.mongodb.net/todoDB")

app.use("/",require("./routes/todoRoute"))

app.listen(8080, () => console.log("porting on 8080"));
