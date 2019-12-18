
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
     const {pesquisa} = req.query;

     return db.query(`
        CALL PCD_CANTAI_LISTAR_PLAYLIST_PESQUISA_COMPLETA_V2(${req.jwt.id}, ${pesquisa});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "PLAYLIST" : result[0] });
    });

}
