
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {id} = req.params;
  const {qualidade} = req.query;

    if(id == null){
        res.send({"success": false, "message": "Informe o id da playlist."});
    }
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

    var albuns = await db.query(`CALL PCD_CANTAI_LISTAR_PLAYLIST(${id}, ${req.jwt.id});`)

    await util(albuns[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))

        if (resultado.FAVORITADO == null) {
           resultado.FAVORITADO = "N"
        }
        
        var premiuns = await db.query(`
           CALL PCD_CANTAI_PREMIUNS_PLAYLIST(${resultado.ID_PLAYLIST})
        `)

        var musicas = await db.query(`
           CALL PCD_CANTAI_LISTAR_MUSICAS_PLAYLIST(${resultado.ID_PLAYLIST}, ${req.jwt.id})
        `)

        await util(musicas[0], async (el, index) => {
            el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.ID_ALBUM}/${el.ID_MUSICA}-Q${qualidade}.mp3`
            //el.LINK_MUSICA = `https://storage.googleapis.com/audio.cantaish.com.br/${id}/A${el.ID_MUSICA}.mp3`
            //el.FOTO_MUSICA = el.FOTO_ALBUM
        })

        albuns[0][index].PREMIUNS = premiuns[0]
        albuns[0][index].MUSICAS = musicas[0]

    })

    return res.send({ "PLAYLIST" : albuns[0] });

}
