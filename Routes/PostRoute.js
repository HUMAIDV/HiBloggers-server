import express, { response } from 'express';
import { PostMod } from '../Models/PostModel.js';

import fs from 'fs';
import multer from 'multer';
const upload = multer({dest: './uploads'})

const router = express.Router();

router.post('/',upload.single('file'), async (req,res) => {

    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1]
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const author = req.file;
    

    try {
        const {title, content, author} = req.body;
        const auth = author.split(',function () { [native code] }');
        const na = auth.toString();
        const newAuthor = na;
        const  newPost = {
            title,
            cover: newPath,
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

    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1]
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    try {
        const { id } = req.params;
        const {title, content} = req.body;
        const  newPost = {
            title,
            cover: newPath,
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