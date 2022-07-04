require('express-async-errors')
const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const handlerRouters = require('./network/routers')
const app = express()

// const hbs = require('express-handlebars')
// const socket = require('./socket')

app
  .set('view engine', 'html')
  .use('/app', express.static('public'))
  .use('/app', express.static('filesPaquete'))
  .use(cors({
  // origin: 'http://localhost:3000',
  // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }))
  .use(express.json()) // for parsing application/json
  .use(express.urlencoded({ extended: false }))

handlerRouters(app)

// app.use(notFound)
// app.use(errorHandlerMiddleware)

module.exports = app
