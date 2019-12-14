
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    // Parâmetros do Corpo
    const { tipoAssinaturaFinal, id_token} = req.body;    
    var util = []
    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    if (tipoAssinaturaFinal == null || tipoAssinaturaFinal == '') {
        return res.send({ "success": false, "message": "Obrigatório informar o tipo da assinatura"});
    }
    if (id_token == null || id_token == '') {
        return res.send({ "success": false, "message": "token não encontrado, entrar em contato com o suporte"});
    }
   return db.query(`
        CALL PCD_CANTAI_VALIDAR_ASSINATURA_ADM('${tipoAssinaturaFinal}', ${id_token});
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}
