const express=require('express') 
const router=express.Router()
const {uploads}=require('../middleware/multerMiddleware')
const handleCreateListing = require('../controllers/api/createListingHandler')
router.post('/',uploads.array('file'), handleCreateListing) 
module.exports=router