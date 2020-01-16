
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    return await db.query(`
    SELECT nome, celular FROM caronaprime.Usuarios WHERE id = ${req.jwt.id};
        `, (error, result) => {
        if (error) throw error;

        //comentario
        res.send({ "success" : true, "usuario": result[0]});
    });
}