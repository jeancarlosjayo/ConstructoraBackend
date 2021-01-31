const {db} = require('../firebase')

const prueba = async() => {
    await db.ref('/obras').once('value',function(snapshot){
        if(snapshot.exists()){
            const newObject = snapshot.val()
            for(const item in newObject){
                console.log(item)
            }
            // email = snapshot.val().reportemail
            // nameObra = snapshot.val().name
            // console.log(email)
        }else{
            console.log('error')

            return null
        }
    })
}

module.exports = {
    prueba
}

// set
// update
// setvalue
