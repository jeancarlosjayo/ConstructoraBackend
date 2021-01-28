const fechaDehoy = () => {
    let fechaDeHoy = new Date()
    let dia = fechaDeHoy.getDate()
    if(dia < 10){
        dia = `0${dia}`   
    }
    let mes = fechaDeHoy.getMonth() + 1
    if(mes < 10){
        mes = `0${mes}`   
    }
    let año = fechaDeHoy.getFullYear()

    return `${dia}/${mes}/${año}`
}

const fechaTimeStamp = (date) => {
    let fecha = new Date(date)
    let dia = fecha.getDate()
    if(dia < 10){
        dia = `0${dia}`   
    }
    let mes = fecha.getMonth() + 1
    if(mes < 10){
        mes = `0${mes}`   
    }
    let año = fecha.getFullYear()
    
    return `${dia}/${mes}/${año}`
}

module.exports = {
    fechaDehoy,
    fechaTimeStamp
}
