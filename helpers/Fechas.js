const fechaDehoy = () => {
    let fechaDeHoy = new Date()
    let dia = fechaDeHoy.getDate()
    if (dia < 10) {
        dia = `0${dia}`
    }
    let mes = fechaDeHoy.getMonth() + 1
    if (mes < 10) {
        mes = `0${mes}`
    }
    let año = fechaDeHoy.getFullYear()

    return `${dia}/${mes}/${año}`
}

const fechaTimeStamp = (date) => {
    let fecha = new Date(date)
    let dia = fecha.getDate()
    if (dia < 10) {
        dia = `0${dia}`
    }
    let mes = fecha.getMonth() + 1
    if (mes < 10) {
        mes = `0${mes}`
    }
    let año = fecha.getFullYear()

    return `${dia}/${mes}/${año}`
}

const mesTimeStamp = (data) => {
    const mes = new Date(data).getMonth() + 1
    return mes
}

const mesNombre = (data) => {
    const mes = new Date(data).getMonth() + 1
    switch (mes) {
        case 1:
            return 'ENERO'
        case 2:
            return 'FEBRERO'
        case 3:
            return 'MARZO'
        case 4:
            return 'ABRIL'
        case 5:
            return 'MAYO'
        case 6:
            return 'JUNIO'
        case 7:
            return 'JULIO'
        case 8:
            return 'AGOSTO'
        case 9:
            return 'SEPTIEMBRE'
        case 10:
            return 'OCTUBRE'
        case 11:
            return 'NOVIEMBRE'
        case 12:
            return 'DICIEMBRE'
        default:
            return 'NO HAY MES';
    }
}

module.exports = {
    fechaDehoy,
    fechaTimeStamp,
    mesTimeStamp,
    mesNombre
}