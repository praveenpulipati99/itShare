const express = require('express')
const app = express()
const DBconnection=require('./config/db')
const cors=require('cors')
const path=require('path')
const corsOptions={
    origin:process.env.ALLOWED_CLIENTS.split(',')
}
app.use(express.static('public'))
app.set('views',path.join(__dirname,'/views'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cors(corsOptions))
DBconnection()
app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/down'))
app.use('/files/download',require('./routes/download'))


const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{ console.log(`listening at port ${PORT}`)})