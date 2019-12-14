
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {id, titulo, foto, publico, usuarios} = req.body;

    if(id == null){
        res.send({"success": false, "message": "Informe o id da lista."});
    }
    if(titulo == null){
        res.send({"success": false, "message": "Informe o titulo da lista."});
    }
    if(foto == null){
        res.send({"success": false, "message": "Informe a foto de capa da lista."});
    }
    if(publico == null){
        res.send({"success": false, "message": "Informe se a lista é publica ou privada."});
    }

    var playlist = await db.query(`
        CALL PCD_CANTAI_ALTERAR_PLAYLIST('${titulo}', '${foto}', '${publico}', ${id})
    `)

    await db.query(`
        CALL PCD_CANTAI_REMOVER_TODOS_PREMIUM_PLAYLIST(${id})
    `)

    await usuarios.forEach((el) => {
       db.query(`
           CALL PCD_CANTAI_PLAYLIST_COMPARTILHADA_PREMIUM(${el.id}, ${id})
       `) 
    })

    return res.send({ "success" : true });

}
