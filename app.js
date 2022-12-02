const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/bit-burger");
}
main().then(() => console.log("Connected to db"));
main().catch((err) => console.log("AN ERROR!", err));

app.listen(3000, () => console.log("listening on port 3000"));
