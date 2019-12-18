// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    var util = []
    const {evento, categoria} = req.body;
  
      if(evento == null){
          res.send({"success": false, "message": "Informe o evento."});
      }
      if(categoria == null){
          res.send({"success": false, "message": "Informe a categoria."});
      }

     return db.query(`
        CALL PCD_CANTAI_LISTAR_CANDIDATOS_VOTACAO(${evento}, ${categoria});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });

}