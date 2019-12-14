
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    // Parâmetros do Corpo
    const { nome, id} = req.body;    
    var util = []
    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    if (nome == null || nome == '') {
        return res.send({ "success": false, "message": "Coloque o nome da categoria"});
    }
    if (id == null || id == '') {
        return res.send({ "success": false, "message": "categoria não encontrada, entre em contato com o suporte"});
    }
   return db.query(`
        CALL PCD_CANTAI_ALTERAR_CATEGORIA_VOTACAO_ADM('${nome}', ${id});
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}
