/*
Habilitar referencia 'dotenv'
para el uso de variables de entorno de producción en el proyecto.
Variables deben estar en el archivo .env
*/
const path = require('path')
require('dotenv').config()
// DB_URI: 'mongodb://usuario:235411@34.125.7.40:27017/test',

const config = {
  // DB_URI: 'mongodb+srv://dbOpCTT:gfTCGZS9qKpY@serverlessinstanceciene.mkdgj.mongodb.net/dbcieneguillaTT?retryWrites=true&w=majority',
  DB_URI: process.env.DB_URI || 'mongodb+srv://dbDev:235411@serverlessinstance0.xjgs0.mongodb.net/cieneguilla_prod?retryWrites=true&w=majority',
  // DB_URI: process.env.DB_URI || 'mongodb+srv://vanessapalomino:interfaz@cluster0.hdufp.mongodb.net/Cieneguilla-Api?retryWrites=true&w=majority',
  PORT: process.env.PORT || 3002,
  HOST: process.env.HOST || 'http://localhost',
  HTTPS: false,
  DOMAIN_NAME_CERT: 'www.cieneguillatours.com',
  authJwtSecret: process.env.SECRET || 'secret',
  SENDGRID_API_KEY: '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',
  BUCKETS: {
    NAME: 'svr-cieneguilla.appspot.com',
    PATH_KEY: path.join(__dirname, './keys-storage.json')
  }
}

module.exports = {
  config
}
