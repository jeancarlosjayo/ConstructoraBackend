const  express = require('express')
const nodemailer = require('nodemailer')
const cron = require('node-cron');
const { obtenerDataObraUnoEntrada,obtenerHoraEntrada } = require('./obras/obreUno');
const app = express()




app.listen(3000, async ()=>{

    let hora = 0
    await obtenerHoraEntrada().then(res => {
        hora = res.horaEntrada + 5
        minuto = res.minutoEntrada
        console.log(hora)
        console.log(minuto)
    })
    
    cron.schedule(`${minuto} ${hora} * * *`,() => {
        obtenerDataObraUnoEntrada()
    })

    cron.schedule(`${minuto} 5 * * *`,() => {
        obtenerDataObraUnoEntrada()
    })

    cron.schedule(`${minuto} 7 * * *`,() => {
        obtenerDataObraUnoEntrada()
    })

 
    // cron.schedule(' 0 0/10 * * *',() => {
    //     envioEmail()
    // })

    
    
})