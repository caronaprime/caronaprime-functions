
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { imagem, artista, status } = req.body;
    // Validar parâmetros obrigatórios

    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    if (imagem == null || imagem == '' ) {
        return res.send({ "success": false, "message": "Selecione uma arte do artista"});
    }
    if (artista == null || artista == '' ) {
        return res.send({ "success": false, "message": "Selecione um artista"});
    }
    if (status == null || status == '' ) {
        return res.send({ "success": false, "message": "Selecione um status"});
    }
    return db.query(`
        CALL PCD_CANTAI_INCLUSAO_ARTISTA_BANNER_ADM('${imagem}', ${artista}, '${status}');
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}
