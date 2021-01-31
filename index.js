const  express = require('express')
const { obtenerDataObraUnoEntrada,obtenerHoraEntrada, obtenerHoraSalida, obtenerDataObraUnoSalida } = require('./obras/obreUno');
const app = express()
var cron = require('node-cron');
const { prueba } = require('./obras/prueba');
 



app.listen(4000, async ()=>{
 
    const ObraUnoEntrada = async() => {
        await obtenerHoraEntrada().then(res => {

            const hora = (res.horaEntrada ).toString()

            const minuto = (res.minutoEntrada).toString()

            const horaActual = new Date().getHours()

            const minutoActual = new Date().getMinutes()

            const horarioActual = `${horaActual}:${minutoActual}`

            const horaFirebsae = `${hora}:${minuto}`

            if(horarioActual === horaFirebsae){
                console.log('envio email hora entrada')
                obtenerDataObraUnoEntrada()
            }

        }).catch(ex => {
            console.log('error',ex)
        })


    }

    const ObraUnoSalida = async() => {
        await obtenerHoraSalida().then(res => {

            const hora = (res.horaSalida ).toString()

            const minuto = (res.minutoSalida).toString()

            const horaActual = new Date().getHours()

            const minutoActual = new Date().getMinutes()

            const horarioActual = `${horaActual}:${minutoActual}`

            const horaFirebsae = `${hora}:${minuto}`

            if(horarioActual === horaFirebsae){
                console.log('envio email hora salida')
                obtenerDataObraUnoSalida()
            }

        }).catch(ex => {
            console.log('error',ex)
        })
    }



    // cron.schedule('*/1 * * * *', () => {
    //     console.log('entro al node cron xd')
    //     ObraUnoEntrada()
    //     ObraUnoSalida()
    // });
      
    prueba()
    
    
    
    
})
