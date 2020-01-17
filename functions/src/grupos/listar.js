
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    return await db.query(`
    SELECT a.nome, a.descricao, b.nome AS partida, c.nome AS destino  FROM caronaprime.Grupos a
        INNER JOIN caronaprime.Locais b ON a.partida = b.id
        INNER JOIN caronaprime.Locais c ON a.destino = c.id;
        `, (error, result) => {
        if (error) throw error;

        //comentario
        res.send({ "success" : true, "grupos": result});
    });
}