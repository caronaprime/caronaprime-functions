
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
     const {pesquisa} = req.query;

     return db.query(`
        CALL PCD_CANTAI_MAIS_PESQUISADOS(${pesquisa});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });

}
