const router=require('express').Router()
const multer= require('multer')
const path=require('path')
const File=require('../models/file')
const {v4:uuid4}=require('uuid')


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{cb(null,'uploads/')},
    filename:(req,file,cb)=>{
        const uniquename= `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null,uniquename)
    }
})

const upload =multer({
    storage:storage,
    limits:{fileSize:1000000*100}
}).single('myfile')

router.post('/',(req,res)=>{
    upload(req,res,async(err)=>{
        if(err){
            return res.status(500).send('error:err.message')
        }
        const file=new File({
            filename:req.file.filename,
            path:req.file.path,
            size:req.file.size,
            uuid:uuid4(),
        })

        const response= await file.save()
        res.send({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`})
    })

})

router.post('/send',async(req,res)=>{
    const {uuid,mailto,mailfrom}=req.body
    if(!uuid || !mailto || !mailfrom){
        return res.send({error:'all fields required'})
    }
    const file=await File.findOne({uuid:uuid})
    if(file.sender){
        return res.send({info:'mail already sent'})
    }
    file.sender=mailfrom
    file.reciever=mailto
    const response = await file.save()
    
    const Sendmail= require('../services/mailservice')
    Sendmail({
        from:mailfrom,
        to:mailto,
        text:`itShare mail from ${mailfrom}`,
        subject:`${mailto} has shared a mail with you`,
        html:require('../services/emailtemplate')({
            emailFrom:mailfrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/down/${file.uuid}`,
            size:parseInt(file.size/1000)+'kb',
            expires: '24 hours'
        })
    }).then(()=>{
        res.send({success:true})
    }).catch(err=>{
        res.send({error:err.message})})
    
})
module.exports=router