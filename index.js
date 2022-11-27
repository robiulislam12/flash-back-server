// External import
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// Create a app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json())

// database connection
const uri = `mongodb://localhost:27017`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        const database = client.db('flashBack');
        const usersCollection = database.collection('users');

        /**
         * Here all is users routes
         * get users
         * app.post()
         * delete users
         */

        // get all users
        app.get('/users', async(req, res) =>{
            const users = await usersCollection.find({}).toArray();
            res.send(users)
        })

        // Create a users
        app.post('/user', async(req, res)=>{
            const user = req.body;
            const addUser = await usersCollection.insertOne(user);
            res.send(addUser)
        })

        // delete a user
        app.delete('/user/:id', async(req, res) =>{
            const {id} = req.params;
            const filter = {_id : ObjectId(id)}
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })
    }
    finally{

    }
}


run().catch(err => console.log(err.message))

// Routes
app.get("/health", (req, res) => {
  res.json({ message: "Server health is good" });
});
app.get('/', (req, res) =>{
    res.send("<h1>Flash Back server is running</h1>")
})

// App listen on http://localhost:5000
app.listen(port, () => {
  console.log("server is running on port", port);
});