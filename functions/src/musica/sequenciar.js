
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros do Corpo
    const { sequencia, id} = req.body;
    // Validar parâmetros obrigatórios
    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "Algo de errado aconteceu, faça novamente o login"});
    }
    if (sequencia == null || sequencia == '' ) {
        return res.send({ "success": false, "message": "Algo de errado aconteceu, faça novamente o login"});
    }

    return await db.query(`
        CALL PCD_CANTAI_SEQUENCIAR_MUSICA_ADM(${sequencia}, ${id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "success" : true, "message": "Exclusão do audio realizado com sucesso!" });
    });

}
