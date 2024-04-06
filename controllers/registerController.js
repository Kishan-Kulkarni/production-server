const bcrypt=require('bcrypt')
const User=require('../models/User')
const s3=require('../config/s3Config')
const bucketName=process.env.USER_BUCKET_NAME
const fs=require('fs')
const fsPromises=fs.promises
const submit=(file)=>{
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}
const registerController=async (req, res)=>{
    const {userName, password}=req.body
    const file=req.file
    if(!userName || !password){
        return res.status(400).send('Username and Password required')
    }
    const foundUser=await User.findOne({name:userName}).exec()
    if(foundUser){
        return res.status(409).send('Duplicate Exists')
    }
    try {
        let path=''
        if(file){
            const result=await submit(file)
            path=result.Key
            await fsPromises.unlink(file.path)
        }
        const hash=await bcrypt.hash(password,10)
        const result=await User.create({
            name:userName,
            password:hash,
            pictureURL:path
        })
        return res.status(201).json({result})
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}
module.exports=registerController