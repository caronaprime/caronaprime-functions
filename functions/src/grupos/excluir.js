
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    // Parâmetros
    const { grupo } = req.params;

    // Validar parâmetros obrigatórios
    if (grupo == null || grupo == '' ) {
        return res.send({ "success": false, "message": "Campo grupo é obrigatório"});
    }
   
    return await db.query(`
        CALL PCD_EXCLUIR_GRUPO(${grupo});
        `, (error, result) => {
        if (error) throw error;

        
        res.send({ "success" : true, "message": "Exclusão realizada com sucesso!" });
    });

}
