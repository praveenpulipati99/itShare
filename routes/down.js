const router=require('express').Router()
const File=require('../models/file')
const path=require('path')
router.get('/:uuid',async(req,res)=>{
    try{
    const file= await File.findOne({uuid:req.params.uuid})
    if(!file){
        return res.render('download',{error:'no file found'})
    }
    return res.render('download',{
        filename:file.filename,
        uuid:file.uuid,
        size:file.size,
        downloadLink:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
    })

}catch(err){
        return res.render('download',{error:'file available but something wrong'})

    }
})
module.exports=router