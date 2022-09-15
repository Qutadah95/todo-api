const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt=require('bcrypt')
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, default: Date.now },

});

const todoSchema = new Schema({
    todo: { type: String, required: true },
    state:{type:Boolean},
    user: { type: Schema.Types.ObjectId, ref: 'users' }
});

userSchema.pre('save',async function (next){
    const salt= await bcrypt.genSalt();
this.password= await bcrypt.hash(this.password,salt)
    next();
})
const Users = mongoose.model('users', userSchema, 'users');
const Todos = mongoose.model('todos', todoSchema, 'todos');
const mySchemas = { 'Users': Users, 'Todos': Todos };

module.exports = mySchemas;