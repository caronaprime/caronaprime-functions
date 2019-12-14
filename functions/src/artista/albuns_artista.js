
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {id} = req.params;

    if(id == null){
        res.send({"success": false, "message": "Informe o id do artista."});
    }

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    var artistas = await db.query(`CALL PCD_CANTAI_LISTAR_ARTISTA(${id}, ${req.jwt.id});`)

    await util(artistas[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))

        if (resultado.FAVORITADO == null) {
           resultado.FAVORITADO = "N"
        }
        
        var albuns = await db.query(`
           CALL PCD_CANTAI_LISTAR_ALBUNS_ARTISTA(${resultado.ID_ARTISTA})
        `)

        artistas[0][index].ALBUNS = albuns[0]

    })

    return res.send({ "ALBUNS" : artistas[0] });

}
