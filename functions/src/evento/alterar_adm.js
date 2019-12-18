
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { id, nome, imagemEvento } = req.body;    
    var util = []
    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    if (id == null || id == '') {
        return res.send({ "success": false, "message": "evento não encontrado"});
    }
    if (nome == null || nome == '') {
        return res.send({ "success": false, "message": "Coloque o nome do album"});
    }
    if (imagemEvento == null || imagemEvento == '') {
        return res.send({ "success": false, "message": "Necessário inserir uma imagem para alteração"});
    }
    await db.query(`
        CALL PCD_CANTAI_ALTERAR_EVENTO_ADM(${id}, '${nome}', '${imagemEvento}');
        `)

    return res.send({ "success": true});

}
