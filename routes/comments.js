const express=require('express')
const router=express.Router()
const createComment=require('../controllers/api/createComment')
router.post('/', createComment)
module.exports=router