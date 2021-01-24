const  express = require('express')
const nodemailer = require('nodemailer')
const cron = require('node-cron');

const app = express()

const envioEmail = async() => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user:'gerardoquispe65@gmail.com',
            pass:'dgubhaaendarolvo'
        },
      });

    transporter.verify().then(res => {
        console.log(res)
        console.log('ready')
    }).catch(ex => {
        console.log(ex)
    })

    await transporter.sendMail({
        from:'Envio email gerardoquispe65@gmail.com',
        to: 'jeancarlosramirezjayo@gmail.com,gerardoquispe65@gmail.com,gerardo.dondearchivo@outlook.com',
        subject:'ENvio de emai,',
        text:'Envio correcto de email 2021',
    })
}

app.listen(3000,()=>{
    console.log('servidor en 3000')
    cron.schedule(' 40 0 * * *',() => {
        envioEmail()
    })
})