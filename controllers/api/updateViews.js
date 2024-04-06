const Post=require('../../models/Post')
const updateViews=async (req, res)=>{
    const postId=req.params.postId
    const foundPost=await Post.findOne({_id:postId}).exec()
    foundPost.views=foundPost.views+1
    const result=await foundPost.save()
    return res.sendStatus(204)
}
module.exports=updateViews