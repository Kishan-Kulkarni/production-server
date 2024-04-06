const mongoose=require('mongoose')
const Schema=mongoose.Schema
const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    userId:{
        type: Schema.ObjectId,
        required:true
    },
    postId:{
        type: Schema.ObjectId,
        required:true
    },
}, {timestamps:true})
const Comment=mongoose.model('Comment', commentSchema)
module.exports=Comment