const  express = require('express')
const app = express()
var cron = require('node-cron');
const { ReporteEntraObras } = require('./obras/ReporteEntrada');
const { ReporteSalidaObras } = require('./obras/ReporteSalida');
 

app.listen(4000, async ()=>{


    cron.schedule('*/1 * * * *', () => {
        console.log('entro al node cron xd')
        ReporteEntraObras()
        // ReporteSalidaObras()
    });
      
  

})
