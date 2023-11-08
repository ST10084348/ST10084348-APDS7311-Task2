import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import ExpressBrute  from "express-brute";
import jwt from "jsonwebtoken"; 

const router = express.Router();

var store = new ExpressBrute.MemoryStore(); // it locally stores the state  
var bruteforce = new ExpressBrute(store);

//Signup method
router.post("/signup", async (req, res) => {
  const password = bcrypt.hash(req.body.password,10)
  console.log(password, "STORED");
  let newDocument = {
    username: req.body.name, //changed
    password:(await password).toString(), 
  };

  let collection = await db.collection("users");
  let result = await collection.insertOne(newDocument);
  console.log(password);
  res.send(result).status(204);
 
});


//Login method
router.post("/login",bruteforce.prevent, async (req, res) => {
  let password ="";
 try {
  password = req.body.password;
  let collection = await db.collection("users");
  console.log(collection);
  let result = await collection.findOne({username:req.body.username});
  console.log("The user you asked for is " ,result);
  if(!result)
  {
      return res.status(401).json({ message: "Authentication failed" });
  }
  //check password
  console.log("Password from request" + password);
  console.log("Password from DB", result.password.toString());
  const passwordMatch = await bcrypt.compare(password.toString(),result.password.toString());

  
 if (!passwordMatch) {
  console.log("password / username doesn't match")
    return res.status(401).json({ message: "Authentication failed" });
 }

 else{
  const token = jwt.sign({username:req.body.username, password  : req.body.password},'this_secret_should_be_longer_than_it_is' ,{expiresIn:"1h"})
  console.log("your new token is", token)

  res.header("Authorization " + token);
  res.status(200).json({ message: "Authentication successful", token : token });
  return res.status(204).header(token)  //added
 }
// Auth success -> Send token 

} catch(error) {
  console.error("Login error:", error);
  res.status(500).json({ message: "Login failed" });
  res.send(token); 
}
});


// This section will help you update a user by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates =  {
    $set: {
      name: req.body.name,
      password: req.body.password
      
    }
  };

  let collection = await db.collection("users");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// This section will help you delete a user
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("users");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});

export default router;