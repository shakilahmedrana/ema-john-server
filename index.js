const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors')

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nmiww.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 5000;

app.get('/',(req,res)=>{
  res.send('hello from db its working')
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollections = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders")
//create
  app.post('/addProduct',(req,res)=>{
    const product = req.body
    productCollections.insertMany(product)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })
//red/load All Product
  app.get('/products',(req,res)=>{
    productCollections.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })
  //single DataLoad
  app.get('/product/:key', (req,res)=>{
    productCollections.find({key:req.params.key})
    .toArray((err,document)=>{
      res.send(document[0])
    })
  })
  //Multiple DataLoad
  app.post('/productsByKeys',(req,res)=>{
    const productsKeys = req.body;
    productCollections.find({key: {$in: productsKeys}})
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  app.post('/addOrders',(req, res)=>{
    const order = req.body
    ordersCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount > 0)
    })
  })
});


app.listen(process.env.PORT || port)