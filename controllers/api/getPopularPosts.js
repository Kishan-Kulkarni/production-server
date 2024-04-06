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
const getPopularPosts=async (req, res)=>{
    const foundPosts=await Post.find({}).sort({views:-1}).limit(3).exec()
    const data=[]
    for(let i=0; i<foundPosts.length; i++){
        const currPost=foundPosts[i]
        const currPicture=currPost.pictureURLs[0]
        const result=await getFileStream(currPicture)
        data.push([...result.Body])
    }
    const rentPosts=await Post.find({sell:false}).sort({views:-1}).limit(3).exec()
    const rentData=[]
    for(let i=0; i<foundPosts.length; i++){
        const currPost=foundPosts[i]
        const currPicture=currPost.pictureURLs[0]
        const result=await getFileStream(currPicture)
        rentData.push([...result.Body])
    }
    const sellPosts=await Post.find({sell:true}).sort({views:-1}).limit(3).exec()
    const sellData=[]
    for(let i=0; i<foundPosts.length; i++){
        const currPost=foundPosts[i]
        const currPicture=currPost.pictureURLs[0]
        const result=await getFileStream(currPicture)
        sellData.push([...result.Body])
    }
    return res.json({popularPosts:{posts:foundPosts, data:data}, rentPosts:{posts:rentPosts, data:rentData}, sellPosts:{posts:sellPosts, data:sellData}})
}
module.exports=getPopularPosts