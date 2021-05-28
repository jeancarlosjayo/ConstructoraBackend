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


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test' , (req , res ) => {
    res.json( {
        status : true ,
        body : {
            message : 'this is a testing'
        }
    })
})


app.listen(4000, async () => {

    cron.schedule('*/1 * * * *', () => {
        console.log('entro al node cron xd')
        ReporteEntraObras()
        ReporteSalidaObras()
    });

    cron.schedule('45 21 * * *', () => {
        console.log('entra al cron')
        ReporteMensualObras()
    });

})