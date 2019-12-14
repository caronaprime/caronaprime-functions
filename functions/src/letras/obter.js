
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    var util = []
    const {id} = req.params;
    const {qualidade} = req.query;

    if(id == null){
        res.send({"success": false, "message": "Informe o id da música"});
    }
    if(qualidade == null){
        qualidade = 1
    }

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    var letras = await db.query(`CALL PCD_CANTAI_OBTER_LETRA(${req.jwt.id}, ${id});`)

    await util(letras[0], async (el, index) => {
         if (el.CODG_ALBUM != null && el.CODG_ALBUM != 0) {
             el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
        }
    })

    return res.send({ "items": letras[0] });

}