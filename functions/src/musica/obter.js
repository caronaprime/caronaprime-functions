
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

//    return res.send({ "nome" : req.jwt.nome, "method": req.method })
	const { id } = req.params;
     return db.query(`
        CALL PCD_CANTAI_OBTER_MUSICA(${id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result });
    });

}
