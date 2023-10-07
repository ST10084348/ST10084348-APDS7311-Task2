import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs"; //Don't forget to add the references to the record file
import users from "./routes/user.mjs";  //Don't forget to add the references to the user file
import https from "https";
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

app.use("/user", users);
app.use("/record", records);

let server = https.createServer(options,app)

app.get('/',(req,res)=>{
  res.send('HTTPS in ExpressJS')
})
// start the Express server
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});