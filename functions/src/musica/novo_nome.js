
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    const { id, nome_musica } = req.body;
    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "Música não encontrada"});
    }
    if (nome_musica == null || nome_musica == '' ) {
        return res.send({ "success": false, "message": "A música necessita de um nome"});
    }
    return db.query(`
        CALL PCD_CANTAI_ALTERAR_NOME_MUSICA_ADM(${id}, '${nome_musica}');
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}
