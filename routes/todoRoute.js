const express = require('express')
const router = express.Router()
const Schemas = require("../models/Schema")
router.route("/create").post((req, res) => {
  const todo = req.body.todo
  const isComplet = req.body.isComplet
  const newTodo = new Schemas.Todos({
    todo,
    isComplet
  })
  newTodo.save();
});

router.route("/register").post((req, res) => {

  const User = Schemas.Users;
  User.findOne({ username: req.body.username }).then((u) => {
    if (u) {
      return res.status(400).json({ username: "A user already regisered with this user name" })
    } else {
      let newUsers = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
      })
      newUsers.save()
      return res.status(200).json({ msg: newUsers })
    }
  })
});


router.post('/addTodo', async (req, res) => {
  const userTodo = req.body.todo;
  const user = Schemas.Users;
  const userId = await user.findOne({ username: `${req.query.userNameS}` }).exec();
  const newTodo = new Schemas.Todos({
    todo: userTodo,
    user: userId._id
  });
  console.log(newTodo);
  try {
    await newTodo.save((err) => {
      if (err) res.end('Error Saving.');
      res.redirect('/list');
      res.end();
    });
  } catch (err) {
    console.log(err);
    res.redirect('/list');
    res.end();
  }
});
router.route("/user").get(async (req, res) => {
  Schemas.Users.find().then(foundTodo => res.json(foundTodo))
})

router.route("/list").get(async (req, res) => {

  Schemas.Todos.find({ user: `${req.query.userID}` }, (err, data) => {
    if (err) {
      console.log(err);
    } else {

      res.json(data)
      res.end();
    }
  })

});
router.delete("/delete/:id", (req, res) => {
  Schemas.Todos.findByIdAndDelete({ _id: req.params.id })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

router.put("/update/:id", (req, res) => {
  Schemas.Todos.findByIdAndUpdate(
    { _id: req.params.id },
    {
      todo: req.body.todo,
    }
  ).then((doc) => console.log(doc)).catch((err) => console.log(err));
});

module.exports = router;