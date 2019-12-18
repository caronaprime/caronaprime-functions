// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
const {qualidade} = req.query;

    if(qualidade == null){
      res.send({"success": false, "message": "Informe a qualidade."});
    }
    if(qualidade == 0){
      qualidade = 1;
    }

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    var albuns = await db.query(`CALL PCD_CANTAI_LISTAR_ALBUM_FAVORITAS();`)

    await util(albuns[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))

        var musicas = await db.query(`
           CALL PCD_CANTAI_LISTAR_FAVORITOS_MUSICA(${req.jwt.id})
        `)

        // foto do album
        var foto_album = el.FOTO

        await util(musicas[0], async (el, index) => {
            el.LINK_MUSICA = `https://storage.googleapis.com/audio.cantaish.com.br/${el.ID_ALBUM}/${el.ID_MUSICA}-Q${qualidade}.mp3`
        })

        albuns[0][index].MUSICAS = musicas[0]

    })

    return res.send({ "ALBUM" : albuns[0] });

}
