// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    const {nome, sobrenome, foto} = req.body;

    if(nome == null){
        res.send({"success": false, "message": "Informe o nome."});
    }
    if(sobrenome == null){
        res.send({"success": false, "message": "Informe o sobrenome."});
    }

    return db.query(`
       CALL PCD_CANTAI_ALTERAR_PERFIL_USUARIO(${req.jwt.id}, '${nome}', '${sobrenome}', '${foto}');
       `, (error, result) => {
       if (error) throw error;

       res.send({ "success" : "true" });
   });

}