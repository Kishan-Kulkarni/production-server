const express=require('express')
const registerController = require('../controllers/registerController')
const router=express.Router()
const {userPicture}=require('../middleware/multerMiddleware')
router.post('/',userPicture.single('user'), registerController)
module.exports=router