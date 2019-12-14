
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
     const {pesquisa} = req.query;

     return db.query(`
        CALL PCD_CANTAI_LISTAR_MUSICAS_PESQUISA_COMPLETA(${pesquisa});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "MUSICAS" : result[0] });
    });

}
