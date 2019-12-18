
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {musica, playlist} = req.body;

    if(musica == null){
        res.send({"success": false, "message": "Informe a música."});
    }
    if(playlist == null){
        res.send({"success": false, "message": "Informe a playlist."});
    }

    await db.query(`
      CALL PCD_CANTAI_EXCLUIR_MUSICA_PLAYLIST('${musica}', '${playlist}')
   `)
    
    return res.send({ "success" : true });

}
