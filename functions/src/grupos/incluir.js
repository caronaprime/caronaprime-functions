
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros
    const { nome, descricao, partida_latitude, partida_longitude, destino_latitude, destino_longitude } = req.body;
    
    // Validar parâmetros obrigatórios
    if (nome == null || nome == '' ) {
        return res.send({ "success": false, "message": "Campo nome é obrigatório"});
    }

    if (partida_latitude == null || partida_latitude == '' ) {
        return res.send({ "success": false, "message": "Campo partida é obrigatório"});
    }

    if (partida_longitude == null || partida_longitude == '' ) {
        return res.send({ "success": false, "message": "Campo partida é obrigatório"});
    }

    if (destino_latitude == null || destino_latitude == '' ) {
        return res.send({ "success": false, "message": "Campo destino é obrigatório"});
    }

    if (destino_longitude == null || destino_longitude == '' ) {
        return res.send({ "success": false, "message": "Campo destino é obrigatório"});
    }

    return await db.query(`
        CALL PCD_INCLUIR_GRUPO('${nome}', '${descricao}', ${partida_latitude}, ${partida_longitude}, ${destino_latitude}, ${destino_longitude});
        `, (error, result) => {
        if (error) throw error;

        
        res.send({ "success" : true, "message": "Inclusão realizada com sucesso!" });
    });
}