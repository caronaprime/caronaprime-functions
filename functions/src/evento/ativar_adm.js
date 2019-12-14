const db = require('db').asyncConnect()
module.exports = async (req, res) => {
    const { id } = req.body;
    if (id == null || id == '' ) {
        return res.send({ "success": false, "message": "Algo deu errado com o id da categoria para ativar"});
    }
    return db.query(`
        CALL PCD_CANTAI_ATIVAR_EVENTO_ADM(${id});
        `, (error, result) => {
        if (error) throw error;
        
        res.send({ "success" : true});
    });

}
