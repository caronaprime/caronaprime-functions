
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {letra, playlist} = req.body;

    if(letra == null){
        res.send({"success": false, "message": "Informe a letra."});
    }
    if(playlist == null){
        res.send({"success": false, "message": "Informe a playlist."});
    }

    var resultado = await db.query(`
        CALL PCD_CANTAI_VERIFICAR_LETRA_PLAYLIST('${letra}', '${playlist}')
    `)

    if (resultado[0][0].LETRA == 0) {
      await db.query(`
         CALL PCD_CANTAI_INCLUIR_LETRA_PLAYLIST('${letra}', '${playlist}')
     `)
    } else {
        return res.send({ "success" : false, "message": "Letra já está na lista." });
    }
    
    return res.send({ "success" : true });

}
