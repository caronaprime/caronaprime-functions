
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { imagem, link, status } = req.body;
    // Validar parâmetros obrigatórios

    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    if (imagem == null || imagem == '' ) {
        return res.send({ "success": false, "message": "Selecione uma arte do link"});
    }
    if (link == null || link == '' ) {
        return res.send({ "success": false, "message": "Selecione um link"});
    }
    if (status == null || status == '' ) {
        return res.send({ "success": false, "message": "Selecione um status"});
    }
    return db.query(`
        CALL PCD_CANTAI_INCLUSAO_LINK_BANNER_ADM('${imagem}', '${link}', '${status}');
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}