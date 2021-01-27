const {db} = require('../firebase')
const nodemailer = require('nodemailer')
const express = require('express')
const hbs = require('nodemailer-express-handlebars')

const ID_OBRA='1610679134'

const app = express()

const obtenerDataObraUnoEntrada = async () => {
  console.log('entro')
  let data = []
  let email = ''
  let nameObra = ''
    await db.ref('/obras/'+ ID_OBRA).once('value',function(snapshot){
        if(snapshot.exists()){
            console.log('entro')
            email = snapshot.val().reportemail
            nameObra = snapshot.val().name
            console.log(email)
        }else{
            console.log('error')

            return null
        }
    })

    await db.ref('/obras/'+ ID_OBRA).child('asistencia').orderByKey().limitToLast(1).once('value',function(snapshot){
        if(snapshot.exists()){
            console.log('entro')
            snapshot.forEach(
                function(ChildSnapshot){
                    const datafor = ChildSnapshot.val()
                    console.log(datafor)
                    data = Object.values(datafor)
                    envioEmailObraUno(data,email,nameObra)
                    // envioEmail()
              }
            ) 
        }else{
            console.log('error')

            return null
        }

    })
}

const envioEmailObraUno = async(data,email,nameObra) => {
    let mes = new Date().getMonth() + 1
    if(mes < 10){
        mes = `0${mes}`
    }
    let dia = new Date().getDate()
    if(dia < 10){
        dia = `0${dia}`
    }
    let year = new Date().getFullYear()
    let diaString = `${dia}/${mes}/${year}`
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime / 1000)

    app.use(express.static(__dirname + "/views"));
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
        console.log('ready')
    }).catch(ex => {
        console.log('ex',ex)
    })

    transporter.use(
        "compile",
        hbs({
          viewEngine: {
            extname: ".hbs",
            layoutsDir: "views/emails",
            defaultLayout: "Prueba",
            partialsDir: "views/emails",
          },
          viewPath: "views/emails",
          extName: ".hbs",
        })
      );


    let emailOption ={
        from:'Reporte de entrada gerardoquispe65@gmail.com',
        to: `gerardoquispe65@gmail.com,${email}`,
        subject:`${timestamp} - REPORTE DE ASISTENCIA DE ENTRADA  ${nameObra} `,
        template:'Prueba',
        context:{
            data: data,
            nameObra:nameObra,
            diaString:diaString
        }
    } 
    await transporter.sendMail(
        emailOption,
        function(err,info) {
            if(err){
                console.log('errorada',err)
                return false
            }else{
                console.log(info.response)
            }
        }
    )
}

const obtenerHoraEntrada = async () => {
    let horaEntrada = ''
    let minutoEntrada = ''
    await db.ref('/obras/'+ ID_OBRA).once('value',function(snapshot){
        if(snapshot.exists()){
            const horaBD = snapshot.val().timestart
            const ArrayHora = horaBD.split(':')
            horaEntrada = parseInt(ArrayHora[0])
            minutoEntrada = parseInt(ArrayHora[1])
        }else{
            console.log('error')

            return null
        }
    })
    return {
        horaEntrada,
        minutoEntrada
    }
}

module.exports={
    obtenerDataObraUnoEntrada,
    obtenerHoraEntrada
}
