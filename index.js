const express=require('express');
require('dotenv').config();
const cors =require('cors');

const app=express()
const port=process.env.PORT||5000
// const api=
app.use(express.json())
app.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
    await client.connect();
   
const myDB2 = client.db("myDB2");
const myColl = myDB2.collection("collfreelancing");

app.post('/allJobs',async(req,res)=>{
    const jobs=req.body;
       const jobsToInsert = jobs.map(job => ({
      ...job,
      _id: new ObjectId(job._id),
      created_At: new Date(job.created_At)
    }));

    const result = await myColl.insertMany(jobsToInsert);
    res.send(result)
})
app.post('/addJobs', async(req,res)=>{
   const jobs = {
    ...req.body,
    created_At: new Date(req.body.created_At) // convert to Date object
  };
  const result=await myColl.insertOne(jobs)
  res.send(result)
})

app.get('/addJobs',async(req,res)=>{
  const cursor=myColl.find()
  const result=await cursor.toArray()
  res.send(result)
})
app.get('/allJobs/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const result=await myColl.findOne(query)
  
  res.send(result)
})

app.get('/allJobsmy', async (req, res) => {
  try {
    console.log("req.query:", req.query);

    const email = req.query.email || req.query.userEmail;
    const query = {};

    if (email) {
      query.userEmail = email;
    }

    const result = await myColl.find(query).toArray();
 
    res.send(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get('/allJobs', async(req, res) => {
  const sortOrder = req.query.sort === 'asc' ? 1 : -1;

    const cursor = myColl.find().sort({ created_At: sortOrder });
    const result=await cursor.toArray();
    res.send(result)
})

app.get('/recentJobs',async(req,res)=>{
    const cursor= myColl.find().sort({created_At:-1}).limit(6);
    const result=await cursor.toArray();
    res.send(result)
  }
)
app.delete('/allJobs/:id',async (req,res)=>{
  const id=req.params.id
  const query={_id: new ObjectId(id)}
  const result=await myColl.deleteOne(query)
  res.send(result)
})

app.patch('/allJobs/:id',async(req,res)=>{
  const id=req.params.id;
  const updatedProduct=req.body;
  const query={_id:new ObjectId(id)}
  const update={
   $set:{
    title:updatedProduct.title,
    category:updatedProduct.category,
    coverImage:updatedProduct.coverImage,
    summury:updatedProduct.summury,
   }
  }
  const result=await myColl.updateOne(query,update)
  res.send(result)
})

    await client.db("DBsmart").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
   finally {
   
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})