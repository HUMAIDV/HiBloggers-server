import express from 'express';
import mongoose from 'mongoose';
import { PORT } from './config.js';
import { MongoDBUrl } from './config.js';
import cors from 'cors'
import { PostMod } from './Models/PostModel.js';
import router from './Routes/PostRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// --------------------------------------------------------------------------------------->

const app = express();

app.use(cors())
app.use(express.json())
app.use("/posts", router)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --------------------------------------------------------------------------------------->

// MongoDB Connection

mongoose
    .connect(MongoDBUrl)
    .then(() => {
        console.log("App connected to database")
    })
    .catch((error) => {
        console.log(error)
    });
// --------------------------------------------------------------------------------------->


// Endpoint

app.get('/', (req,res) => {
    return res.status(200).send("Welcome to BlogProject")
})


// --------------------------------------------------------------------------------------->

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});