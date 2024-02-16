import express, { response } from 'express';
import { PostMod } from '../Models/PostModel.js';
import { AWS_BUCKET_NAME } from '../config.js';
import { AWS_ACCESS_KEY_ID } from '../config.js'
import { AWS_SECRET_ACCESS_KEY } from '../config.js';

// const upload = multer({dest: './uploads'})

import fs from 'fs';
import multer from 'multer';
import multerS3 from 'multer-s3';
import bodyParser from 'body-parser';

import AWS from 'aws-sdk';
import { S3Client } from "@aws-sdk/client-s3";
import env from 'dotenv'

const app = express();
app.use(bodyParser.json());

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID, 
    secretAccessKey: AWS_SECRET_ACCESS_KEY, 
});
const s3 = new AWS.S3();
const myBucket = AWS_BUCKET_NAME;

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: myBucket,
        region: "eu-north-1",
        // acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname);
        }
    })
});



//  const upload = multer({ storage: Storage});

// console.log(Object.getOwnPropertyNames(s3));


const router = express.Router();

router.post('/',upload.single('file'), async (req,res) => {

    const {originalname} = req.file;

    

    // const {originalname, path} = req.file;
    // const parts = originalname.split('.');
    // const ext = parts[parts.length - 1]
    // const newPath = path + '.' + ext;
    // fs.renameSync(path, newPath);

    const author = req.file;
    

    try {
        const {title, content, author} = req.body;
        const auth = author.split(',function () { [native code] }');
        const na = auth.toString();
        const newAuthor = na;
        const  newPost = {
            title,
            cover: originalname,
            content,
            author: newAuthor,
        }
        const post = await PostMod.create(newPost);
        return res.status(200).send(post)
    } catch (error) {
        console.log(error.message);        
        response.status(500).send({message: error.message})
    }
    
})

router.get('/', async (req,res) => {

    // var params = {Bucket: myBucket, Key: req.params.filename}
    // s3.getSignedUrl('getObject', params, function (err, url) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     res.send(url)
    // });
    try {

        const posts = await PostMod.find({})
                        .sort({createdAt: -1});
                        
        return res.status(200).json({
            count: posts.length,
            data: posts

        })
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})  

router.get('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const post = await PostMod.findById(id);
        return res.status(200).json(post) 
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message})
    }
})

router.put('/:id', upload.single('file'), async (req,res) => {

    const {originalname} = req.file;

    // const {originalname, path} = req.file;
    // const parts = originalname.split('.');
    // const ext = parts[parts.length - 1]
    // const newPath = path + '.' + ext;
    // fs.renameSync(path, newPath);

    try {
        const { id } = req.params;
        const {title, content} = req.body;
        const  newPost = {
            title,
            cover: originalname,
            content,
        }
        const post = await PostMod.findByIdAndUpdate(id, newPost);
        // return res.status(200).json(post) 

        if (!post) {
            return res.status(500).json({message: "Book not found"})
        }
        return res.status(200).json({post})
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message})
    }
})

router.delete('/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const post = await PostMod.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({message: "Book not found"})
        }
        return res.status(200).json({message: "Book deleted successfully!"})

    } catch (error) {
        console.log(error);
        res.status(501).send({message: error.message})
    }
})

export default router;