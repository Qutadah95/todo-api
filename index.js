const Joi = require('joi');

const express = require('express');
const app = express();
app.use(express.json());
const users = [
    { id: 1, userName: "qutadah", password: 'qut@123' },
    { id: 2, userName: "qutadah1", password: 'qut@123' },
    { id: 3, userName: "qutadah2", password: 'qut@123' },
]
app.get(('/'), (req, res) => {
    res.send('Hello World!!!!');
});
app.get(('/api/users'), (req, res) => {
    res.send(users);
});
app.get(('/api/users/:id'), (req, res) => {
    const user = users.find(c => c.id == req.params.id)
    if (!user) res.status(404).send("the user with ID didn't find");
    res.send(user);
});

app.post('/api/users', (req, res) => {

    // const schema = {
    //     userName: Joi.require(),
    //     password: Joi.require(),
    // };
    // const result=Joi.validate(req.body,schema);
    // console.log(result);
    if (!req.body.userName && !req.body.password || req.body.userName.length < 3 && req.body.password.length < 3) {
        res.status(400).send('User name and password should be more then 3 latter');
        return;
    }
    const user = {
        id: users.length + 1,
        userName: req.body.userName,
        password: req.body.password,
    };
    users.push(user);
    res.send(user);
});

app.put('/api/users/:id',(req,res)=>{
    const user = users.find(c => c.id == req.params.id)
    if (!user) res.status(404).send("the user with ID didn't find");
    if (!req.body.userName && !req.body.password || req.body.userName.length < 3 && req.body.password.length < 3) {
        res.status(400).send('User name and password should be more then 3 latter');
        return;
    }
    user.userName=req.body.userName;
    user.password=req.body.password;
    res.send(user);
});
app.delete('/api/users/:id',(req,res)=>{
    const user = users.find(c => c.id == req.params.id)
    if (!user) res.status(404).send("the user with ID didn't find");
    if (!req.body.userName && !req.body.password || req.body.userName.length < 3 && req.body.password.length < 3) {
        res.status(400).send('User name and password should be more then 3 latter');
        return;
    }
    const index=users.indexOf(user);
    users.splice(index,1);
    res.send(user);

});
app.listen(8080, () => console.log("porting on 8080"));
