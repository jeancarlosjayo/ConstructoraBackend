const {
    db
} = require('../firebase')
const nodemailer = require('nodemailer')
const express = require('express')
const hbs = require('nodemailer-express-handlebars')
const {
    fechaDehoy,
    fechaTimeStamp,
    mesTimeStamp,
    mesNombre
} = require('../helpers/Fechas')
const app = express()

const ReporteMensualObras = async () => {
    console.log('existe')
    await db.ref('/obras').once('value', function (snapshot) {
        console.log('entra a obras')
        if (snapshot.exists()) {
            const newObject = snapshot.val()
            for (const item in newObject) {
                console.log(item)
                ObtenerDataReporteMensual(item)
            }
        } else {
            console.log('error')

            return null
        }
    })
}

const ObtenerDataReporteMensual = async (ID_OBRA) => {
    console.log('entro')
    let data = []
    let email = ''
    let emails = []
    let nameObra = ''
    let totalAsistence = 0
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
            totalAsistence = snapshot.val().buildersnum
            console.log(email)
        } else {
            console.log('error NO EXITE OBRA')

            return null
        }
    })



    await db.ref('/obras/' + ID_OBRA).child('asistencia').once('value', function (snapshot) {
        if (snapshot.exists()) {
            let array = []
            snapshot.forEach(
                function (ChildSnapshot) {
                    let objeto = {}
                    const monthCurrency = new Date().getMonth() + 1
                    const timestamp = new Date(ChildSnapshot.key * 1000)
                    const monthTimestamp = mesTimeStamp(timestamp)
                    if (monthCurrency === monthTimestamp) {
                        const datafor = Object.values(ChildSnapshot.val())
                        // console.log(ChildSnapshot.key, datafor.length)
                        objeto.count = datafor.length
                        objeto.total = totalAsistence
                        objeto.day = fechaTimeStamp(new Date(ChildSnapshot.key * 1000))
                        array.push(objeto)
                    }

                }

            )
            // console.log('sadsadsadsa array', array)
            envioEmailMensual(array, nameObra, ID_OBRA, emails)
        } else {
            console.log('error NO TIENE ASISTENCIA')
            return null
        }

    })


}


const envioEmailMensual = (array, nameObra, ID_OBRA, emails) => {
    console.log(array)
    console.log(nameObra)
    console.log(ID_OBRA)
    console.log(emails)

    let month = mesTimeStamp(new Date())
    let monthName = mesNombre(new Date())
    let codigosObra = `${ID_OBRA}-${month}`

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
                defaultLayout: "PruebaMensual",
                partialsDir: "views/emails",
            },
            viewPath: "views/emails",
            extName: ".hbs",
        })
    );

    if (emails !== []) {

        emails.forEach((item) => {
            let emailOption = {
                from: 'Reporte Mensual assistancecheck@gmail.com',
                to: `${item}`,
                subject: `${timestamp1} - REPORTE MENSUAL  ${nameObra} `,
                template: 'PruebaMensual',
                context: {
                    data: array,
                    nameObra: nameObra,
                    link: codigosObra,
                    monthName: monthName
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
    ReporteMensualObras
}