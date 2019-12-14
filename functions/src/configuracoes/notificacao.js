
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
     const {tipo} = req.body

     if(tipo == null){
         res.send({"success": false, "message": "Informe o tipo."});
     }
     return db.query(`
        CALL PCD_CANTAI_RECEBER_NOTIFICACAO('${tipo}', ${req.jwt.id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "success" : "true" });
    });

}
