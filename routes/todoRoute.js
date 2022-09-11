const express=require('express')
const router=express.Router()
const Todo = require("../models/todoModels")


router.route("/create").post((req,res)=>{

    const todo=req.body.todo
    const isComplet=req.body.isComplet
    const newTodo=new Todo({
        todo,
        isComplet
    })
    newTodo.save();
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