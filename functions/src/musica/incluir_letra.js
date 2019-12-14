
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    const { id, letra } = req.body;
    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "id faltando"});
    }
    if (letra == null || letra == '' ) {
        return res.send({ "success": false, "message": "Insira a letra da música. Caso não tenha, é apenas fechar este modal"});
    }
    var stirngletra = ""+letra+"";
    return db.query(`
        CALL PCD_CANTAI_INCLUSAO_LETRA_NA_MUSICA_ADM(${id}, '${stirngletra}');
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}
