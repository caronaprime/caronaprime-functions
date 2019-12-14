
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

     // CORS
   res.header("Access-Control-Allow-Origin", "*")
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token")

     return db.query(`
        CALL PCD_CANTAI_ASSINATURAS();
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });
}
