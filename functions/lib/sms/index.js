// Importar bibliotecas
const request = require('request')
const util = require('util')
const req = util.promisify(request)

// Módulo de enviar SMS
module.exports = {

    // Enviar mensagem
    send: async (telefone, mensagem) => {
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        var options = {
            url: 'https://api.twilio.com/2010-04-01/Accounts/AC91289b99374cf13a52fd44f65067b694/Messages.json',
            method: 'POST',
            headers: headers,
            form: {
                'To':  '+55' + telefone,
                'From': '+19384448517',
                'Body': mensagem
            },
            auth: {
                'user': 'AC91289b99374cf13a52fd44f65067b694',
                'pass': '0e6f2121923640186995c555b7ff8049',
                'sendImmediately': false
            }
        }
        
        await request(options)
    }

}
