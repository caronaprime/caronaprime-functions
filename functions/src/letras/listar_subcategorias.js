
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
	const {categoria} = req.query;

     return db.query(`
        CALL PCD_CANTAI_OBTER_SUBCATEGORIA_LETRAS(${req.jwt.id}, ${categoria});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });


//res.send(true);
}