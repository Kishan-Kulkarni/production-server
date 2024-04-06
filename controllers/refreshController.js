const jwt=require('jsonwebtoken')
const User = require('../models/User')

const refreshController=async (req,res)=>{
    const cookie=req.cookies
    if(!cookie?.jwt){
        return res.sendStatus(401)
    }
    const refreshToken=cookie.jwt
    res.clearCookie('jwt', {httpOnly:true, sameSite:'None', secure:true})
    const foundUser=await User.findOne({refreshToken}).exec()
    if(!foundUser){
        jwt.verify(refreshToken, process.env.REFRESHTOKENSECTRET, async (err, decoded)=>{
            if(err) return res.sendStatus(403)
            const hacked=await User.findOne({name:decoded.userName}).exec()
            hacked.refreshToken=[]
            const result=await hacked.save()
        })
        return res.sendStatus(403)
    }
    const newRefreshTokenArray=foundUser.refreshToken.filter(rt=>rt!==refreshToken)
    jwt.verify(refreshToken, process.env.REFRESHTOKENSECTRET, async (err, decoded)=>{
        if(err){
            foundUser.refreshToken=[...newRefreshTokenArray]
            const result=await foundUser.save()
        }
        if(err || foundUser.name!==decoded.userName) return res.sendStatus(403)
        const accessToken=jwt.sign(
            {userName:foundUser.name},
            process.env.ACCESSTOKENSECTRET,
            {expiresIn:'10m'}
        )
        const newRefreshToken=jwt.sign(
            {userName:foundUser.name},
            process.env.REFRESHTOKENSECTRET,
            {expiresIn:'1d'}
        )
        foundUser.refreshToken=[...newRefreshTokenArray, newRefreshToken]
        const result=await foundUser.save()
        res.cookie('jwt' ,newRefreshToken,{httpOnly:true, sameSite:'None', secure:true, maxAge:24*60*60*1000})
        return res.status(200).json({accessToken})
    })
}
module.exports=refreshController