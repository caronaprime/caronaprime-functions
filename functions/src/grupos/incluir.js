
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros
    const { nome, descricao, partida, destino } = req.body;
    
    // Validar parâmetros obrigatórios
    if (nome == null || nome == '' ) {
        return res.send({ "success": false, "message": "Campo nome é obrigatório"});
    }

    if (partida == null || partida == '' ) {
        return res.send({ "success": false, "message": "Campo partida é obrigatório"});
    }

    if (destino == null || destino == '' ) {
        return res.send({ "success": false, "message": "Campo destino é obrigatório"});
    }

    return await db.query(`
    INSERT INTO caronaprime.TBL_GRUPOS (nome, descricao, partida, destino) VALUES ('${nome}', '${descricao}', '${partida}', '${destino}');
    `, (error, result) => {
        if (error) throw error;

        
        res.send({ "success" : true, "message": "Inclusão realizada com sucesso!" });
    });
}