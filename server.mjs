//laying the foundations for the server
import express from 'express';
import { MongoClient , ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
const server = express();
server.use(express.json());

//establishing the connection with the database
const uri = "mongodb+srv://moe_hasan:Ynmde&749@odyssey.phdeuh3.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri)
    .then((result) => server.listen(3000,() => {console.log("listening on localhost 3000...")}))
    .catch((err) => {console.log(err);})

//POST method
server.post('/users', (req,res) => {
    res.send("user created");
});

//GET method
server.get('/users', (req,res) => {
    res.send("user");
});

//PUT method
server.put('/users/:id', (req,res) => {
    const user_id = req.params;
    res.send("user updated");
});

//DELETE method
server.delete('/users/:id', (req,res) => {
    const user_id = req.params;
    res.send("user deleted");
})