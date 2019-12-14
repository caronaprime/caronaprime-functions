
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

     return db.query(`
        CALL PCD_CANTAI_LISTAR_CATEGORIA_VOTACAO();
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });

}
