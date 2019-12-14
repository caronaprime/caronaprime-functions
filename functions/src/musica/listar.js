// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    const {pagina} = req.query;

    if(pagina == null){
        pagina =0;
    }
     return db.query(`
        CALL PCD_CANTAI_LISTAR_MUSICAS(${pagina});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });

}