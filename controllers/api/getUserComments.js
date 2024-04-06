const Comment=require('../../models/Comment')
const getUserComments=async (req, res)=>{
    const {userId}=req.body
    const foundComments=await Comment.find({userId}).sort({updated:-1}).exec()
    return res.json({foundComments})
}
module.exports=getUserComments