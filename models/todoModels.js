const mongoose=require('mongoose')

const todoSchema ={

    todo:String,
    isComplet:Boolean
}

const Todo=mongoose.model("todo",todoSchema)

module.exports = Todo;