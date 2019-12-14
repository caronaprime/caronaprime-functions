
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
  const {id} = req.params;
	var util = []

    if(id == null){
        res.send({"success": false, "message": "Informe o id do album."});
    }

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
     return db.query(`
        CALL PCD_CANTAI_LISTAR_MUSICAS_POR_ALBUM(${id});
        `, (error, result) => {
        if (error) throw error;

        res.send({ "items" : result[0] });
    });

}
