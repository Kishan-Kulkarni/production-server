const s3=require('../../config/s3Config')
const fs=require('fs')
const fsPromises=fs.promises
const User=require('../../models/User')
const Post=require('../../models/Post')
const bucketName=process.env.AWS_BUCKET_NAME
const submit=(file)=>{
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}
const handleCreateListing=async (req, res)=>{
    const files=req.files
    const paths=[]
    if(files){
        for(let i=0; i<files.length; i++){
            const result=await submit(files[i])
            paths.push(result.Key)
            await fsPromises.unlink(files[i].path)
        }
    }
    const {username, name, description , address, sell, parking, furnished, offer, beds, bath, price, offerPrice}=req.body
    const foundUser=await User.findOne({name:username}).exec()
    let result=0;
    if(!foundUser){
        return res.status(400).send(`The username ${username} was not found`)
    }
    if(offer){
      result=await Post.create({
            userId:foundUser._id,
            name,
            description,
            address,
            sell,
            parking,
            furnished,
            offer:true,
            beds,
            bath, 
            price,
            offerPrice,
            pictureURLs:paths
        })
    }else{
      result=await Post.create({
            userId:foundUser._id,
            name,
            description,
            address,
            sell,
            parking,
            furnished,
            offer:false,
            beds,
            bath, 
            price,
            pictureURLs:paths
        })
    }
    res.status(200).json({result})
}

module.exports=handleCreateListing