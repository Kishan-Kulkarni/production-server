const multer=require('multer')
const path=require('path')
const uploads = multer({ dest: path.join(__dirname, '..', 'uploads/') })
const userPicture=multer({dest:path.join(__dirname, '..', 'user/')})
module.exports={uploads, userPicture}