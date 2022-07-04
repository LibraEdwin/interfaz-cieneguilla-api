const db = require('mongoose')
const chalk = require('chalk')

// mongodb+srv://user-mbd:<password>@cluster0-qmwio.gcp.mongodb.net/test

async function connect (url) {
  await db.connect(url)
  console.log('[DB] Conectada con éxito a: ' + chalk.bgWhite.black(url))
  console.log(db.models)
  // console.log(db.version)
}

module.exports = {
  connect
}
