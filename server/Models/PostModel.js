import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
       
        title : {
            type: String,
            required: true
        },
        cover : {
            type: String,
            required: true
        },
        content : {
            type: String,
            required: true
        },
        author: {
            type: String,
        }

    }, 
    {
        timestamps : true
    },
    {
        typeKey: '$type'
    }
)

export const PostMod = mongoose.model('post', PostSchema)