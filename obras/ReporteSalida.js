const {db} = require('../firebase')
const nodemailer = require('nodemailer') 
const express = require('express')
const hbs = require('nodemailer-express-handlebars')
const { fechaDehoy , fechaTimeStamp} = require('../helpers/Fechas')
const app = express()

const ReporteSalidaObras = async () => {
    await db.ref('/obras').once('value',function(snapshot){
        if(snapshot.exists()){
            const newObject = snapshot.val()
            for(const item in newObject){
                console.log(item)
                obtenerHoraSalida(item).then(res => {
                    const hora = (res.horaSalida ).toString()      
                    const minuto = (res.minutoSalida).toString()       
                    const horaActual = new Date().getHours()       
                    const minutoActual = new Date().getMinutes()      
                    const horarioActual = `${horaActual}:${minutoActual}`      
                    const horaFirebsae = `${hora}:${minuto}`      
                    if(horarioActual === horaFirebsae){
                        console.log('envio email hora salida')
                        obtenerDataObraUnoSalida(item)
                    }
        
                }).catch(ex => {
                    console.log('error',ex)
                })
            }

        }else{
            console.log('error')

            return null
        }
    })
}

const obtenerHoraSalida = async (ID_OBRA) => {
    let horaSalida = ''
    let minutoSalida = ''
    await db.ref('/obras/'+ ID_OBRA).once('value',function(snapshot){
        if(snapshot.exists()){
            const horaBD = snapshot.val().timefinish
            const ArrayHora = horaBD.split(':')
            horaSalida = parseInt(ArrayHora[0])
            minutoSalida = parseInt(ArrayHora[1])
        }else{
            console.log('error')

            return null
        }
    })
    return {
        horaSalida,
        minutoSalida
    }
}

const obtenerDataObraUnoSalida = async (ID_OBRA) => {
    console.log('entro salida ')
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
                  snapshot.forEach(
                      function(ChildSnapshot){
                          const timestamp  =  ChildSnapshot.key 
                          const fecha = new Date(timestamp*1000)
                          const fechaFirebase = fechaTimeStamp(fecha)
                          const fechaHoy = fechaDehoy()                       
                          const datafor = ChildSnapshot.val()
                          console.log(' asdsa datafor ',datafor)
                          data = Object.values(datafor)
                          if( fechaHoy === fechaFirebase){
                              console.log('envio de email')
                              envioEmailObraUnoSalida(data,email,nameObra,timestamp,ID_OBRA)
                          }
                    }
                  ) 
          }else{
              console.log('error')
  
              return null
          }
      })
  }

  const envioEmailObraUnoSalida = async(data,email,nameObra,timestamp,ID_OBRA) => {

    let codigosObra = `${ID_OBRA}-${timestamp}`
    
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
    const timestamp1 = Math.floor(dateTime / 1000)

    app.use(express.static(__dirname + "/views"));
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            //   user:'jeancarlosramirezjayo@gmail.com',
            //   user:'assistanceconstructorapp@gmail.com',
              user:'assistancecheck@gmail.com',
            //   pass:'ylpbdnskzhutpdix'
            //   pass:'pcdqsxluvxphbslw'
              pass:'tvzdkakgzzzyemqo'

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
            defaultLayout: "PruebaSalida",
            partialsDir: "views/emails",
          },
          viewPath: "views/emails",
          extName: ".hbs",
        })
      );


    let emailOptionSalida ={
        from:'Reporte de salida gerardoquispe65@gmail.com',
        to: `${email}`,
        subject:`${timestamp1} - REPORTE DE ASISTENCIA DE SALIDA  ${nameObra} `,
        template:'PruebaSalida',
        context:{
            data: data,
            nameObra:nameObra,
            diaString:diaString,
            link: codigosObra
        }
    } 
    await transporter.sendMail(
      emailOptionSalida,
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


  

module.exports = {
    ReporteSalidaObras
}

