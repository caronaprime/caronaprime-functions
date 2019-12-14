
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {id} = req.params;

    if(id == null){
        res.send({"success": false, "message": "Informe o id da playlist."});
    }

    var playlist = await db.query(`
        CALL PCD_CANTAI_EXCLUIR_PLAYLIST(${id})
    `)

    return res.send({ "success" : true });

}
