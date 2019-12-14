
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    const { id, numr } = req.body;
    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "Algo deu errado com o id do album para publicar"});
    }
    if (numr == null || numr == '' ) {
        return res.send({ "success": false, "message": "Algo deu errado com o número de múscias para publicar"});
    }
    return db.query(`
        CALL PCD_CANTAI_PUBLICAR_ALBUM_ADM(${id});
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}
