
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {id} = req.body;

    if(id == null){
        res.send({"success": false, "message": "Informe o id da musica."});
    }

    await db.query(`
        CALL PCD_CANTAI_FAVORITAR_MUSICA(${req.jwt.id}, ${id})
    `)

    return res.send({ "success" : true });

}
