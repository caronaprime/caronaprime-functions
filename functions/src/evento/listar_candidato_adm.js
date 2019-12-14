
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
	const {id} = req.params;
     return db.query(`
        CALL PCD_CANTAI_LISTAR_CANDIDATO_DO_EVENTO_ADM(${id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });


//res.send(true);
}
