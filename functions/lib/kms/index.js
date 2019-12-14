/*
   KMS - Cloud Key Management Service
*/
const kms = require('@google-cloud/kms')
const config = require('config')

// Configurar KMS
if (!(config &&
    config.projectId &&
    config.kms &&
    config.kms.location &&
    config.kms.keyring &&
    config.kms.key)) {
   throw "KMS Error: KMS configuration is not available. Please, enter the settings in config.json file."
}

const client = new kms.KeyManagementServiceClient()

const name = client.cryptoKeyPath(
   config.projectId,
   config.kms.location,
   config.kms.keyring,
   config.kms.key
)

// Exportar funções do módulo
module.exports = {

   // Criptografar
   encrypt: async (text) => {
      const [ result ] = await client.encrypt({name: name, plaintext: Buffer.from(text).toString("base64")})
      return result.ciphertext.toString('base64')
   },

   // Descriptografar
   decrypt: async (ciphertext) => {
      const [ result ] = await client.decrypt({name, ciphertext: Buffer.from(ciphertext, 'base64')})
      return Buffer.from(result.plaintext, 'base64').toString()
   }

}
