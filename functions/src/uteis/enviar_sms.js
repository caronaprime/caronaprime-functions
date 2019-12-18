
// Conexão
const db = require('db').asyncConnect()

const sms = require('sms')

module.exports = async (req, res) => {

    await sms.send('65984649846', 'teste')


        // Retornar o ID
    return res.send({
       "success": true,
       "message": "OK"
    })

}
