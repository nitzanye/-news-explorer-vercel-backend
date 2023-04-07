require("dotenv").config();

const mongoose = require("mongoose");

const dbName = "test";
const password = process.env.MONGO_ATLAS_PASSWORD;

const uri = `mongodb+srv://ADMIN:${password}@cluster0.5ksyjkb.mongodb.net/${dbName}`;
mongoose.connect(uri);
