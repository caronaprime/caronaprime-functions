
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {letra, lista} = req.body;

    if(letra == null){
        res.send({"success": false, "message": "Informe a letra."});
    }
    if(lista == null){
        res.send({"success": false, "message": "Informe a lista."});
    }

    await db.query(`
      CALL PCD_CANTAI_EXCLUIR_LETRA_PLAYLIST('${letra}', '${lista}')
   `)
    
    return res.send({ "success" : true });

}
