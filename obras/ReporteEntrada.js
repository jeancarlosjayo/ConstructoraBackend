const {
    db
} = require('../firebase')
const nodemailer = require('nodemailer')
const express = require('express')
const hbs = require('nodemailer-express-handlebars')
const {
    fechaDehoy,
    fechaTimeStamp
} = require('../helpers/Fechas')
const app = express()


//Funcion que nos retorna las obras que existen en el nodo obras
const ReporteEntraObras = async () => {
    //Llamado a las obras
    await db.ref('/obras').once('value', function (snapshot) {
        console.log('entra a obras')
        if (snapshot.exists()) {
            //Recuparamos las obras
            const newObject = snapshot.val()
            for (const item in newObject) {
                console.log(item)
                //Por cada obra que se recorre obtendremos su hora para este caso la hora de entrada, se le pasa el id de la obra 
                obtenerHoraEntrada(item).then(res => {
                    const hora = (res.horaEntrada).toString()
                    const minuto = (res.minutoEntrada).toString()
                    const horaWeekend = (res.horaEntradaWeekend).toString()
                    const minutoWeekend = (res.minutoEntradaWeekend).toString()
                    const horaActual = new Date().getHours()
                    const minutoActual = new Date().getMinutes()
                    const horarioActual = `${horaActual}:${minutoActual}`
                    const horaFirebsae = `${hora}:${minuto}`
                    const horaFirebaseWeekend = `${horaWeekend}:${minutoWeekend}`
                    const day = new Date().getDay()
                    //Evaluamos si la hora actual es igual a la que la hora que tenemos en la BD
                    if((day === 6 || day === 0)){
                        if (horarioActual === horaFirebaseWeekend) {
                            console.log('envio email hora entrada')
                            //Funcion para obtener la data de esa obra en especifico, se le pasa el id de la obra
                            obtenerDataObraUnoEntrada(item)
                        }
                    }else{
                        if (horarioActual === horaFirebsae) {
                            console.log('envio email hora entrada')
                            //Funcion para obtener la data de esa obra en especifico, se le pasa el id de la obra
                            obtenerDataObraUnoEntrada(item)
                        }
                    }
                }).catch(ex => {

                })
            }

        } else {
            console.log('error')

            return null
        }
    })
}

//Funcion para obtener obra de entrada 
const obtenerHoraEntrada = async (ID_OBRA) => {
    let horaEntrada = ''
    let minutoEntrada = ''
    let horaEntradaWeekend = ''
    let minutoEntradaWeekend = ''
    //Llamado al nodo obras y a la obra en especifico
    await db.ref('/obras/' + ID_OBRA).once('value', function (snapshot) {
        if (snapshot.exists()) {
            const horaBD = snapshot.val().timestart
            const horaBDWeekend = snapshot.val().timestart2
            const ArrayHora = horaBD.split(':')
            horaEntrada = parseInt(ArrayHora[0])
            minutoEntrada = parseInt(ArrayHora[1])
            if(horaBDWeekend){
                const ArrayHoraWeekend = horaBDWeekend.split(':')
                horaEntradaWeekend = parseInt(ArrayHoraWeekend[0])
                minutoEntradaWeekend = parseInt(ArrayHoraWeekend[1])
            }
        } else {
            console.log('error')
            return null
        }
    })
    //se devuelve la hora de la BD
    return {
        horaEntrada,
        minutoEntrada,
        horaEntradaWeekend,
        minutoEntradaWeekend
    }
}

//Funcion para recuperar datos de la obra en especifico , recuperamos los emails y los datos de la asistencia
const obtenerDataObraUnoEntrada = async (ID_OBRA) => {
    console.log('entro')
    let data = []
    let email = ''
    let emails = []
    let nameObra = ''
    //Llamada para el recupero de emails asignados a la obra 
    await db.ref('/obras/' + ID_OBRA).once('value', function (snapshot) {
        if (snapshot.exists()) {
            console.log('entro')
            //Los emails 
            email = snapshot.val().reportsemails
            console.log('email', email)
            if (email) {
                const newemails = Object.values(email)
                //Se recorre el objeto emails 
                for (const item of newemails) {
                    console.log(item)
                    if (item) {
                        console.log('emails', item.email)
                        //Se agrega al arreglo vacio
                        emails.push(item.email)
                    }
                }
            }
            console.log('adsadsadsads', emails)
            //ademas obtenemos el nombre def la obra
            nameObra = snapshot.val().name
            console.log(email)
        } else {
            console.log('error')

            return null
        }
    })
    //Llamada para recuperar los datos de la asistencia de la obra, en si es la asistencia del ULTIMO DIA
    await db.ref('/obras/' + ID_OBRA).child('asistencia').orderByKey().limitToLast(1).once('value', function (snapshot) {
        if (snapshot.exists()) {
            snapshot.forEach(
                function (ChildSnapshot) {
                    const timestamp = ChildSnapshot.key
                    const fecha = new Date(timestamp * 1000)
                    const fechaFirebase = fechaTimeStamp(fecha)
                    console.log(fechaFirebase)
                    const fechaHoy = fechaDehoy()
                    console.log(fechaHoy)
                    const datafor = ChildSnapshot.val()
                    console.log(' asdsa datafor ', datafor)
                    data = Object.values(datafor)
                    //   data.sort(function (a, b) {
                    //     if (a.names > b.names) {
                    //       return 1;
                    //     }
                    //     if (a.names < b.names) {
                    //       return -1;
                    //     }
                    //     // a must be equal to b
                    //     return 0;
                    //   });
                    if (fechaHoy === fechaFirebase) {
                        console.log('envio de email')
                        envioEmailObraUnoEntrada(data, emails, nameObra, timestamp, ID_OBRA)
                    }
                }
            )
        } else {
            console.log('error')

            return null
        }

    })
}

const envioEmailObraUnoEntrada = async (data, emails, nameObra, timestamp, ID_OBRA) => {
    console.log('enviaaaaaaaaaaaaaaaaaaaaaar', emails)
    let codigosObra = `${ID_OBRA}-${timestamp}`

    let mes = new Date().getMonth() + 1
    if (mes < 10) {
        mes = `0${mes}`
    }
    let dia = new Date().getDate()
    if (dia < 10) {
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
            user: 'assistancecheck@gmail.com',
            //   pass:'ylpbdnskzhutpdix'
            //   pass:'pcdqsxluvxphbslw'
            pass: 'ytmqtefkrmohprva'

        },
    });

    transporter.verify().then(res => {
        console.log('ready')
    }).catch(ex => {
        console.log('ex', ex)
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

    if (emails !== []) {

        emails.forEach((item) => {
            let emailOption = {
                from: 'Reporte de entrada assistancecheck@gmail.com',
                to: `${item}`,
                subject: `${timestamp1} - REPORTE DE ASISTENCIA DE ENTRADA  ${nameObra} `,
                template: 'Prueba',
                context: {
                    data: data,
                    nameObra: nameObra,
                    diaString: diaString,
                    tipo: 'entrada',
                    link: codigosObra
                }
            }
            transporter.sendMail(
                emailOption,
                function (err, info) {
                    if (err) {
                        console.log('errorada', err)
                        return false
                    } else {
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