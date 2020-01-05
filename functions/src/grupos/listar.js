
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    return await db.query(`
    SELECT * FROM caronaprime.GRUPOS;
        `, (error, result) => {
        if (error) throw error;

        //comentario
        res.send({ "success" : true, "grupos": result[0]});
    });
}