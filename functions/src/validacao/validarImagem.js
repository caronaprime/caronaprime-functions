
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { imagem } = req.body;
    // Validar parâmetros obrigatórios

   
    if (imagem == null || imagem == '' ) {
        return res.send({ "success": false, "message": "Adicionar uma imagem"});
    }else{
        return res.send({ "success" : true });

    }
    

}
