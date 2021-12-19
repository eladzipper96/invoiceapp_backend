const express = require('express');
const mongoose = require('mongoose');
const Invoice = require('./models/invoice')
const cors = require('cors')
const User = require('./models/user')
const { equal } = require('assert');

const app = express();
var userslist = []
app.use(cors())
app.use(express.json())

const dbURI = process.env.MONGODBURI
mongoose.connect(dbURI)
.then((res) => {
    app.listen(4000)
    console.log("connected to db")
})
.catch((res) => console.log("not connected"))



app.post('/addinvoice', (req, res) => {
    console.log("got invoice posh")

    var total = 0;
    for(let i=0; i<req.body.item_list.length; i++) {
        total = total + (req.body.item_list[i].price * req.body.item_list[i].quantity)
    }
    const invoice = new Invoice ({
        owner: req.body.owner,
        id: req.body.id,
        status: req.body.status,
        street_address: req.body.street_address,
        city: req.body.city,
        post_code: req.body.post_code,
        country: req.body.country,
        clients_name: req.body.clients_name,
        clients_email: req.body.clients_email,
        client_street_address: req.body.client_street_address,
        clients_city: req.body.clients_city,
        clients_post_code: req.body.clients_post_code,
        clients_country: req.body.clients_country,
        invoiceDate: req.body.invoiceDate,
        payments_terms: "Direct",
        project_desc: req.body.project_desc,
        total_value: total,
        item_list: req.body.item_list
    });

    invoice.save().then((result)=> {
        res.send(result)
    }).catch((err)=> console.log(err))
})

app.post('/adduser', (req, res) => {
    console.log(req.body.username)
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name,
        street_address: "",
        city: "",
        post_code: "",
        country: "",
        profile_pic: ""
    })

    user.save().then((result)=> {
        res.send(result)
    }).catch((err)=> console.log(err))
})

app.get('/users', (req, res) => {
    User.find()
    .then((data) => res.send(data))
    .catch((err)=> console.log(err))
   
})

app.get('/invoices', (req, res) => {
    const id = req.params.id;
    Invoice.find().sort({date: 1})
    .then((data) => {
        res.send(data)
    })   
    .catch((err)=> console.log(err))
})

app.post('/deleteinvoice', (req, res) => {
    Invoice.deleteOne({id: req.body.id})
    .then((val) => console.log(val))
})

app.post('/updatestatus', (req,res) => {
    console.log(req.body.id)
    Invoice.updateOne({id: req.body.id},{
        $set: { status: req.body.status}})
        .then(val => console.log(val))
        .catch((err) => console.log(err))
})

app.post('/updateinvoice', (req,res) => {
    console.log(req.body.project_desc)
    Invoice.updateOne({id: req.body.id},{
        $set: {
            street_address: req.body.street_address,
            city: req.body.city,
            post_code: req.body.post_code,
            country: req.body.country,
            clients_name: req.body.clients_name,
            clients_email: req.body.clients_email,
            clients_street_address: req.body.clients_street_address,
            clients_city: req.body.clients_city,
            clients_post_code: req.body.clients_post_code,
            clients_country: req.body.clients_country,
            invoiceDate: req.body.invoiceDate,
            payments_terms: req.body.payments_terms,
            project_desc: req.body.project_desc,
            total_value: req.body.total_value,
            item_list: req.body.item_list
            }})
        .then(val => console.log(val))
        .catch((err) => console.log(err))
})

app.post('/updateuser', (req,res) => {
    console.log(req.body.name)
    User.updateOne({_id: req.body.id},{
        $set: {
            street_address: req.body.street_address,
            city: req.body.city,
            post_code: req.body.post_code,
            country: req.body.country,
            password: req.body.password,
            email: req.body.email,
            name: req.body.name,
            profile_pic: req.body.profile_pic
            }})
        .then(val => console.log(val))
        .catch((err) => console.log(err))
})



    
