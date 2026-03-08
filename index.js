const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const cors = require('cors')
app.use(cors())
app.use(express.json({limit:'50mb'}))
const path = require('path')

//routes
const userRoute = require('./routes/user.route.js')
app.use('/user', userRoute)

const productRoute = require('./routes/product.route.js')
app.use('/product', productRoute)

const orderRoute = require('./routes/order.route.js')
app.use('/order', orderRoute)

const reviewRoute = require('./routes/review.route.js')
app.use('/review', reviewRoute)

const messageRoute = require('./routes/message.route.js')
app.use('/message', messageRoute)

const adminRoute = require('./routes/admin.route.js')
app.use('/admin', adminRoute)

const notificationRoute = require('./routes/notification.route.js')
app.use('/notification', notificationRoute)

const URI = process.env.DATABASE_URI
mongoose.connect(URI)
.then(()=>{
    console.log('connected to database successfully')
})
.catch((err)=>{
    console.log(err)
})







app.get('/', (req, res)=>{
    console.log(__dirname, '../views/email-templates/welcome-email.ejs')
    let filePath = path.join(__dirname, '../views/email-templates/welcome-email.ejs')
    console.log(filePath)
    res.send('application working perfectly')
})







let port = process.env.PORT
app.listen(port, (err)=>{
    if(err){
        console.log('server cannot start now')
    }else{
        console.log('server started successfully')
    }
})



