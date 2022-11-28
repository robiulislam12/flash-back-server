// External import
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// Create a app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb://localhost:27017`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("flashBack");
    const usersCollection = database.collection("users");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const reportedItemsCollection = database.collection("reportedItems");
    const advertiseItemsCollection = database.collection("advertiseItems");

    /**
     * Here all is users routes
     * get users
     * app.post()
     * delete users
     */

    // get all users
    app.get("/users", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    // update verify
    app.post("/userUpdate", async (req, res) => {
      const filter = { email: req.query.email };
      const updateDoc = {
        $set: {
          verified: true,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Create a users
    app.post("/user", async (req, res) => {
      const user = req.body;
      const addUser = await usersCollection.insertOne(user);
      res.send(addUser);
    });

    // delete a user
    app.delete("/user/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });

    /**
     * @products_route
     * get all
     * create a product
     * delete a product
     * report a product
     * get all reported items
     * advertise a product
     */
    // get all products
    app.get("/products", async (req, res) => {
      let query = {};

      if(req.query.email){
        query = {
            sellerEmail: req.query.email
        }
      }
      if(req.query.category){
        query = {
          category : req.query.category
        }
      }

      const users = await productsCollection.find(query).toArray();
      res.send(users);
    });
    // create a products
    app.post("/product", async (req, res) => {
      const productDetails = req.body;
      const result = await productsCollection.insertOne(productDetails);
      res.send(result);
    });

    // Delete a product
    app.delete("/product/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(filter);
      res.send(result);
    });

      // get reported items
      app.get('/reportedItems', async(req, res) =>{
        let query = {};
        if(req.query.reportedId) {
          query= {
            reportedProductId : req.query.reportedId
          }
        }
        const result = await reportedItemsCollection.find(query).toArray();
        res.send(result)
      })

    // Report a Product
    app.post('/reportedItem', async(req, res) =>{
      const reportedDetails = req.body;
      // console.log(reportedDetails)
      const result = await reportedItemsCollection.insertOne(reportedDetails);
      res.send(result)
    })

     // get advertisement items
     app.get('/advertisementItems', async(req, res) =>{
      let query = {};
      if(req.query.productId) {
        query= {
          productId : req.query.productId
        }
      }
      const result = await advertiseItemsCollection.find(query).toArray();
      res.send(result)
    })

    // advertise a product
    app.post('/advertiseItem', async(req, res) =>{
      const advertiseDetails = req.body;
      const result = await advertiseItemsCollection.insertOne(advertiseDetails);
      res.send(result)
    })

    /**
     * @order_route
     * post a booking
     */
    // get all orders
    app.get('/orders', async(req, res) =>{
      let query = {};
      if(req.query.email) {
        query= {
          buyerEmail : req.query.email
        }
      }
      const result = await ordersCollection.find(query).toArray();
      res.send(result)
    })

    // post a order
    app.post('/buy', async(req, res) =>{
      const orderDetails = req.body;
      const order = await ordersCollection.insertOne(orderDetails);
      res.send(order) 
    })
  

  } finally {
  }
}

run().catch((err) => console.log(err.message));

// Routes
app.get("/health", (req, res) => {
  res.json({ message: "Server health is good" });
});
app.get("/", (req, res) => {
  res.send("<h1>Flash Back server is running</h1>");
});

// App listen on http://localhost:5000
app.listen(port, () => {
  console.log("server is running on port", port);
});
