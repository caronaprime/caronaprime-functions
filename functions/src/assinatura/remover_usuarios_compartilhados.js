// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {id_pendente, id_premium} = req.body;

    if(id_pendente == null){
        res.send({"success": false, "message": "Informe o id pendente."});
    }
    if(id_premium == null){
        res.send({"success": false, "message": "Informe o id premium."});
    }

    await db.query(`
        CALL PCD_CANTAI_EXCLUIR_USUARIO_COMPARTILHAMENTO(${id_pendente}, ${id_premium})
    `)

    return res.send({ "success" : true });

}