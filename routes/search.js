const express=require('express')
const router=express.Router()
const getAllListing=require('../controllers/api/getAllListing')
router.get('/', getAllListing)
module.exports=router