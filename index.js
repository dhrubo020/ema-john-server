const express = require('express')
const app = express()
const port = 3001
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors())



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxpfd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("db_ema_john").collection("collection_ema_john");
    const orders_collection = client.db("db_ema_john").collection("orders");
    console.log("db connected")

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        collection.insertMany(products)
        .then(result =>{
            console.log(result.insertedCount)
            res.send(result.insertedCount)
        })
    })

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        collection.find( { key: { $in: productKeys } } )
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.get('/allProduct' , (req,res)=>{
        collection.find({}) // .limit(30)
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.get('/singleProduct/:key' , (req,res)=>{
        collection.find({key: req.params.key})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orders_collection.insertOne(order)
        .then(result =>{
            res.send(result.insertedCount > 0 )
        })
    })


    // app.delete('/delete', (req,res)=>{
    //     collection.deleteMany({})
    //     .then(result=>{
    //         res.send(deleteCounts > 0)
    //     })
    // })
});



app.get('/', (req, res) => {
    res.send('ema john backend!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
