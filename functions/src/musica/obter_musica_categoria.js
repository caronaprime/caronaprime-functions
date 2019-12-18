
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

//    return res.send({ "nome" : req.jwt.nome, "method": req.method })
       const {id} = req.params; // Vem na frente da barra
       const {pagina} = req.query
       return db.query(`
        CALL PCD_CANTAI_LISTAR_MUSICAS_POR_CATEGORIA(${pagina}, ${id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });

}
