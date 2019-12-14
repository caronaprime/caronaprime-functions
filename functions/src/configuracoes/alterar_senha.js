
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
     const {senha} = req.body;

     if(senha == null){
         res.send({"success": false, "message": "Informe a senha."});
     }

     return db.query(`
        CALL PCD_CANTAI_ALTERAR_SENHA_USUARIO(${req.jwt.id}, '${senha}');
        `, (error, result) => {
        if (error) throw error;

        res.send({ "success" : "true" });
    });

}
