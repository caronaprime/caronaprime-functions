
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

    var resultado = await db.query(`
        CALL PCD_CANTAI_VERIFICAR_MUSICA_PLAYLIST('${musica}', '${playlist}')
    `)

    if (resultado[0][0].MUSICA == 0) {
      await db.query(`
         CALL PCD_CANTAI_INCLUIR_MUSICA_PLAYLIST('${musica}', '${playlist}')
     `)
    } else {
        return res.send({ "success" : false, "message": "Música já está na playlist." });
    }
    
    return res.send({ "success" : true });

}
