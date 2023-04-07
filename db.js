require("dotenv").config();

const mongoose = require("mongoose");

const dbName = "NEW-EXPLORER-DB";
const password = process.env.MONGO_ATLAS_PASSWORD;

const uri = `mongodb+srv://ADMIN:${password}@cluster0.5ksyjkb.mongodb.net/${dbName}retryWrites=true&w=majority`;

mongoose.connect(uri);
