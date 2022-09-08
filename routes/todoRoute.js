const express=require('express')
const router=express.Router()
const Todo = require("../models/todoModels")


router.route("/create").post((req,res)=>{

    const todo=req.body.todo
    const isComplet=req.body.isComplet
console.log(req.body,"todo");
    const newTodo=new Todo({
        todo,
        isComplet
    })
    newTodo.save();
});
router.route("/list").get((req,res)=>{

   Todo.find().then(foundTodo=>res.json(foundTodo))
});


module.exports=router;