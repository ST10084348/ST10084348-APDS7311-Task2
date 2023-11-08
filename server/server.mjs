
import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs"; //Adding references to the record file
import users from "./routes/user.mjs";  //Adding references to the user file
import https from "https";
import http from "http";
import jwt from "jsonwebtoken"; //Add
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.PRIVAT_KEY;
const cert = process.env.CERT;
console.log(cert + " CERT AND KEY " + key)

const options = {
  key: fs.readFileSync(key),
  cert: fs.readFileSync(cert),
}

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use((reg,res,next)=>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');//'Origin,X-Requested-With,ContentType,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
})

app.use("/user", users);
app.use("/record", records);

let server = http.createServer(app) //removed s in http and options

app.get('/record',(req,res)=>{
  console.log(res)
  //res.send('HTTPS in ExpressJS')
})

app.get('/',(req,res)=>{
  res.send('HTTPS in ExpressJS')
})

// start the Express server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

