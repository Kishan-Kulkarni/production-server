const s3=require('../../config/s3Config')
const Post=require('../../models/Post')
const bucketName=process.env.AWS_BUCKET_NAME
const getFileStream= (key)=>{
    const downloadParams={
        Key:key,
        Bucket:bucketName
    }
    return s3.getObject(downloadParams).promise()
}
const getAllListings=async (req, res)=>{
    const {type, offer, furnished, parking}=req.query
    const {start}=req.body
    let foundPost;
    if(type==='all'){
        foundPost=await Post.find({offer, furnished, parking}).sort({views:-1}).skip(start).limit(10).exec()
    }else if(type==='sell'){
        foundPost=await Post.find({sell:true, offer, furnished, parking}).sort({views:-1}).skip(start).limit(10).exec()
    }else{
        foundPost=await Post.find({sell:false, offer, furnished, parking}).sort({views:-1}).skip(start).limit(10).exec()
    }
    const data=[]
    for(let i=0; i<foundPost.length; i++){
        const currPost=foundPost[i]
        const currPicture=currPost.pictureURLs[0]
        const result=await getFileStream(currPicture)
        data.push([...result.Body])
    }
    res.json({foundPost, data})
}
module.exports=getAllListings