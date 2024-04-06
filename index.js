require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const cookieParser=require('cookie-parser')
const credentials=require('./middleware/credentials')
const connectMongoose =require('./config/mongooseConnection')
const app=express()
connectMongoose()
const corsOptions=require('./config/corsOptions')
const verifyJWT=require('./middleware/verifyJWT')
app.use(credentials)
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
 
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)
app.use('/popular', require('./routes/homePage'))
app.use('/create-listing', require('./routes/createListing'))
app.use('/post', require('./routes/post'))
app.use('/search', require('./routes/search'))
app.use('/user', require('./routes/user'))
app.use('/comment', require('./routes/comments'))

app.all('*', (req,res)=>{
    res.send(404).send('This route does not exist.')
})
mongoose.connection.on('connected', ()=>{
    const PORT=process.env.PORT || 3000
    app.listen(PORT, ()=>{
        console.log('Server started')
    })
})