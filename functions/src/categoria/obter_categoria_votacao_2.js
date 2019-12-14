
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

	const { id } = req.params;
     return db.query(`
        CALL PCD_CANTAI_OBTER_CATEGORIA_VOTACAO_EVENTO(${id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });

}
