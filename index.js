const  express = require('express')
const nodemailer = require('nodemailer')
const cron = require('node-cron');
const { obtenerDataObraUnoEntrada,obtenerHoraEntrada } = require('./obras/obreUno');
const app = express()


app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

app.listen(5000, async ()=>{

    let hora = 0
    let minuto = 0

    await obtenerHoraEntrada().then(res => {
        hora = res.horaEntrada
        minuto = res.minutoEntrada
        console.log(hora)
        console.log(minuto)
    })
    console.log(hora)
    console.log(minuto)
    
    cron.schedule(`${minuto} ${hora} * * *`,() => {
        obtenerDataObraUnoEntrada()
    })

    cron.schedule(`${minuto} 5 * * *`,() => {
        obtenerDataObraUnoEntrada()
    })

    cron.schedule(`${minuto} 7 * * *`,() => {
        obtenerDataObraUnoEntrada()
    })

    cron.schedule(`30 6 * * *`,() => {
        obtenerDataObraUnoEntrada()
    })

    cron.schedule(`38 6 * * *`,() => {
        obtenerDataObraUnoEntrada()
    })

 
    // cron.schedule(' 0 0/10 * * *',() => {
    //     envioEmail()
    // })

    
    
})
