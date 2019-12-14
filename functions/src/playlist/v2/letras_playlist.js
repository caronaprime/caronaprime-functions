
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
var util = []
  const {id} = req.params;
  const {qualidade} = req.query;

    if(id == null){
        res.send({"success": false, "message": "Informe o id da lista."});
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

    var lista = await db.query(`CALL PCD_CANTAI_LISTAR_PLAYLIST(${id}, ${req.jwt.id});`)

    await util(lista[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))
        
        var premiuns = await db.query(`
           CALL PCD_CANTAI_PREMIUNS_PLAYLIST(${resultado.ID_PLAYLIST})
        `)

        var letras = await db.query(`
           CALL PCD_CANTAI_LISTAR_LETRAS_PLAYLIST(${req.jwt.id}, ${resultado.ID_PLAYLIST})
        `)

        await util(letras[0], async (el, index) => {
            el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
            //el.LINK_MUSICA = `https://storage.googleapis.com/audio.cantaish.com.br/${id}/A${el.ID_MUSICA}.mp3`
            //el.FOTO_MUSICA = el.FOTO_ALBUM
            //
        })

        lista[0][index].PREMIUNS = premiuns[0]
        lista[0][index].LETRAS = letras[0]

    })

    return res.send({ "PLAYLIST" : lista[0] });

}
