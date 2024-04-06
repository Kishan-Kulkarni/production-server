const mongoose=require('mongoose')

const connectMongoose=async()=>{
    try {
        await mongoose.connect(process.env.MONGOURL)
    } catch (error) {
        console.log(error.message)
    }
}
module.exports=connectMongoose