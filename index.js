const express = require("express")
const cors = require("cors")

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require("express");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



//O6hJ3yANoZV5HKzG
//CarToysDB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cqf2amb.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)

        client.connect((error) => {
            if (error) {
                console.error(error);
                return;
            }
        });



        const allToysCollection = client.db('ToysDB').collection('Toys');



        const indexKeys = { name: 1 };
        const indexOptions = { name: "price" };
        allToysCollection.createIndex(indexKeys, indexOptions)


        app.get('/toySearch/:text', async (req, res) => {
            const toySearch = req.params.text;
            const result = await allToysCollection.find({ name: { $regex: toySearch, $options: "i" } }).toArray();
            res.send(result);
        })



        app.get('/allToys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = {
                    saller_email: req.query.email
                }
            }
            const result = await allToysCollection.find(query).sort({ price: 1 }).limit(20).toArray();
            res.send(result)

        })





        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id
            console.log(req.params.id);
            const query = { _id: new ObjectId(id) }
            const result = await allToysCollection.findOne(query)
            res.send(result)
        })



        // app.get('/categories', async (req, res) => {
        //     const category = req.query.category
        //     const query = { subCategory: category };
        //     const result = await allAnimalToysCollection.find(query).toArray()
        //     res.send(result)
        // })



        app.get('/categories', async (req, res) => {
            const textCategory = req.query.category
            const query = { subcategory: textCategory };
            const result = await allToysCollection.find(query).toArray()
            res.send(result)
        })


        app.post('/addedToys', async (req, res) => {
            const addedToy = req.body;
            console.log(addedToy)
            const result = await allToysCollection.insertOne(addedToy);
            res.send(result);
        })

        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id
            console.log(req.params.id);
            const query = { _id: new ObjectId(id) }
            const result = await allToysCollection.findOne(query)
            res.send(result)
        })


        app.put('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const toy = req.body;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedToy = {
                $set: {
                    price: toy.price,
                    quantity: toy.quantity,
                    // description: toy.description
                }
            }
            const result = await allToysCollection.updateOne(filter, updatedToy, option)
            res.send(result)
        })


        app.delete('/alltoys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await allToysCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running kids zone')
}),



    app.listen(port, () => {
        console.log(`running on port ${port}`);
    })