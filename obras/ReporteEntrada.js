const {db} = require('../firebase')
const nodemailer = require('nodemailer') 
const express = require('express')
const hbs = require('nodemailer-express-handlebars')
const { fechaDehoy , fechaTimeStamp} = require('../helpers/Fechas')
const app = express()

const ReporteEntraObras = async() => {
    await db.ref('/obras').once('value',function(snapshot){
        console.log('entra a obras')
        if(snapshot.exists()){
            const newObject = snapshot.val()
            for(const item in newObject){
                console.log(item)
                obtenerHoraEntrada(item).then(res => {
                    const hora = (res.horaEntrada ).toString()
                    const minuto = (res.minutoEntrada).toString()
                    const horaActual = new Date().getHours()
                    const minutoActual = new Date().getMinutes()
                    const horarioActual = `${horaActual}:${minutoActual}`
                    const horaFirebsae = `${hora}:${minuto}`
                    if(horarioActual === horaFirebsae){
                        console.log('envio email hora entrada')
                        obtenerDataObraUnoEntrada(item)
                    }

                }).catch(ex => {

                })
            }

        }else{
            console.log('error')

            return null
        }
    })
}


const obtenerHoraEntrada = async (ID_OBRA) => {
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

const obtenerDataObraUnoEntrada = async (ID_OBRA) => {
    console.log('entro')
    let data = []
    let email = ''
    let emails = []
    let nameObra = ''
      await db.ref('/obras/'+ ID_OBRA).once('value',function(snapshot){
          if(snapshot.exists()){
              console.log('entro')
              email = snapshot.val().reportsemails
              if(email){
                for(const item of email){
                    if(item){
                        console.log('emails',item.email)
                        emails.push(item.email)
                    }
                }
              }
              console.log('adsadsadsads',emails)
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
                          console.log(fechaFirebase)
                          const fechaHoy = fechaDehoy() 
                          console.log(fechaHoy)                      
                          const datafor = ChildSnapshot.val()
                          console.log(' asdsa datafor ',datafor)
                          data = Object.values(datafor)
                          if( fechaHoy === fechaFirebase){
                              console.log('envio de email')
                              envioEmailObraUnoEntrada(data,emails,nameObra,timestamp,ID_OBRA)
                          }
                    }
                  ) 
          }else{
              console.log('error')
  
              return null
          }
  
      })
  }
  
  const envioEmailObraUnoEntrada = async(data,emails,nameObra,timestamp,ID_OBRA) => {
      console.log('enviaaaaaaaaaaaaaaaaaaaaaar',emails)
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
              defaultLayout: "Prueba",
              partialsDir: "views/emails",
            },
            viewPath: "views/emails",
            extName: ".hbs",
          })
        );
  
    if( emails !== []){

        emails.forEach((item) => {
            let emailOption ={
                from:'Reporte de entrada assistancecheck@gmail.com',
                to: `${item}`,
                subject:`${timestamp1} - REPORTE DE ASISTENCIA DE ENTRADA  ${nameObra} `,
                template:'Prueba',
                context:{
                    data: data,
                    nameObra:nameObra,
                    diaString:diaString,
                    tipo:'entrada',
                    link: codigosObra
                }
            } 
            transporter.sendMail(
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
        })
    
    }    
      
  }


module.exports = {
    ReporteEntraObras
}
