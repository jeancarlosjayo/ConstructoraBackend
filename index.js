const  express = require('express')
const nodemailer = require('nodemailer')
const cron = require('node-cron');
const { obtenerDataObraUnoEntrada,obtenerHoraEntrada } = require('./obras/obreUno');
const app = express()




app.listen(3000, async ()=>{
    console.log('hola')
    // await obtenerHoraEntrada().then(res => {
    //     hora = res.horaEntrada 
    //     minuto = res.minutoEntrada
    //     console.log(hora)
    //     console.log(minuto)
    // })
    // console.log(hora)
    // console.log(minuto)

    // cron.schedule(`*/1 * * * * *`,async() => {
    //     console.log('entro al cron de 1 min')
    //     await obtenerHoraEntrada().then(res => {
    //         console.log('buscando hora ebntrada')
    //         const hora = (res.horaEntrada ).toString()
    //         const minuto = (res.minutoEntrada).toString()
    //         console.log('sad',hora)
    //         console.log(minuto)
    //         cron.schedule(`${minuto} ${hora} * * *`,() => {
    //             console.log('cron para el envio de email')
    //             obtenerDataObraUnoEntrada()
    //             console.log('entro')
    //         })
    //     }).catch(ex => {
    //         console.log(ex)
    //     })
    // })


    const prueba = async() => {
        await obtenerHoraEntrada().then(res => {
            console.log('buscando hora ebntrada')
            const hora = (res.horaEntrada ).toString()
            const minuto = (res.minutoEntrada).toString()
            console.log('sad',hora)
            console.log(minuto)
            const horaActual = new Date().getHours()
            const minutoActual = new Date().getMinutes()
            const horarioActual = `${horaActual}:${minutoActual}`
            const horaFirebsae = `${hora}:${minuto}`
            console.log('hora firebase',horaFirebsae)
            console.log('hora actual',horarioActual)
            console.log('coinciden',horarioActual === horaFirebsae)
            if(horarioActual === horaFirebsae){
                console.log('coincidieron las horas')
                obtenerDataObraUnoEntrada()
            }
        }).catch(ex => {
            console.log('error',ex)
        })
    }

    prueba()
    
    
    // cron.schedule(`${minuto} ${hora} * * *`,() => {
    //     obtenerDataObraUnoEntrada()
    // })

    // cron.schedule(`${minuto} 5 * * *`,() => {
    //     obtenerDataObraUnoEntrada()
    // })

    // cron.schedule(`${minuto} 7 * * *`,() => {
    //     obtenerDataObraUnoEntrada()
    // })

    // cron.schedule(`30 6 * * *`,() => {
    //     obtenerDataObraUnoEntrada()
    // })

    // cron.schedule(`38 6 * * *`,() => {
    //     obtenerDataObraUnoEntrada()
    // })

 
    // cron.schedule(' 0 0/10 * * *',() => {
    //     envioEmail()
    // })

    
    
})
