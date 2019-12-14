
// Conexão
const db = require('db').asyncConnect()

module.exports = async (req, res) => {
  var util = []
  const {qualidade} = req.query;

    util = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    var topicos = await db.query(`CALL PCD_CANTAI_LISTAR_TOPICO_FEED_V2(${req.jwt.id});`)
    
    await util(topicos[0], async (el, index) => {

        var resultado = JSON.parse(JSON.stringify(el))

        if (resultado.TIPO == "ALBUM") {
            var albuns = await db.query(`
               CALL PCD_CANTAI_LISTAR_ALBUNS_TOPICO_FEED_V2(${req.jwt.id}, ${resultado.ID_TOPICO_FEED})
             `) 
             topicos[0][index].ALBUNS = albuns[0]
         } 
        else {
            var letras = await db.query(`
              CALL PCD_CANTAI_LISTAR_LETRAS_TOPICO_FEED(${req.jwt.id}, ${resultado.ID_TOPICO_FEED})
          `)

          await util(letras[0], async (el, index) => {
            if (el.CODG_ALBUM != null && el.CODG_ALBUM != 0) {
                el.LINK_MUSICA = `https://storage.googleapis.com/audios.cantaish.com.br/${el.CODG_ALBUM}/${el.CODG_MUSICA}-Q${qualidade}.mp3`
            }
          })

          topicos[0][index].LETRAS = letras[0]
        }

    })

    return res.send({ "TOPICOS" : topicos[0] });

}