const http = require('http')
const https = require('https')
const { readFileSync } = require('fs')
const chalk = require('chalk')
const db = require('./db')
const app = require('./app')
const setInitialData = require('./scripts/initial-data')

const config = require('./config').config

// Conexión a base de datos

db.connect(config.DB_URI)

// Ejecutar comando para carpetas //

// exec('mkdir uploads imagenesProducto')

// ---------- Crear servidor HTTP o HTTPS ------ //

if (!config.HTTPS) {
  http.createServer(app).listen(config.PORT, function () {
    console.log(`✔️  Servidor NodeJS en escucha => ${chalk.bgGreen.black(`${config.HOST}:${config.PORT}`)} `)
  })
}

if (config.HTTPS) {
  try {
    https.createServer({
      key: readFileSync(`/etc/letsencrypt/live/${config.DOMAIN_NAME_CERT}/privkey.pem`),
      cert: readFileSync(`/etc/letsencrypt/live/${config.DOMAIN_NAME_CERT}/cert.pem`),
      ca: readFileSync(`/etc/letsencrypt/live/${config.DOMAIN_NAME_CERT}/chain.pem`)
    }, app)
      .listen(config.PORT, () => {
        console.log(`✔️  Listening server HTTPS => ${chalk.bgGreen.black(`${config.HOST}:${config.PORT}`)} `)
      })
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('❌ [CERT] No se encontró algún archivo de certificado HTTPS')
    }
  }
}

setInitialData()
