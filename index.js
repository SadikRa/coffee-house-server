const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.NAME_DB}:${process.env.PASS_DB}@cluster0.ywq3nhp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const dataCollection = client.db('coffeeList').collection('coffee')


    app.post('/addCoffee', async(req, res) =>{
      const data = req.body;
      const result = await dataCollection.insertOne(data);
      res.send(result)
    } )

    app.get('/coffees', async(req, res) =>{
      const result = await dataCollection.find().toArray();
      res.send(result)
    })


    app.get('/coffees/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await dataCollection.findOne(query);
      res.send(result)
    })


    app.put('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedCoffee = req.body;

      const coffee = {
          $set: {
              name: updatedCoffee.name, 
              quantity: updatedCoffee.quantity, 
              supplier: updatedCoffee.supplier, 
              taste: updatedCoffee.taste, 
              category: updatedCoffee.category, 
              details: updatedCoffee.details, 
              photo: updatedCoffee.photo
          }
      }

      const result = await dataCollection.updateOne(filter, coffee, options);
      res.send(result);
  })

    app.delete('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await dataCollection.deleteOne(query);
      res.send(result)
    })
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req , res) =>{
    res.send('server is on')
})

app.listen(port , () =>{
    console.log(`server is on ${port}`)
})