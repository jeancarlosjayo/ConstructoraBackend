
const admin = require('firebase-admin')
const jsonfibase = require("./constructorapp-fdffb-firebase-adminsdk-h2cod-ecb73572bf.json")

admin.initializeApp({
  credential: admin.credential.cert(jsonfibase),
  databaseURL:'https://constructorapp-fdffb-default-rtdb.firebaseio.com'
})

const db = admin.database()


module.exports={
  db
}

