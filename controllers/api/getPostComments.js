const Comment=require('../../models/Comment')
const getPostComment=async(req, res)=>{
    const postId=req.postId
    const foundComments=await Comment.find({postId}).sort({updatedAt:-1}).exec()
    return res.json({foundComments})
}
module.exports=getPostComment