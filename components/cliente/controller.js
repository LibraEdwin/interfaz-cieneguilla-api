const store = require('./store')
const validator = require('validator')
const { v4: uuidv4 } = require('uuid')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const smail = require('@sendgrid/mail')
const config = require('../../config').config

function loginClient(username, password, secret) {
  return new Promise(async (resolve, reject) => {
    const cliente = await store.find({ correo: username })
    if (!cliente) return reject({ code: 401, message: 'Correo inválido' })

    const match = await bcryptjs.compare(password, cliente.password)
    if (!match) return reject({ code: 401, message: 'Contraseña invalida' })

    const payload = {
      user: {
        id: cliente._id,
        correo: cliente.correo,
        nombre: cliente.nombre,
        celular: cliente.celular,
        createdAt: cliente.createdAt
      }
    }
    console.log(payload, 'paylod')
    const token = jwt.sign(payload, secret, { expiresIn: '1h' })
    resolve({
      code: 200,
      message: { access_token: token }
    })
  })
}

function createClient(cliente) {
  return new Promise(async (resolve, reject) => {
    const { nombre, correo, _id, password } = cliente

    if (!cliente) reject({ code: 400, message: 'Datos no recibidos' })
    if (correo && !validator.isEmail(correo)) return reject({ code: 400, message: 'El formato del correo ingresado no es correcto' })
    if (_id.length < 8) reject({ code: 400, message: 'Verifique el número de documento' })
    if (password.length < 6) reject({ code: 400, message: 'Contraseña debe tener mínimo 6 caracteres' })
    if (nombre.length === 0) reject({ code: 400, message: 'Ingresar nombre' })

    // Validation From DB
    const clientById = await store.find({ _id: _id })
    const clientByCorreo = await store.find({ correo })
    if (clientById) reject({ code: 400, message: 'Número de documento se encuentra registrado' })
    if (clientByCorreo) reject({ code: 400, message: 'Correo se encuentra registrado' })

    store.add(cliente)
      .then(data => {
        return resolve({
          code: 200,
          message: data
        })
      }).catch(data => {
        return reject({
          code: 400,
          message: data.message
        })
      })
  })
}

function listClients() {
  return new Promise(async (resolve, reject) => {
    store.obtenerTodos()
      .then(clients => {
        resolve({
          codigo: 200,
          clients
        })
      }).catch(error => {
        reject(new Error({
          codigo: 500,
          mensaje: error.message
        }))
      })
  })
}

function listClient(codigo) {
  return new Promise(async (resolve, reject) => {
    store.obtenerPorId(codigo)
      .then(client => {
        if (client) {
          resolve({
            codigo: 200,
            client
          })
        } else {
          reject({
            codigo: 404,
            mensaje: `No se encontró el cliente con el código ${codigo}`
          })
        }
      }).catch(error => {
        reject({
          codigo: 500,
          mensaje: error.message
        })
      })
  })
}

function updateClient(codigo, cliente) {
  return new Promise(async (resolve, reject) => {
    if (!codigo) {
      return reject({
        code: 400,
        message: 'El campo de código es requerido'
      })
    }

    // Validar formato del código //
    if (!validator.isNumeric(codigo)) return reject({ code: 400, message: 'El formato del código ingresado no es correcto' })

    // Validar si cliente existe //
    const cantidad = await store.count(codigo)
    if (cantidad == 0) return reject({ code: 404, message: 'Recurso no existe' })

    // Actualizar datos de usuario //
    store.update(codigo, cliente)
      .then(data => {
        return resolve({
          code: 200,
          message: data
        })
      }).catch(data => {
        return reject({
          code: 400,
          message: data.message
        })
      })
  })
}

function deleteClient(codigo) {
  return new Promise((resolve, reject) => {
    store.delete(codigo)
      .then(data => resolve({
        code: 200,
        message: data
      }))
      .catch(data => reject({
        code: 400,
        message: data.message
      }))
  })
}

function getCodeVerify(email) {
  return new Promise(async (resolve, reject) => {
    const cliente = await store.existeClienteByEmail(email)

    console.log(cliente)

    if (!cliente) {
      return reject({
        code: 404,
        message: 'El email no está registrado'
      })
    }

    /**
     * obtener un código de verificación
     */
    const codigoVerificacion = uuidv4()

    /**
     * guardar el código de verificación en el cliente
     */
    await store.actualizarCodigoVerificacion(cliente._id, codigoVerificacion)

    /**
     * Enviar un código de verificación
     */
    smail.setApiKey(config.SENDGRID_API_KEY)

    const msg = {
      to: 'david.sandoval@interfaz.app',
      from: 'noreply@encuestasenlinea.app',
      subject: 'Permiso para cambiar la conraseña',
      text: 'Notificación: cambio de contraseña',
      html: `<p>Para cambiar tu contraseña ingresa a éste link http://localhost:8080/cambiar-contrasena/id=${codigoVerificacion}</p>` // html: '<strong>Gracias por su compra</strong><br/><br/>Da click para ver el detalle de su compra',
    }

    smail
      .send(msg)
      .then(() => {
        return resolve({
          code: 200,
          message: 'Se envió un email con un link de confirmación para poder cambiar tu contraseña'
        })
      })
      .catch((error) => {
        return reject({
          code: 500,
          message: error.message
        })
      })
  })
}

function remplacePassword(uuid, password) {
  return new Promise(async (resolve, reject) => {
    const existeCodigoVerificacion = await store.existeCodigoVerificacion(uuid)

    if (!existeCodigoVerificacion) {
      return reject({
        code: 404,
        message: 'El código de verificación es incorrecto'
      })
    }

    /**
     * Actualizar contraseña
     */

    await store.actualizarPassword(existeCodigoVerificacion._id, password)

    return resolve({
      code: 200,
      message: 'Se actualizó la contraseña correctamente'
    })
  })
}

function changePassword(data) {
  return new Promise(async (resolve, reject) => {
    const { dni, tipoDocumento, correo, newPassword } = data
    if (!dni || !tipoDocumento || !correo) {
      return reject({
        code: 400,
        message: 'El dni, el tipo de documento y el correo son requeridos'
      })
    }

    const cliente = await store.existeClientePorDocumento({ dni, tipoDocumento, correo })

    if (!cliente) {
      return reject({
        code: 404,
        message: 'Los datos para validar el cliente son incorrectos'
      })
    }

    await store.actualizarPassword(cliente, newPassword)

    return resolve({
      code: 200,
      message: 'Se actualizó la contraseña correctamente'
    })
  })
}

module.exports = {
  createClient,
  listClient,
  updateClient,
  deleteClient,
  loginClient,
  listClients,
  getCodeVerify,
  remplacePassword,
  changePassword
}
