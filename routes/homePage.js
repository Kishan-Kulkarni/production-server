const express=require('express')
const getPopularPosts = require('../controllers/api/getPopularPosts')
const router=express.Router()
router.get('/',getPopularPosts)
module.exports=router