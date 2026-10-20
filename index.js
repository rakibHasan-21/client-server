import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";
import cors from "cors";
const app = express();
const PORT = 5000;

// console.log(process.env.DB_URI)
// Adds headers: Access-Control-Allow-Origin: *
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-j4kujpk-shard-00-00.borlllh.mongodb.net:27017,ac-j4kujpk-shard-00-01.borlllh.mongodb.net:27017,ac-j4kujpk-shard-00-02.borlllh.mongodb.net:27017/?ssl=true&replicaSet=atlas-85iobn-shard-0&authSource=admin`;
const client = new MongoClient(uri);
export async function ConnectToMongoDB() {
  try {
    await client.connect();
    console.log("connected to mongodb");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const content = await ConnectToMongoDB();
const db = content.db("simpleCarudDB");
const users = db.collection("users");

app.get("/", (req, res) => {
  res.send("hello express");
});

app.get("/users", async (req, res) => {
  const cursor = users.find({});
  const allUsers = await cursor.toArray();
  res.send(allUsers);
});
app.get("/users/:id", async(req, res) => {
  const id = req.params.id
  const qurey = {_id: new ObjectId(id)}
  const result = await users.findOne(qurey)
  console.log('result', result)
  res.send(result)
});

app.post("/users", async (req, res) => {
  const user = req.body;
  console.log(user);
  const result = await users.insertOne(user);
  res.send(result);
});

app.patch('/users/:id', async(req,res)=>{
  const id = req.params.id
  const upDate = req.body
  console.log("update id ", id , 'update body',  upDate)
  const filter = {
    _id:new ObjectId(id)
  }
  const UpdateDoc ={
    $set:{
      name: upDate.name,
      email:upDate.email
    }
  }
  const result = await users.updateOne(filter, UpdateDoc)
  res.send(result)
})
app.delete('/users/:id', async(req, res) =>{
  const id = req.params.id
  const qurey = {_id: new ObjectId(id)}
  const result = await users.deleteOne(qurey)
  res.send(result)
})
app.listen(PORT, () => {
  console.log(`server is rundaring ${PORT}`);
});
