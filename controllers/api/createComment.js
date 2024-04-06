const Comment=require('../../models/Comment')
const createComment=async (req, res)=>{
    const {userId, postId, content}=req.body
    const result=await Comment.create({
        userId,
        postId,
        content
    })
    return res.status(204).send('Comment has been  created.')
}
module.exports=createComment