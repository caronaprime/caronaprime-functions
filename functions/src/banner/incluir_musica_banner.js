
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { imagem, musica, status } = req.body;
    // Validar parâmetros obrigatórios

    var util = []

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
    if (imagem == null || imagem == '' ) {
        return res.send({ "success": false, "message": "Selecione uma arte da música"});
    }
    if (musica == null || musica == '' ) {
        return res.send({ "success": false, "message": "Selecione uma música"});
    }
    if (status == null || status == '' ) {
        return res.send({ "success": false, "message": "Selecione um status"});
    }
    return db.query(`
        CALL PCD_CANTAI_INCLUSAO_MUSICA_BANNER_ADM('${imagem}', ${musica}, '${status}');
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}
