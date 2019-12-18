
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
     const {qualidade} = req.body;

     if(qualidade == null){
         res.send({"success": false, "message": "Informe a qualidade."});
     }

     return db.query(`
        CALL PCD_CANTAI_QUALIDADE_MUSICA(${req.jwt.id}, ${qualidade});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "success" : "true" });
    });

}
