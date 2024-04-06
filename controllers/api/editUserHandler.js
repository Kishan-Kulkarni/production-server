const User=require('../../models/User')
const s3=require('../../config/s3Config')
const userBucket=process.env.USER_BUCKET_NAME
const bcrypt=require('bcrypt')
const submit=(file)=>{
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: userBucket,
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}
const editUserHandler=async (req, res)=>{
    const {userName}=req.body
    const foundUser=await User.findOne({name:userName}).exec()
    if(!foundUser){
        return res.staus(400).send('User not found')
    }
    const prevPath=foundUser.pictureURL
    const file=req.file
    let path=foundUser.pictureURL
    const {removeProfilePicture}=req.body
    if(removeProfilePicture){
        const result=await submit(file)
        path=result.Key
        const deleteParams={
            Bucket:userBucket,
            Key:prevPath
        }
        await s3.deleteObject(deleteParams).promise()
    }
    foundUser.pictureURL=path
    const newUserName=req.body.newUserName
    const newPassword=req.body.newPassword
    if(!newPassword || !newUserName){
        return res.status(400).send('Username and/or Password not found')
    }
    foundUser.name=newUserName
    const password=await bcrypt.hash(newPassword, 10)
    foundUser.password=password
    const result=await foundUser.save()
    return res.staus(201).send(`User ${userName} changed to ${result.name} successfully`)
}
module.exports=editUserHandler