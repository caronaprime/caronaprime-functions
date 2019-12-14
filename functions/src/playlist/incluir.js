
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {titulo, foto, publico, usuarios} = req.body;

    if(titulo == null){
        res.send({"success": false, "message": "Informe o titulo da playlist."});
    }
    if(foto == null){
        res.send({"success": false, "message": "Informe a foto de capa da playlist."});
    }
    if(publico == null){
        res.send({"success": false, "message": "Informe se a playlist é publica ou privada."});
    }

    var playlist = await db.query(`
        CALL PCD_CANTAI_INCLUIR_PLAYLIST('${titulo}', '${foto}', '${publico}', ${req.jwt.id})
    `)

    await usuarios.forEach((el) => {
       db.query(`
           CALL PCD_CANTAI_PLAYLIST_COMPARTILHADA_PREMIUM(${el.id}, ${playlist[0][0].ULTIMO_ID})
       `) 
    })
    

    return res.send({ "success" : true });

}
