// Importar biblioteca 'jsonwebtoken'
const jwt = require('jsonwebtoken')
const config = require('config')

// Senha padrão
var PASSWORD = "eu6oUy?%cRoYqgA5f,(@jnxr"
if (config &&
    config.jwt &&
    config.jwt.password) {
    PASSWORD = config.jwt.password
}

// Módulo
module.exports = {

    // Assinar
    sign: (data) => {
        return jwt.sign(data, PASSWORD)
    },

    // Verificar token
    verify: verify,

    // Middleware de verificação de token JWT
    middleware: (req, res, next) => {
        verify(req, res).then(data => {
            req.jwt = data
            next()
        })
        .catch(err => {
            res.status(401).send(err)
            res.end()
        })
    }

}

function verify(req, res) {

    // Retornar uma promessa
    return new Promise((resolve, reject) => {
        // Pegar o token do cabeçalho HTTP
        const token = req.headers['x-auth-token']

        // Testar se o token foi informado
        if (!token) {
            reject("No token provided.")
            return
        }

        // Validar JWT
        jwt.verify(token, PASSWORD, (err, decoded) => {
            if (err) {
                reject("Failed to authenticate.")
                return
            }

            // Se chegou aqui, é porque tudo deu certo, então executar a promessa passando os dados decodificados
            resolve(decoded)
        })
    })

}