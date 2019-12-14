
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
	const {pagina} = req.query;

    if(pagina == null){
        pagina = 0;
    }
    
     return db.query(`
        CALL PCD_CANTAI_LISTAR_CATEGORIAS_LETRAS_TODAS(${req.jwt.id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });


//res.send(true);
}