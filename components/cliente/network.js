const { Router } = require('express')
const response = require('../../network/response')
const passport = require('passport')
const { config } = require('../../config')

const router = Router()

const {
  createClient,
  listClients,
  listClient,
  loginClient,
  updateClient,
  deleteClient,
  getCodeVerify,
  remplacePassword,
  changePassword
} = require('./controller')

/**
 * Listar clientes
 */
router.get('/', async (req, res) => {
  listClients()
    .then(data => response.success(req, res, data.clients, data.codigo))
    .catch(error => response.error(req, res, error.mensaje, error.codigo))
})

/**
 * Obtener un cliente por id
 */
router.get('/:codigo', async (req, res) => {
  const { codigo } = req.params
  listClient(codigo)
    .then(data => response.success(req, res, data.client, data.codigo))
    .catch(error => response.error(req, res, error.message, error.codigo))
})

/**
 * Obtener clientes por fecha de registro
 */
router.get('/fecha-registro', async (req, res) => {
  const { desde, hasta } = req.query

  return res.json({})
})

/**
 * obtener código de verificación
 */
router.get('/password/codigo-verificacion', async (req, res) => {
  const { email } = req.body

  getCodeVerify(email)
    .then(data => response.success(req, res, data.message, data.code))
    .catch(error => response.error(req, res, error.message, error.code))
})

/**
 * obtener código de verificación
 */
router.patch('/password/reemplazar', async (req, res) => {
  const { uuid, newPassword } = req.body

  remplacePassword(uuid, newPassword)
    .then(data => response.success(req, res, data.message, data.code))
    .catch(error => response.error(req, res, error.message, error.code))
})

/**
 * actualizar contraseña
 */
router.patch('/password/cambiar', async (req, res) => {
  const data = req.body

  changePassword(data)
    .then(data => response.success(req, res, data.message, data.code))
    .catch(error => response.error(req, res, error.message, error.code))
})

/**
 * Crear un cliente
 */
router.post('/', async (req, res) => {
  const cliente = req.body
  createClient(cliente)
    .then(data => response.success(req, res, data.message, data.code))
    .catch(error => response.error(req, res, error.message, error.code))
})

/**
 * Iniciar sesión del cliente
 */
router.post('/login', passport.authenticate('basic', { session: false }), async (req, res) => {
  loginClient(req.user.username, req.user.password, config.authJwtSecret)
    .then(data => response.success(req, res, data.message, data.code))
    .catch(error => response.error(req, res, error.message, error.code))
})

/**
 * Cerrar sesión del cliente
 */
router.post('/logout', function (req, res) {
  res.cookie('access_token', '', {
    expires: new Date(0),
    path: '/'
  })
})

/**
 * Actualizar un cliente
 */
router.patch('/:codigo', async (req, res) => {
  const { codigo } = req.params
  const client = req.body

  updateClient(codigo, client)
    .then(data => response.success(req, res, data.message, data.code))
    .catch(error => response.error(req, res, error.message, error.code))
})

/**
 * Eliminar un cliente
 */
router.delete('/:codigo', async (req, res) => {
  const { codigo } = req.params
  deleteClient(codigo)
    .then(data => response.success(req, res, data.message, data.code))
    .catch(error => response.error(req, res, error.message, error.code))
})
module.exports = router
