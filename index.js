const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port =process.env.PORT || 5055;
// console.log(process.env.DB_USER);

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7m4gn.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("martOrganic").collection("product");
  const orderCollection = client.db("martOrganic").collection("order");


  app.get('/products',(req,res)=>{
    productCollection.find()
    .toArray((err,items)=>{
      res.send(items)
      // console.log('from database',items);
    })
  })
  app.get('/products/:id',(req,res)=>{
    productCollection.find({id: req.params.id})
    .toArray((err,items)=>{
      res.send(items)
      // console.log('from database',items);
    })
  })


  app.post('/addProduct',(req,res)=>{
    const newProduct =req.body;
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count:',result.insertedCount)
      res.send(result.insertedCount>0)
    })
    // console.log('adding new product', newProduct);
  })
  app.post('/addOrder',(req,res)=>{
    const order =req.body;
    orderCollection.insertOne(order)
    .then(result => {
      console.log('inserted count:',result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })
  app.get('/orders',(req,res)=>{
    orderCollection.find()
    .toArray((err,items)=>{
      res.send(items)
      // console.log('from database',items);
    })
  })

  // perform actions on the collection object
  console.log('db connected');
  // client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)