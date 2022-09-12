const express=require('express')
const router=express.Router()
const Todo = require("../models/todoModels")
const Schemas=require("../models/Schema")

router.route("/create").post((req,res)=>{

    const todo=req.body.todo
    const isComplet=req.body.isComplet
    const newTodo=new Todo({
        todo,
        isComplet
    })
    newTodo.save();
});


router.post('/addTodo', async (req, res) => {
  const userTodo = req.body.todo;
  console.log(userTodo,"userTodo");
  const user = Schemas.Users;
  const userId = await user.findOne({username:'qutadah'}).exec();

  const newTodo = new Schemas.Todos({
      todo: userTodo,
      user: userId._id
  });

  try {
      await newTodo.save( (err) => {
          if (err) res.end('Error Saving.');
          res.redirect('/list');
          res.end();
      });
  } catch(err) {
      console.log(err);
      res.redirect('/list');
      res.end();
  }
});
router.route("/list").get((req,res)=>{

   Todo.find().then(foundTodo=>res.json(foundTodo))
});
router.delete("/delete/:id", (req, res) => {
    Todo.findByIdAndDelete({ _id: req.params.id })
      .then((doc) => console.log(doc))
      .catch((err) => console.log(err));
  });

  
  router.put("/update/:id", (req, res) => {
    Todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        todo:req.body.todo,
      }
    ).then((doc) => console.log(doc)).catch((err) => console.log(err));
  });


module.exports=router;