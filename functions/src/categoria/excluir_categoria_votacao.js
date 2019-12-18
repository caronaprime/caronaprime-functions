
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { id} = req.body;
    // Validar parâmetros obrigatórios

    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "Algo de errado aconteceu, faça novamente o login"});
    }

    return await db.query(`
        CALL PCD_CANTAI_EXCLUSAO_CATEGORIA_VOTACAO_ADM(${id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "success" : true, "message": "Exclusão de categoria realizada com sucesso!" });
    });

}
