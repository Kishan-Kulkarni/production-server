const s3=require('../../config/s3Config')
const User=require('../../models/User')
const Post=require('../../models/Post')
const bucketName=process.env.AWS_BUCKET_NAME
const getFileStream= (key)=>{
    const downloadParams={
        Key:key,
        Bucket:bucketName
    }
    return s3.getObject(downloadParams).promise()
}
const getListingHandler=async(req, res)=>{
    const postId=req.params.postId

    const foundPost=await Post.findById(postId)
    if(!foundPost){
        return res.status(400).send('The post was not found')
    }
    foundPost.views=foundPost.views+1
    const result=await foundPost.save()
    const data=[]
    const path=foundPost.pictureURLs
    for(let i=0; i<path.length; i++){
        const curr=path[i]
        const readStream=await getFileStream(curr)
        data.push([...readStream.Body])
    }
    const foundUser=await User.findById(foundPost.userId).exec()
    return res.json({foundPost:{...foundPost._doc, userName:foundUser.name}, data})
}
module.exports=getListingHandler