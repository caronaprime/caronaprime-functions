
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {candidato, evento, categoria} = req.body;

    if(candidato == null){
        res.send({"success": false, "message": "Informe o candidato."});
    }
    if(evento == null){
        res.send({"success": false, "message": "Informe o evento."});
    }
    if(categoria == null){
        res.send({"success": false, "message": "Informe a categoria."});
    }

    await db.query(`
        CALL PCD_CANTAI_VOTAR(${candidato}, ${req.jwt.id}, ${evento}, ${categoria})
    `)

    return res.send({ "success" : true });

}
