require('dotenv').config()
const mongoose = require('mongoose')

//tTa9j0iRfrpXnuil

 function DBconnection(){
     mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:true,useUnifiedTopology:true})
     const connection=mongoose.connection

     connection.once('open',()=>{
         console.log('DB cloud connected')
     })
     .catch(err=>{ console.log("DB failed to connect")})
 }

 module.exports=DBconnection

 