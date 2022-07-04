const express = require('express')
const router = express.Router()
const response = require('../../network/response')
const {
  buscarSalidas,
  addSalidaProgramada,
  obtenerTodasLasSalidas,
  obtenerSalidaProgramada,
  updateSalidaProgramada,
  deleteSalidaProgramada,
  getSalidaByPaqueteTuristico,
  buscarPaquetes,
  changeVisibility
} = require('./controller')

router.get('/', async (req, res) => {
  obtenerTodasLasSalidas()
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code))
})

router.get('/search', async (req, res) => {
  const query = req.query

  buscarSalidas(query)
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code))
})

router.get('/search-paquete', async (req, res) => {
  const query = req.query

  buscarPaquetes(query)
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code))
})

router.get('/paquete-turistico/:codigo', async (req, res) => {
  const { codigo } = req.params
  getSalidaByPaqueteTuristico(codigo)
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code))
})

router.patch('/:codigo/visibility', async (req, res) => {
  const { codigo } = req.params
  changeVisibility(codigo)
    .then((data) => response.success(req, res, data.results, data.code))
    .catch((error) => response.error(req, res, error.message, error.code))
})

router.get('/:codigo', async (req, res) => {
  const { codigo } = req.params

  obtenerSalidaProgramada(codigo)
    .then((data) => response.success(req, res, data.result, data.code))
    .catch((error) => response.error(req, res, error.message, error.code))
})

router.post('/', async (req, res) => {
  const data = req.body

  addSalidaProgramada(data)
    .then((result) => response.success(req, res, result.data, result.code))
    .catch((error) => response.error(req, res, error.message, error.code))
})

router.patch('/:codigo', async (req, res) => {
  const { codigo } = req.params
  const data = req.body

  updateSalidaProgramada(codigo, data)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code))
})

router.delete('/:codigo', async (req, res) => {
  const { codigo } = req.params

  deleteSalidaProgramada(codigo)
    .then((data) => response.success(req, res, data.message, data.code))
    .catch((error) => response.error(req, res, error.message, error.code))
})

module.exports = router
