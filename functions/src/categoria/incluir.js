
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    const { nome } = req.body;
    if (nome == null || nome == '' ) {
        return res.send({ "success": false, "message": "Escolha pelo menos uma categoria para o artista"});
    }
    return db.query(`
        CALL PCD_CANTAI_INCLUSAO_CATEGORIA_ADM('${nome}');
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}
