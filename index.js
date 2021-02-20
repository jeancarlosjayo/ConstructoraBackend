const express = require('express')
const app = express()
var cron = require('node-cron');
const {
    ReporteEntraObras
} = require('./obras/ReporteEntrada');
const {
    ReporteMensualObras
} = require('./obras/ReporteMensual');
const {
    ReporteSalidaObras
} = require('./obras/ReporteSalida');


app.listen(4000, async () => {

    cron.schedule('*/1 * * * *', () => {
        console.log('entro al node cron xd')
        ReporteEntraObras()
        ReporteSalidaObras()
    });

    cron.schedule('25 17 * * *', () => {
        console.log('entra al cron')
        ReporteMensualObras()
    });

})