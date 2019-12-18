// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    
     return db.query(`
        CALL PCD_CANTAI_LISTAR_TODOS_ALBUNS_ADM();
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });

}