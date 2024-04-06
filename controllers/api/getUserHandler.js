const User=require('../../models/User')
const s3=require('../../config/s3Config')
const userBucket=process.env.USER_BUCKET_NAME
const getFileStream= (key)=>{
    const downloadParams={
        Key:key,
        Bucket:userBucket
    }
    return s3.getObject(downloadParams).promise()
}
const getUserHandler=async (req, res)=>{
    const {userName}=req.body
    const foundUser=await User.findOne({name:userName}).exec()
    if(!foundUser){
        return res.status(400).send('The given user could not be found')
    }
    const readStream=await getFileStream(foundUser.pictureURL)
    return res.json({foundUser, image:readStream.Body})
}
module.exports=getUserHandler