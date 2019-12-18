
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
    var util = []
     const {pesquisa, pagina, qualidade} = req.query;

     util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }
    
     var letras = await db.query(`
        CALL PCD_CANTAI_LISTAR_LETRAS_PESQUISA_COMPLETA(${req.jwt.id}, ${pesquisa}, ${pagina});
    `)

     await util(letras[0], async (el, index) => {
        if (el.CODG_ALBUM != null && el.CODG_ALBUM != 0) {
           el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
         }
    })

    res.send({ "LETRAS" : letras[0] });


}
