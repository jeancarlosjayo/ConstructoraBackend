
const jsonfirbsae = require('./constructorapp-fdffb-firebase-adminsdk-h2cod-ecb73572bf.json')

const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(jsonfirbsae),
  // credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  databaseURL:'https://constructorapp-fdffb-default-rtdb.firebaseio.com'
})

const db = admin.database()


module.exports={
  db
}

