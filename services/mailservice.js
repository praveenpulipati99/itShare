const nodemailer=require('nodemailer')

async function sendmail({to,from,subject,text,html}){
    let transporter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        security:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    })
    let info= await transporter.sendMail({
        to,from:`itShare <${from}>`,text,subject,html
    })
}

module.exports=sendmail