
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {pesquisa} = req.body;

    if(pesquisa == null){
        res.send({"success": false, "message": "Informe a pesquisa."});
    }

    await db.query(`
        CALL PCD_CANTAI_INCLUIR_MAIS_PESQUISADOS('${pesquisa}')
    `)

    return res.send({ "success" : true });

}
