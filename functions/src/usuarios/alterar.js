
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    const { nome } = req.body

    return await db.query(`
    UPDATE caronaprime.Usuarios SET nome = '${nome}' WHERE (id = ${req.jwt.id});
        `, (error, result) => {
        if (error) throw error;

        //comentario
        res.send({ "success" : true, "usuario": result[0]});
    });
}