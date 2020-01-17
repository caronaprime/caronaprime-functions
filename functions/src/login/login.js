const jwt = require('jwt')

// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {

    const { celular } = req.params

    return await db.query(`
    SELECT id, celular FROM caronaprime.Usuarios WHERE celular = '${celular}';
        `, (error, result) => {
        if (error) throw error;

        var dados = jwt.sign({ id: result[0].id, celular: result[0].celular})

        res.send({ "success" : true, "token": dados});
    });
}